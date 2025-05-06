<?php
require_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Пользователь не авторизован.']);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Метод не разрешен.']);
  exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data['address'], $data['phone'], $data['payment_method'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Не все обязательные поля для заказа заполнены (адрес, телефон, метод оплаты).']);
  exit;
}

$delivery_address = trim($data['address']);
$customer_phone = trim($data['phone']);
$comment = isset($data['comment']) ? trim($data['comment']) : null;
$payment_method = $data['payment_method'];
$customer_name = isset($data['customer_name']) ? trim($data['customer_name']) : null;
$user_int_id = $_SESSION['user_id'];

try {
  $pdo->beginTransaction();

  $sql_cart = 'SELECT ci.id, p.id AS product_id, p.name AS product_name, p.current_price AS price_at_order, ci.quantity
               FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = :user_int_id';
  $stmt_cart = $pdo->prepare($sql_cart);
  $stmt_cart->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt_cart->execute();
  $cart_items = $stmt_cart->fetchAll(PDO::FETCH_ASSOC);

  if (empty($cart_items)) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => 'Корзина пуста. Невозможно оформить заказ.']);
    exit;
  }

  $total_amount = 0;
  foreach ($cart_items as $item) {
    $total_amount += (float)$item['price_at_order'] * (int)$item['quantity'];
  }

  $sql_get_user_hex = 'SELECT user_hex_id FROM users WHERE user_int_id = :user_int_id LIMIT 1';
  $stmt_get_user_hex = $pdo->prepare($sql_get_user_hex);
  $stmt_get_user_hex->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt_get_user_hex->execute();
  $user_data = $stmt_get_user_hex->fetch(PDO::FETCH_ASSOC);

  if (!$user_data || empty($user_data['user_hex_id'])) {
    $pdo->rollBack();
    error_log('User hex ID not found for user_int_id: ' . $user_int_id);
    throw new Exception('Не удалось получить ID пользователя.');
  }

  //вот тут на будущее генерируется очень забугорный код (в бд) для заказов - он состоит из user_hex_id и, собственно, идентификатора заказа - получается уникальный внешний ключ для взаимодействия которой и пробрутить нельзя и имея его мало что получишь не имея доступа к бд, со стандартными ключами слишком предсказуемо = небезопасно

  $user_hex_id_prefix = strtoupper(substr($user_data['user_hex_id'], 0, 6));

  $sql_last_order_code = 'SELECT order_hex_id FROM orders WHERE user_id = :user_int_id ORDER BY ordered_at DESC, id DESC LIMIT 1';
  $stmt_last_order_code = $pdo->prepare($sql_last_order_code);
  $stmt_last_order_code->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt_last_order_code->execute();
  $last_order_data = $stmt_last_order_code->fetch(PDO::FETCH_ASSOC);

  $last_code_number = -1;
  if ($last_order_data && !empty($last_order_data['order_hex_id'])) {
    $parts = explode('-', $last_order_data['order_hex_id']);
    if (count($parts) === 2 && strlen($parts[1]) === 3 && ctype_xdigit($parts[1])) {
      $last_code_number = hexdec($parts[1]);
    }
  }

  $next_code_number = $last_code_number + 1;
  if ($next_code_number > hexdec('FFF')) {
    $next_code_number = 0;
    error_log('User order code sequence overflow for user ' . $user_int_id . '. Resetting code to 000.');
  }

  $next_code_hex = str_pad(dechex($next_code_number), 3, '0', STR_PAD_LEFT);
  $order_hex_id = $user_hex_id_prefix . '-' . strtoupper($next_code_hex);

  $sql_check_unique = 'SELECT COUNT(*) FROM orders WHERE order_hex_id = :order_hex_id';
  $stmt_check_unique = $pdo->prepare($sql_check_unique);
  $stmt_check_unique->bindParam(':order_hex_id', $order_hex_id);
  $stmt_check_unique->execute();

  if ($stmt_check_unique->fetchColumn() > 0) {
    $pdo->rollBack();
    error_log('Generated duplicate order_hex_id for user ' . $user_int_id . ': ' . $order_hex_id);
    throw new Exception('Не удалось сгенерировать уникальный номер заказа.');
  }

  $sql_order = 'INSERT INTO orders (order_hex_id, user_id, total_amount, delivery_address, customer_phone, comment, status, status_text, ordered_at, customer_name)
                VALUES (:order_hex_id, :user_id, :total_amount, :delivery_address, :customer_phone, :comment, "new", "Новый заказ", NOW(), :customer_name)';
  $stmt_order = $pdo->prepare($sql_order);
  $stmt_order->bindParam(':order_hex_id', $order_hex_id);
  $stmt_order->bindParam(':user_id', $user_int_id, PDO::PARAM_INT);
  $stmt_order->bindParam(':total_amount', $total_amount);
  $stmt_order->bindParam(':delivery_address', $delivery_address);
  $stmt_order->bindParam(':customer_phone', $customer_phone);
  $stmt_order->bindParam(':comment', $comment);
  $stmt_order->bindParam(':customer_name', $customer_name);
  $stmt_order->execute();

  $new_order_int_id = $pdo->lastInsertId();

  $sql_order_item = 'INSERT INTO order_items (order_id, product_id, product_name, price_at_order, quantity, details_at_order)
                     VALUES (:order_id, :product_id, :product_name, :price_at_order, :quantity, :details_at_order)';
  $stmt_order_item = $pdo->prepare($sql_order_item);

  foreach ($cart_items as $item) {
    $stmt_order_item->bindParam(':order_id', $new_order_int_id, PDO::PARAM_INT);
    $stmt_order_item->bindParam(':product_id', $item['product_id'], PDO::PARAM_INT);
    $stmt_order_item->bindParam(':product_name', $item['product_name']);
    $stmt_order_item->bindParam(':price_at_order', $item['price_at_order']);
    $stmt_order_item->bindParam(':quantity', $item['quantity'], PDO::PARAM_INT);
    $stmt_order_item->bindValue(':details_at_order', null, PDO::PARAM_NULL);
    $stmt_order_item->execute();
  }

  $sql_clear_cart = 'DELETE FROM cart_items WHERE user_id = :user_int_id';
  $stmt_clear_cart = $pdo->prepare($sql_clear_cart);
  $stmt_clear_cart->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt_clear_cart->execute();

  $pdo->commit();

  http_response_code(200);
  echo json_encode(['success' => true, 'message' => 'Заказ успешно оформлен!', 'order_hex_id' => $order_hex_id]);
} catch (PDOException $e) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  error_log('Ошибка БД при оформлении заказа: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Не удалось оформить заказ.']);
} catch (Exception $e) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  error_log('Неизвестная ошибка при оформлении заказа: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
<?php
require_once '../../db_connect.php';
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

if (!isset($data['product_id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Не указан ID товара для добавления.']);
  exit;
}

$product_id = $data['product_id'];
$quantity = isset($data['quantity']) && is_numeric($data['quantity']) && $data['quantity'] > 0 ? (int)$data['quantity'] : 1;
$user_int_id = $_SESSION['user_id'];

try {
  $sql_check = 'SELECT id, quantity FROM cart_items WHERE user_id = :user_id AND product_id = :product_id LIMIT 1';
  $stmt_check = $pdo->prepare($sql_check);
  $stmt_check->bindParam(':user_id', $user_int_id, PDO::PARAM_INT);
  $stmt_check->bindParam(':product_id', $product_id, PDO::PARAM_INT);
  $stmt_check->execute();
  $existing_item = $stmt_check->fetch(PDO::FETCH_ASSOC);

  if ($existing_item) {
    $new_quantity = $existing_item['quantity'] + $quantity;
    $sql_update = 'UPDATE cart_items SET quantity = :quantity WHERE id = :item_id';
    $stmt_update = $pdo->prepare($sql_update);
    $stmt_update->bindParam(':quantity', $new_quantity, PDO::PARAM_INT);
    $stmt_update->bindParam(':item_id', $existing_item['id'], PDO::PARAM_INT);
    $stmt_update->execute();

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Количество товара обновлено.']);
  } else {
    $sql_insert = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)';
    $stmt_insert = $pdo->prepare($sql_insert);
    $stmt_insert->bindParam(':user_id', $user_int_id, PDO::PARAM_INT);
    $stmt_insert->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt_insert->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt_insert->execute();

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Товар добавлен в корзину.']);
  }
} catch (PDOException $e) {
  error_log('Ошибка БД при добавлении/обновлении корзины: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла ошибка сервера.']);
} catch (Exception $e) {
  error_log('Неизвестная ошибка при добавлении/обновлении корзины: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
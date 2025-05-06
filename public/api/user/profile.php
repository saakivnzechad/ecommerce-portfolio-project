<?php
require_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Пользователь не авторизован.']);
  exit;
}

$user_int_id = $_SESSION['user_id'];

try {
  $sql_user = 'SELECT user_hex_id, name, phone, email, dob FROM users WHERE user_int_id = :user_int_id LIMIT 1';
  $stmt_user = $pdo->prepare($sql_user);
  $stmt_user->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt_user->execute();
  $user_data = $stmt_user->fetch(PDO::FETCH_ASSOC);

  if (!$user_data) {
    session_unset();
    session_destroy();
    http_response_code(404);
    echo json_encode(['error' => 'Данные пользователя не найдены.']);
    exit;
  }

  $sql_addresses = 'SELECT id, address_string, details, label FROM user_addresses WHERE user_id = :user_int_id ORDER BY created_at ASC';
  $stmt_addresses = $pdo->prepare($sql_addresses);
  $stmt_addresses->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt_addresses->execute();
  $user_addresses = $stmt_addresses->fetchAll(PDO::FETCH_ASSOC);

  $sql_orders = 'SELECT id, order_hex_id, total_amount, status, status_text, delivery_address, comment, ordered_at, delivery_time_minutes, customer_phone, customer_name
                 FROM orders WHERE user_id = :user_int_id ORDER BY ordered_at DESC';
  $stmt_orders = $pdo->prepare($sql_orders);
  $stmt_orders->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt_orders->execute();
  $user_orders = $stmt_orders->fetchAll(PDO::FETCH_ASSOC);

  $orders_with_items = [];
  foreach ($user_orders as $order) {
    $sql_order_items = 'SELECT id, product_name, price_at_order, quantity, details_at_order FROM order_items WHERE order_id = :order_id';
    $stmt_order_items = $pdo->prepare($sql_order_items);
    $stmt_order_items->bindParam(':order_id', $order['id'], PDO::PARAM_INT);
    $stmt_order_items->execute();
    $order['items'] = $stmt_order_items->fetchAll(PDO::FETCH_ASSOC);
    $orders_with_items[] = $order;
  }

  echo json_encode([
    'user' => $user_data,
    'addresses' => $user_addresses,
    'orders' => $orders_with_items
  ]);
} catch (PDOException $e) {
  error_log('Ошибка БД при получении данных профиля: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Не удалось загрузить данные профиля.']);
} catch (Exception $e) {
  error_log('Неизвестная ошибка при получении данных профиля: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
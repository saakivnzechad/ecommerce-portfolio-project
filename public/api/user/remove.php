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

if (!isset($data['cart_item_id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Не указан ID элемента корзины.']);
  exit;
}

$cart_item_id = $data['cart_item_id'];
$user_int_id = $_SESSION['user_id'];

try {
  $sql = 'DELETE FROM cart_items WHERE id = :cart_item_id AND user_id = :user_int_id';
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':cart_item_id', $cart_item_id, PDO::PARAM_INT);
  $stmt->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Товар удален из корзины.']);
  } else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Элемент корзины не найден или недоступен.']);
  }
} catch (PDOException $e) {
  error_log('Ошибка БД при удалении товара из корзины: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Не удалось удалить товар из корзины.']);
} catch (Exception $e) {
  error_log('Неизвестная ошибка при удалении товара из корзины: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
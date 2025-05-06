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

if (!isset($data['address_string']) || !trim($data['address_string'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Адрес не указан.']);
  exit;
}

$user_id = $_SESSION['user_id'];
$address_string = trim($data['address_string']);
$details = isset($data['details']) ? trim($data['details']) : '';
$label = isset($data['label']) ? trim($data['label']) : 'Новый адрес';

try {
  $sql = 'INSERT INTO user_addresses (user_id, address_string, details, label, created_at, updated_at) VALUES (:user_id, :address_string, :details, :label, NOW(), NOW())';
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
  $stmt->bindParam(':address_string', $address_string);
  $stmt->bindParam(':details', $details);
  $stmt->bindParam(':label', $label);
  $stmt->execute();

  $address_id = $pdo->lastInsertId();

  http_response_code(201);
  echo json_encode(['success' => true, 'address_id' => $address_id, 'message' => 'Адрес успешно сохранён.']);
} catch (PDOException $e) {
  error_log('Ошибка БД при сохранении адреса: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Не удалось сохранить адрес.']);
} catch (Exception $e) {
  error_log('Неизвестная ошибка: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
<?php
require_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Пользователь не авторизован.']);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
  http_response_code(405);
  echo json_encode(['error' => 'Метод не разрешен.']);
  exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$user_int_id = $_SESSION['user_id'];
$update_fields = [];
$params = [':user_int_id' => $user_int_id];

if (isset($data['name'])) {
  $update_fields[] = 'name = :name';
  $params[':name'] = trim($data['name']);
}

if (isset($data['dob'])) {
  $update_fields[] = 'dob = :dob';
  $params[':dob'] = !empty($data['dob']) ? $data['dob'] : null;
}

if (empty($update_fields)) {
  http_response_code(400);
  echo json_encode(['error' => 'Нет данных для обновления.']);
  exit;
}

$sql = 'UPDATE users SET ' . implode(', ', $update_fields) . ' WHERE user_int_id = :user_int_id';

try {
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);

  http_response_code(200);
  echo json_encode(['success' => true, 'message' => 'Данные профиля успешно обновлены.']);
} catch (PDOException $e) {
  error_log('Ошибка БД при обновлении профиля: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Не удалось обновить данные профиля.']);
} catch (Exception $e) {
  error_log('Неизвестная ошибка при обновлении профиля: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
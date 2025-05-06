<?php
require_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Метод не разрешен.']);
  exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data['phone'], $data['password'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Не указаны телефон или пароль.']);
  exit;
}

$phone = $data['phone'];
$password = $data['password'];

try {
  $sql = 'SELECT user_int_id, password_hash FROM users WHERE phone = :phone LIMIT 1';
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':phone', $phone);
  $stmt->execute();
  $user = $stmt->fetch();

  if ($user && password_verify($password, $user['password_hash'])) {
    $_SESSION['user_id'] = $user['user_int_id'];

    $sql_user_data = 'SELECT user_hex_id AS id, name, phone, email, dob FROM users WHERE user_int_id = :user_int_id LIMIT 1';
    $stmt_user_data = $pdo->prepare($sql_user_data);
    $stmt_user_data->bindParam(':user_int_id', $user['user_int_id']);
    $stmt_user_data->execute();
    $authenticated_user = $stmt_user_data->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'Авторизация успешна.',
      'user' => $authenticated_user
    ]);
    exit;
  }

  http_response_code(401);
  echo json_encode(['error' => 'Неверный телефон или пароль.']);
} catch (PDOException $e) {
  error_log('Ошибка БД при авторизации: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла ошибка сервера при авторизации.']);
} catch (Exception $e) {
  error_log('Неизвестная ошибка при авторизации: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
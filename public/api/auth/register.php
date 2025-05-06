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

if (!isset($data['phone'], $data['password'], $data['name'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Не указаны обязательные поля.']);
  exit;
}

$phone = $data['phone'];
$password = $data['password'];
$name = $data['name'];
$email = $data['email'] ?? null;
$dob = $data['dob'] ?? null;

try {
  $sql_check = 'SELECT COUNT(*) FROM users WHERE phone = :phone OR email = :email';
  $stmt_check = $pdo->prepare($sql_check);
  $stmt_check->bindParam(':phone', $phone);
  $stmt_check->bindParam(':email', $email);
  $stmt_check->execute();

  if ($stmt_check->fetchColumn() > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Телефон или email уже зарегистрированы.']);
    exit;
  }

  $is_unique = false;
  $user_hex_id = '';

  while (!$is_unique) {
    $user_hex_id = bin2hex(random_bytes(3));
    $sql_check_hex = 'SELECT COUNT(*) FROM users WHERE user_hex_id = :user_hex_id';
    $stmt_check_hex = $pdo->prepare($sql_check_hex);
    $stmt_check_hex->bindParam(':user_hex_id', $user_hex_id);
    $stmt_check_hex->execute();

    if ($stmt_check_hex->fetchColumn() === 0) {
      $is_unique = true;
    }
  }

  $password_hash = password_hash($password, PASSWORD_DEFAULT);

  $sql_insert = 'INSERT INTO users (user_hex_id, name, phone, email, password_hash, dob) VALUES (:user_hex_id, :name, :phone, :email, :password_hash, :dob)';
  $stmt_insert = $pdo->prepare($sql_insert);
  $stmt_insert->bindParam(':user_hex_id', $user_hex_id);
  $stmt_insert->bindParam(':name', $name);
  $stmt_insert->bindParam(':phone', $phone);
  $stmt_insert->bindParam(':email', $email);
  $stmt_insert->bindParam(':password_hash', $password_hash);
  $stmt_insert->bindParam(':dob', $dob);
  $stmt_insert->execute();

  $user_int_id = $pdo->lastInsertId();
  $_SESSION['user_id'] = $user_int_id;

  $sql_user_data = 'SELECT user_hex_id AS id, name, phone, email, dob FROM users WHERE user_int_id = :user_int_id LIMIT 1';
  $stmt_user_data = $pdo->prepare($sql_user_data);
  $stmt_user_data->bindParam(':user_int_id', $user_int_id);
  $stmt_user_data->execute();
  $registered_user = $stmt_user_data->fetch(PDO::FETCH_ASSOC);

  http_response_code(201);
  echo json_encode([
    'success' => true,
    'message' => 'Регистрация прошла успешно!',
    'user' => $registered_user
  ]);
} catch (PDOException $e) {
  error_log('Ошибка БД при регистрации: ' . $e->getMessage());
  if ($e->getCode() === '23000') {
    http_response_code(409);
    echo json_encode(['error' => 'Телефон или email уже зарегистрированы.']);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Произошла ошибка сервера при регистрации.']);
  }
} catch (Exception $e) {
  error_log('Неизвестная ошибка при регистрации: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['error' => 'Произошла неизвестная ошибка.']);
}
?>
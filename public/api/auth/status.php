<?php
require_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
  try {
    $sql = 'SELECT user_hex_id, name, phone, email, dob FROM users WHERE user_int_id = :user_id LIMIT 1';
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch();

    if ($user) {
      echo json_encode([
        'authenticated' => true,
        'user' => [
          'id' => $user['user_hex_id'],
          'name' => $user['name'],
          'phone' => $user['phone'],
          'email' => $user['email'],
          'dob' => $user['dob']
        ]
      ]);
    } else {
      session_unset();
      session_destroy();
      echo json_encode(['authenticated' => false]);
    }
  } catch (PDOException $e) {
    error_log('Ошибка БД при проверке статуса авторизации: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера при проверке статуса.']);
  }
} else {
  echo json_encode(['authenticated' => false]);
}
?>
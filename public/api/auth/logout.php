<?php
require_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

session_unset();
session_destroy();

if (ini_get('session.use_cookies')) {
  $params = session_get_cookie_params();
  setcookie(
    session_name(),
    '',
    time() - 42000,
    $params['path'],
    $params['domain'],
    $params['secure'],
    $params['httponly']
  );
}

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Выход выполнен успешно.']);
?>
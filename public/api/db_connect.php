<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

//дефолт данные для лок phpmyadmin (ну, для субд точнее самой)
$db_host = 'localhost';
$db_name = 'risa_mnogo';
$db_user = 'root';
$db_password = '';

$dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_password, $options);

    return $pdo;

} catch (\PDOException $e) {
    http_response_code(500);

    error_log("Ошибка подключения к базе данных: " . $e->getMessage());
    echo json_encode(["error" => "Произошла ошибка на сервере. Пожалуйста, попробуйте позже."]);

    exit;
}
?>
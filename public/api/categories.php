<?php

require_once 'db_connect.php';

header('Content-Type: application/json');

try {
    $sql = "SELECT
                id,
                name,
                display_order
            FROM
                categories
            ORDER BY
                display_order ASC, name ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $categories = $stmt->fetchAll();

    echo json_encode($categories);

} catch (\PDOException $e) {
    error_log("Ошибка при получении списка категорий: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Не удалось загрузить список категорий."]);

} catch (\Exception $e) {
    error_log("Неизвестная ошибка в categories.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Произошла неизвестная ошибка."]);
}
?>
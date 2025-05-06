<?php

require_once 'db_connect.php';

header('Content-Type: application/json');

try {
    $sql = "SELECT
                p.id,
                p.category_id,
                c.name AS category_name,
                p.name,
                p.description,
                p.image_url,
                p.current_price,
                p.old_price,
                p.calories,
                p.weight
            FROM
                products p
            LEFT JOIN
                categories c ON p.category_id = c.id
            ORDER BY
                p.id ASC
            LIMIT 4";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $popularItems = $stmt->fetchAll();

    echo json_encode($popularItems);

} catch (\PDOException $e) {
    error_log("Ошибка при получении списка популярных товаров: " . $e->getMessage());

    http_response_code(500);
    echo json_encode(["error" => "Не удалось загрузить список популярных товаров."]);

} catch (\Exception $e) {
    error_log("Неизвестная ошибка в popular-items.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Произошла неизвестная ошибка."]);
}
?>
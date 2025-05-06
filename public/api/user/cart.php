<?php

require_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Пользователь не авторизован."]);
    exit;
}

$user_int_id = $_SESSION['user_id'];

try {
    $sql = "SELECT
                ci.id,
                p.id AS product_id,
                p.name,
                p.image_url,
                p.current_price,
                ci.quantity
            FROM
                cart_items ci
            JOIN
                products p ON ci.product_id = p.id
            WHERE
                ci.user_id = :user_int_id
            ORDER BY
                ci.added_at ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_int_id', $user_int_id, PDO::PARAM_INT);
    $stmt->execute();

    $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["items" => $cart_items]);

} catch (\PDOException $e) {
    error_log("Ошибка БД при получении корзины: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Не удалось загрузить корзину."]);
} catch (\Exception $e) {
    error_log("Неизвестная ошибка при получении корзины: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Произошла неизвестная ошибка."]);
}
?>
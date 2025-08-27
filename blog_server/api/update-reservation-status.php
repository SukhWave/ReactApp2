<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'database.php';

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (!isset($data['id']) || !isset($data['is_booked'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing parameters']);
    exit();
}

$id = intval($data['id']);
$is_booked = $data['is_booked'] ? 1 : 0;

$stmt = $conn->prepare("UPDATE reservations SET is_booked=? WHERE id=?");
$stmt->bind_param("ii", $is_booked, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'is_booked' => $is_booked]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

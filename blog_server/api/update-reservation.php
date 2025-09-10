<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers for React app
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require '../config/database.php'; // Ensure correct path

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Read JSON input
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (!isset($data['id'], $data['is_booked'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit();
}

$id = intval($data['id']);
$is_booked = $data['is_booked'] ? 1 : 0;

// Update reservation
$stmt = $conn->prepare("UPDATE reservations SET is_booked = ? WHERE id = ?");
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

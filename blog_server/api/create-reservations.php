<?php

header("Access-Control-Allow-Origin: *");  // Allow all origins or replace with your frontend domain
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('../config/config.php');
require_once('../config/database.php');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the JSON input
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Validate required fields
if (!isset($data['area_id']) || !isset($data['time_slot_id']) || !isset($data['is_booked'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Error: Missing required parameter']);
    exit();
}

// Sanitize input
$area_id = filter_var($data['area_id'], FILTER_VALIDATE_INT);
$time_slot_id = filter_var($data['time_slot_id'], FILTER_VALIDATE_INT);
$is_booked = filter_var($data['is_booked'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

// Validate sanitization
if ($area_id === false || $time_slot_id === false || $is_booked === null) {
    http_response_code(400);
    echo json_encode(['message' => 'Error: Invalid input data']);
    exit();
}

// Convert boolean to integer for database storage (0 or 1)
$is_booked = $is_booked ? 1 : 0;

// Optional: Add support for user_name or reserved_at if needed
$stmt = $conn->prepare('INSERT INTO reservations (area_id, time_slot_id, is_booked) VALUES (?, ?, ?)');
$stmt->bind_param('iii', $area_id, $time_slot_id, $is_booked);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Reservation created successfully', 'id' => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error creating reservation: ' . $stmt->error]);
}

$stmt->close();
$conn->close();

?>

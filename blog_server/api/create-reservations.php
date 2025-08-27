<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers — adjust origin if needed
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
require_once('../config/database.php');  // Adjust path if needed

// Get JSON input
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Validate required fields
if (!isset($data['area_id'], $data['time_slot_id'], $data['is_booked'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit();
}

// Sanitize input
$area_id = filter_var($data['area_id'], FILTER_VALIDATE_INT);
$time_slot_id = filter_var($data['time_slot_id'], FILTER_VALIDATE_INT);
$is_booked = filter_var($data['is_booked'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

if ($area_id === false || $time_slot_id === false || $is_booked === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

$is_booked = $is_booked ? 1 : 0;

// Insert reservation
$stmt = $conn->prepare("INSERT INTO reservations (area_id, time_slot_id, is_booked) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $area_id, $time_slot_id, $is_booked);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Reservation created successfully',
        'reservation_id' => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once('../config/database.php');

$defaultImage = "placeholder_100.jpg";

// Read raw input
$request_body = file_get_contents("php://input");
$data = json_decode($request_body, true);

if (!$data || !isset($data['area_id'], $data['time_slot_id'], $data['is_booked'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing or invalid parameters"]);
    exit();
}

$area_id = intval($data['area_id']);
$time_slot_id = intval($data['time_slot_id']);
$is_booked = intval($data['is_booked']);

// Always assign default placeholder unless image upload implemented
$imageName = $defaultImage;

$stmt = $conn->prepare("INSERT INTO reservations (area_id, time_slot_id, is_booked, imageName) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiis", $area_id, $time_slot_id, $is_booked, $imageName);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Reservation created successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();

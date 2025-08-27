<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

// Database connection
require_once('../config/database.php');  // Adjust path if needed

// Fetch reservations with area and timeslot
$sql = "SELECT r.id, c.name AS area_name, t.slot_time, r.is_booked
        FROM reservations r
        JOIN conservation_areas c ON r.area_id = c.id
        JOIN time_slots t ON r.time_slot_id = t.id";

$result = $conn->query($sql);

$reservations = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }
    echo json_encode($reservations);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database query error: ' . $conn->error]);
}

$conn->close();
?>

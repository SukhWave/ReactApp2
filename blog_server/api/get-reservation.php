<?php
// Show all errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers for React app
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require '../config/database.php';

// Validate reservation ID
if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing reservation ID']);
    exit();
}

$id = intval($_GET['id']);

// Fetch reservation details using prepared statement
$sql = "SELECT r.id, 
               r.area_id,
               r.time_slot_id,
               a.name AS area_name, 
               a.description AS area_description, 
               t.slot_time, 
               r.is_booked,
               COALESCE(r.imageName, 'placeholder_100.jpg') AS imageName
        FROM reservations r
        JOIN conservation_areas a ON r.area_id = a.id
        JOIN time_slots t ON r.time_slot_id = t.id
        WHERE r.id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Ensure imageName is never empty
    if (empty($row['imageName'])) {
        $row['imageName'] = 'placeholder_100.jpg';
    }

    echo json_encode($row);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Reservation not found']);
}

$stmt->close();
$conn->close();
?>

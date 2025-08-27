<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require '../config/database.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing reservation ID']);
    exit();
}

$id = intval($_GET['id']);

$sql = "SELECT r.id, a.name AS area_name, a.description, t.slot_time, r.is_booked
        FROM reservations r
        JOIN conservation_areas a ON r.area_id = a.id
        JOIN time_slots t ON r.time_slot_id = t.id
        WHERE r.id = $id";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Reservation not found']);
}

$conn->close();
?>

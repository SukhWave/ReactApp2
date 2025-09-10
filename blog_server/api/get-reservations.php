<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require '../config/database.php';

$sql = "SELECT r.id, 
               a.name AS area_name, 
               a.description, 
               t.slot_time, 
               r.is_booked,
               COALESCE(r.imageName, 'placeholder_100.jpg') AS imageName
        FROM reservations r
        JOIN conservation_areas a ON r.area_id = a.id
        JOIN time_slots t ON r.time_slot_id = t.id";

$result = $conn->query($sql);

$reservations = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        if (empty($row['imageName'])) {
            $row['imageName'] = 'placeholder_100.jpg';
        }
        $reservations[] = $row;
    }
    echo json_encode($reservations);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Database query error: ' . $conn->error]);
}

$conn->close();
?>

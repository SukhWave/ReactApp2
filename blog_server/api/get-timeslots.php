<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once('../config/database.php');

$sql = "SELECT id, slot_time FROM time_slots ORDER BY slot_time";
$result = $conn->query($sql);

$slots = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $slots[] = $row;
    }
}

echo json_encode($slots);

$conn->close();
?>

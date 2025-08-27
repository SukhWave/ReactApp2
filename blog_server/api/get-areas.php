<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once('../config/database.php');

$sql = "SELECT id, name FROM conservation_areas ORDER BY name";
$result = $conn->query($sql);

$areas = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $areas[] = $row;
    }
}

echo json_encode($areas);

$conn->close();
?>


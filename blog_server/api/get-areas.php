<?php
// Enable errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers for React app
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

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

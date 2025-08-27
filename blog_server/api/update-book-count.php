<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('../config/database.php'); // correct path

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

// DEBUG LOGGING
error_log('Received JSON: ' . file_get_contents('php://input'));

if (!isset($data['reservation_id']) || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Missing parameters']);
    exit();
}

$reservation_id = intval($data['reservation_id']);
$action = $data['action'];

if ($action === 'book') {
    $sql = "UPDATE reservations SET book_count = 1, unbook_count = 0, is_booked = 1 WHERE id = ?";
} elseif ($action === 'unbook') {
    $sql = "UPDATE reservations SET book_count = 0, unbook_count = 1, is_booked = 0 WHERE id = ?";
} else {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Invalid action']);
    exit();
}

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $reservation_id);
if($stmt->execute()){
    echo json_encode(['success'=>true,'message'=>'Updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Database error: '.$stmt->error]);
}
$stmt->close();
$conn->close();
?>

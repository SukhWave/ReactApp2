<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

// CORS headers for React app
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once('../config/config.php');
require_once('../config/database.php');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['userName'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$userName = $data['userName'];
$password = $data['password'];

// Lookup user
$stmt = $conn->prepare("SELECT registrationID, userName, password, emailAddress, role FROM registrations WHERE userName = ?");
$stmt->bind_param("s", $userName);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        $_SESSION['user'] = [
            "registrationID" => $row['registrationID'],
            "userName" => $row['userName'],
            "emailAddress" => $row['emailAddress'],
            "role" => $row['role'],
        ];
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => $_SESSION['user'],
            "role" => $_SESSION['user']['role']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid password"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>

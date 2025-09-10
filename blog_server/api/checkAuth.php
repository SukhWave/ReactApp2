<?php
session_start();

// CORS headers for React app
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Return authentication status
if (isset($_SESSION['user'])) {
    echo json_encode([
        "authenticated" => true,
        "user" => $_SESSION['user']
    ]);
} else {
    echo json_encode([
        "authenticated" => false
    ]);
}
?>

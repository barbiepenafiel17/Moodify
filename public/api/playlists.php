<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use App\PlaylistService;

header('Content-Type: application/json');

// Simple rate limiting
session_start();
$currentMinute = floor(time() / 60);
if (!isset($_SESSION['rate_limit'])) {
    $_SESSION['rate_limit'] = [];
}
if (!isset($_SESSION['rate_limit'][$currentMinute])) {
    $_SESSION['rate_limit'] = [$currentMinute => 1];
} else if ($_SESSION['rate_limit'][$currentMinute] >= 60) {
    http_response_code(429);
    echo json_encode(['error' => true, 'message' => 'Rate limit exceeded. Please try again in a minute.']);
    exit;
} else {
    $_SESSION['rate_limit'][$currentMinute]++;
}

// Validate mood parameter
$mood = $_GET['mood'] ?? '';
if (empty($mood)) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Mood parameter is required']);
    exit;
}

try {
    $playlistService = new PlaylistService();
    $playlists = $playlistService->getPlaylistsByMood($mood);
    echo json_encode(['error' => false, 'data' => $playlists]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}

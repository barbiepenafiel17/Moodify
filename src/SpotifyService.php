<?php
namespace App;

class SpotifyService {
    private $clientId;
    private $clientSecret;
    private $tokenCachePath;
    private $token;

    public function __construct() {
        $this->clientId = Config::get('SPOTIFY_CLIENT_ID');
        $this->clientSecret = Config::get('SPOTIFY_CLIENT_SECRET');
        $this->tokenCachePath = __DIR__ . '/../storage/token.cache.json';
        
        // Ensure storage directory exists
        $storageDir = dirname($this->tokenCachePath);
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
        }
        
        $this->token = $this->getToken();
    }

    private function getToken() {
        if ($this->hasValidCachedToken()) {
            return json_decode(file_get_contents($this->tokenCachePath), true)['token'];
        }

        $token = $this->fetchNewToken();
        $this->cacheToken($token);
        return $token;
    }

    private function hasValidCachedToken() {
        if (!file_exists($this->tokenCachePath)) {
            return false;
        }

        $cache = json_decode(file_get_contents($this->tokenCachePath), true);
        return $cache['expires'] > time();
    }

    private function fetchNewToken() {
        $ch = curl_init('https://accounts.spotify.com/api/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Basic ' . base64_encode($this->clientId . ':' . $this->clientSecret),
            'Content-Type: application/x-www-form-urlencoded'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        $response = curl_exec($ch);
        
        if (curl_error($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new \Exception('CURL Error: ' . $error);
        }
        
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new \Exception('HTTP Error: ' . $httpCode . ' - ' . $response);
        }

        $data = json_decode($response, true);

        if (!isset($data['access_token'])) {
            throw new \Exception('Failed to get Spotify token: ' . ($data['error_description'] ?? 'Unknown error'));
        }

        return $data['access_token'];
    }

    private function cacheToken($token) {
        $cache = [
            'token' => $token,
            'expires' => time() + 3600 // Token expires in 1 hour
        ];
        
        // Ensure directory exists
        $dir = dirname($this->tokenCachePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        file_put_contents($this->tokenCachePath, json_encode($cache));
    }

    public function searchPlaylists($query, $limit = 20) {
        $ch = curl_init(sprintf(
            'https://api.spotify.com/v1/search?q=%s&type=playlist&limit=%d',
            urlencode($query),
            $limit
        ));

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        $response = curl_exec($ch);
        
        if (curl_error($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new \Exception('CURL Error: ' . $error);
        }
        
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 401) {
            // Token expired, get a new one and retry
            $this->token = $this->fetchNewToken();
            $this->cacheToken($this->token);
            return $this->searchPlaylists($query, $limit);
        }
        
        if ($httpCode !== 200) {
            throw new \Exception('HTTP Error: ' . $httpCode . ' - ' . $response);
        }

        $data = json_decode($response, true);

        if (!isset($data['playlists'])) {
            throw new \Exception('Failed to fetch playlists from Spotify');
        }

        return $data['playlists']['items'];
    }
}

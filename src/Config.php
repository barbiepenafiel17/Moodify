<?php
namespace App;

use Dotenv\Dotenv;
use RuntimeException;

class Config {
    private static $instance = null;
    private $env = [];

    private function __construct() {
        try {
            $rootPath = dirname(__DIR__);
            if (file_exists($rootPath . '/.env')) {
                $dotenv = Dotenv::createImmutable($rootPath);
                $dotenv->load();
            }
            
            // Ensure required environment variables are set
            $requiredVars = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET'];
            foreach ($requiredVars as $var) {
                if (!isset($_ENV[$var])) {
                    throw new \RuntimeException("Missing required environment variable: {$var}");
                }
            }
            
            $this->env = $_ENV;
        } catch (\Exception $e) {
            error_log("Config Error: " . $e->getMessage());
            throw new \RuntimeException("Failed to load configuration: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function get($key, $default = null) {
        $instance = self::getInstance();
        return $instance->env[$key] ?? $default;
    }
}

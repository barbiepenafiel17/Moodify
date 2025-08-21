moodify/
│
├── .env.example # Example environment file
├── .gitignore # Ignore env, vendor, cache
├── composer.json # For PHP deps (e.g., vlucas/phpdotenv)
├── README.md # Project setup & usage
│
├── public/ # Public-facing files (served by Apache/Nginx)
│ ├── index.php # Main page with mood picker & playlist grid
│ ├── api/ # API endpoints (server-side only)
│ │ ├── playlists.php # Fetch playlists from Spotify for a mood
│ │ ├── spotify.php # Helper for Spotify API token & requests
│ │ └── utils.php # Common helpers (sanitize, error output)
│ │
│ ├── assets/ # Static assets
│ │ ├── css/
│ │ │ ├── tailwind.css # Tailwind source (if building locally)
│ │ │ └── styles.css # Custom overrides / compiled Tailwind
│ │ ├── js/
│ │ │ ├── app.js # Main JS (fetch API, render UI)
│ │ │ └── ui.js # UI helpers (skeletons, error banners)
│ │ └── img/
│ │ ├── logo.svg
│ │ └── empty-state.svg
│ │
│ └── favicon.ico
│
├── src/ # PHP backend source (non-public)
│ ├── Config.php # Loads env vars, constants
│ ├── SpotifyService.php # Handles API requests, token caching
│ ├── PlaylistService.php # Maps moods to queries, formats results
│ └── Helpers.php # Common helper functions
│
├── storage/ # Cache & logs
│ ├── token.cache.json # Spotify token cache
│ └── logs/
│ └── app.log
│
└── vendor/ # Composer dependencies



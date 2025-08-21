<?php
namespace App;

class PlaylistService {
    private $spotifyService;
    private $moodMappings = [
        'happy' => ['happy', 'feel good', 'good vibes'],
        'chill' => ['chill', 'lofi', 'laid back', 'relax'],
        'sad' => ['sad', 'heartbreak', 'emo'],
        'focus' => ['focus', 'deep work', 'concentration', 'instrumental'],
        'energetic' => ['workout', 'hype', 'power', 'pump'],
        'romantic' => ['romantic', 'love', 'date night'],
        'party' => ['party', 'dance', 'club'],
        'sleep' => ['sleep', 'calm', 'ambient']
    ];

    public function __construct() {
        $this->spotifyService = new SpotifyService();
    }

    public function getPlaylistsByMood($mood) {
        if (!isset($this->moodMappings[$mood])) {
            throw new \Exception('Invalid mood specified');
        }

        $queries = $this->moodMappings[$mood];
        $playlists = [];
        $seenIds = [];

        foreach ($queries as $query) {
            try {
                $results = $this->spotifyService->searchPlaylists($query);
                foreach ($results as $playlist) {
                    // Only include playlists with images and proper data
                    if (!empty($playlist['images']) && !isset($seenIds[$playlist['id']])) {
                        $playlists[] = $this->formatPlaylist($playlist);
                        $seenIds[$playlist['id']] = true;
                        
                        // Stop when we have enough playlists
                        if (count($playlists) >= 24) {
                            break 2;
                        }
                    }
                }
            } catch (\Exception $e) {
                // Log error but continue with other queries
                error_log("Error searching for '$query': " . $e->getMessage());
                continue;
            }
        }

        return $playlists;
    }

    private function formatPlaylist($playlist) {
        // Get the best available image
        $image = null;
        if (!empty($playlist['images'])) {
            $image = $playlist['images'][0]['url'];
        }
        
        return [
            'id' => $playlist['id'],
            'name' => $playlist['name'] ?? 'Untitled Playlist',
            'description' => $playlist['description'] ?? '',
            'image' => $image,
            'owner' => $playlist['owner']['display_name'] ?? 'Unknown',
            'followers' => $playlist['followers']['total'] ?? 0,
            'external_url' => $playlist['external_urls']['spotify'] ?? '#'
        ];
    }
}

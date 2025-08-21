// Spotify Service
class SpotifyService {
  constructor() {
    this.clientId = CONFIG.SPOTIFY_CLIENT_ID;
    this.clientSecret = CONFIG.SPOTIFY_CLIENT_SECRET;
    this.token = null;
    this.tokenExpiry = 0;
  }

  async getToken() {
    // Check if we have a valid cached token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.access_token) {
        throw new Error('Failed to get access token');
      }

      this.token = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 minute early
      
      return this.token;
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  async searchPlaylists(query, limit = 20) {
    try {
      const token = await this.getToken();
      const encodedQuery = encodeURIComponent(query);
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodedQuery}&type=playlist&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        // Token expired, get a new one and retry
        this.token = null;
        this.tokenExpiry = 0;
        return this.searchPlaylists(query, limit);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.playlists) {
        throw new Error('Failed to fetch playlists from Spotify');
      }

      return data.playlists.items;
    } catch (error) {
      console.error('Error searching playlists:', error);
      throw error;
    }
  }
}

// Create global instance
window.spotifyService = new SpotifyService();

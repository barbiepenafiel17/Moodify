// Playlist Service
class PlaylistService {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
    this.moodMappings = {
      'happy': ['happy', 'feel good', 'good vibes'],
      'chill': ['chill', 'lofi', 'laid back', 'relax'],
      'sad': ['sad', 'heartbreak', 'emo'],
      'focus': ['focus', 'deep work', 'concentration', 'instrumental'],
      'energetic': ['workout', 'hype', 'power', 'pump'],
      'romantic': ['romantic', 'love', 'date night'],
      'party': ['party', 'dance', 'club'],
      'sleep': ['sleep', 'calm', 'ambient']
    };
  }

  async getPlaylistsByMood(mood) {
    if (!this.moodMappings[mood]) {
      throw new Error('Invalid mood specified');
    }

    const queries = this.moodMappings[mood];
    const playlists = [];
    const seenIds = new Set();

    for (const query of queries) {
      try {
        const results = await this.spotifyService.searchPlaylists(query);
        
        for (const playlist of results) {
          // Only include playlists with images and proper data
          if (playlist.images && playlist.images.length > 0 && !seenIds.has(playlist.id)) {
            playlists.push(this.formatPlaylist(playlist));
            seenIds.add(playlist.id);
            
            // Stop when we have enough playlists
            if (playlists.length >= 24) {
              return playlists;
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for '${query}':`, error);
        continue;
      }
    }

    return playlists;
  }

  formatPlaylist(playlist) {
    // Get the best available image
    let image = null;
    if (playlist.images && playlist.images.length > 0) {
      image = playlist.images[0].url;
    }

    return {
      id: playlist.id,
      name: playlist.name || 'Untitled Playlist',
      description: playlist.description || '',
      image: image,
      owner: playlist.owner?.display_name || 'Unknown',
      followers: playlist.followers?.total || 0,
      external_url: playlist.external_urls?.spotify || '#'
    };
  }
}

// Main Application
class MoodifyApp {
  constructor() {
    this.playlistService = new PlaylistService(window.spotifyService);
    this.rateLimitCount = 0;
    this.rateLimitReset = Date.now() + 60000; // Reset every minute
    
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.moodButtons = document.querySelectorAll(".mood-btn");
    this.resultsGrid = document.getElementById("results-grid");
    this.loadingSkeleton = document.getElementById("loading-skeleton");
    this.emptyState = document.getElementById("empty-state");
    this.errorAlert = document.getElementById("error-alert");
    this.errorMessage = document.getElementById("error-message");
  }

  bindEvents() {
    // Handle mood button clicks
    this.moodButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const mood = button.dataset.mood;
        await this.handleMoodSelection(mood, button);
      });
    });

    // Handle error alert close button
    const closeErrorButton = document.querySelector(".close-error");
    if (closeErrorButton) {
      closeErrorButton.addEventListener("click", () => {
        this.hideError();
      });
    }
  }

  async handleMoodSelection(mood, button) {
    // Simple rate limiting
    if (this.checkRateLimit()) {
      this.showError('Rate limit exceeded. Please try again in a minute.');
      return;
    }

    // Update active state
    this.moodButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Reset states
    this.hideError();
    this.hideEmptyState();
    this.clearResults();
    this.showLoading();

    try {
      const playlists = await this.playlistService.getPlaylistsByMood(mood);
      this.hideLoading();

      if (!playlists || playlists.length === 0) {
        this.showEmptyState();
        return;
      }

      this.renderPlaylists(playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      this.hideLoading();
      this.showError(error.message || 'Failed to fetch playlists. Please try again.');
    }
  }

  checkRateLimit() {
    const now = Date.now();
    
    // Reset counter if a minute has passed
    if (now > this.rateLimitReset) {
      this.rateLimitCount = 0;
      this.rateLimitReset = now + 60000;
    }
    
    // Check if limit exceeded
    if (this.rateLimitCount >= 60) {
      return true;
    }
    
    this.rateLimitCount++;
    return false;
  }

  renderPlaylists(playlists) {
    this.resultsGrid.innerHTML = playlists
      .map(playlist => this.createPlaylistCard(playlist))
      .join("");
  }

  createPlaylistCard(playlist) {
    const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTIwSDE2MFYxNjBIMTIwVjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2MCAxNjBIMjAwVjIwMEgxNjBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIwIDIwMEgxNjBWMjQwSDEyMFYyMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
    const isInFavorites = window.authService && window.authService.isInFavorites(playlist.id);
    const heartIcon = isInFavorites ? '❤️' : '🤍';
    
    return `
      <div class="playlist-card">
        <div class="relative">
          <img src="${playlist.image || fallbackImage}" 
               alt="${playlist.name}" 
               class="playlist-image" 
               onerror="this.src='${fallbackImage}'">
          <button onclick="toggleFavorite('${playlist.id}', this)" 
                  data-playlist='${JSON.stringify(playlist).replace(/'/g, "&apos;")}'
                  class="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all">
            <span class="text-lg">${heartIcon}</span>
          </button>
        </div>
        <div class="playlist-info">
          <h3 class="playlist-title">${playlist.name}</h3>
          <p class="playlist-description">${playlist.description || "No description available"}</p>
          <p class="playlist-meta">By ${playlist.owner} · ${this.formatFollowers(playlist.followers)} followers</p>
          <a href="${playlist.external_url}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="spotify-button block text-center">
            Open in Spotify
          </a>
        </div>
      </div>
    `;
  }

  formatFollowers(count) {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  }

  showLoading() {
    this.loadingSkeleton.classList.remove("hidden");
  }

  hideLoading() {
    this.loadingSkeleton.classList.add("hidden");
  }

  showEmptyState() {
    this.emptyState.classList.remove("hidden");
  }

  hideEmptyState() {
    this.emptyState.classList.add("hidden");
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorAlert.classList.remove("hidden");
  }

  hideError() {
    this.errorAlert.classList.add("hidden");
  }

  clearResults() {
    this.resultsGrid.innerHTML = "";
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.moodifyApp = new MoodifyApp();
});

// Global function to toggle favorites
window.toggleFavorite = function(playlistId, buttonElement) {
  if (!window.authService || !window.authService.user) {
    alert('Please sign in to save favorites!');
    return;
  }

  try {
    const playlistData = JSON.parse(buttonElement.getAttribute('data-playlist'));
    const heartSpan = buttonElement.querySelector('span');
    
    if (window.authService.isInFavorites(playlistId)) {
      // Remove from favorites
      window.authService.removeFromFavorites(playlistId);
      heartSpan.textContent = '🤍';
    } else {
      // Add to favorites
      if (window.authService.addToFavorites(playlistData)) {
        heartSpan.textContent = '❤️';
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

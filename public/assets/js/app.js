document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood-btn");
  const resultsGrid = document.getElementById("results-grid");
  const loadingSkeleton = document.getElementById("loading-skeleton");
  const emptyState = document.getElementById("empty-state");
  const errorAlert = document.getElementById("error-alert");
  const errorMessage = document.getElementById("error-message");

  // Handle mood button clicks
  moodButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const mood = button.dataset.mood;

      // Update active state
      moodButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Reset states
      errorAlert.classList.add("hidden");
      emptyState.classList.add("hidden");
      resultsGrid.innerHTML = "";
      loadingSkeleton.classList.remove("hidden");

      try {
        const response = await fetch(`api/playlists.php?mood=${mood}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.message);
        }

        loadingSkeleton.classList.add("hidden");

        if (!data.data || data.data.length === 0) {
          emptyState.classList.remove("hidden");
          return;
        }

        // Render playlists
        resultsGrid.innerHTML = data.data
          .map(
            (playlist) => `
                    <div class="playlist-card">
                        <img src="${playlist.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTIwSDE2MFYxNjBIMTIwVjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2MCAxNjBIMjAwVjIwMEgxNjBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIwIDIwMEgxNjBWMjQwSDEyMFYyMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='}" alt="${
              playlist.name
            }" class="playlist-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTIwSDE2MFYxNjBIMTIwVjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2MCAxNjBIMjAwVjIwMEgxNjBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIwIDIwMEgxNjBWMjQwSDEyMFYyMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='">
                        <div class="playlist-info">
                            <h3 class="playlist-title">${playlist.name}</h3>
                            <p class="playlist-description">${
                              playlist.description || "No description available"
                            }</p>
                            <p class="playlist-meta">By ${
                              playlist.owner
                            } · ${formatFollowers(
              playlist.followers
            )} followers</p>
                            <a href="${
                              playlist.external_url
                            }" target="_blank" rel="noopener noreferrer" 
                               class="spotify-button block text-center">
                                Open in Spotify
                            </a>
                        </div>
                    </div>
                `
          )
          .join("");
      } catch (error) {
        loadingSkeleton.classList.add("hidden");
        errorAlert.classList.remove("hidden");
        errorMessage.textContent =
          error.message || "Failed to fetch playlists. Please try again.";
      }
    });
  });

  // Handle error alert close button
  document.querySelector(".close-error")?.addEventListener("click", () => {
    errorAlert.classList.add("hidden");
  });

  // Helper function to format follower counts
  function formatFollowers(count) {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  }
});

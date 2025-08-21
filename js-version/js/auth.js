// Authentication Service
class AuthService {
  constructor() {
    this.user = null;
    this.isInitialized = false;
    this.favorites = this.loadFavorites();
    this.initializeGoogle();
  }

  initializeGoogle() {
    // Check if Google OAuth is configured first
    if (!window.isGoogleConfigured) {
      console.warn('Google OAuth not configured - using local favorites');
      this.hideGoogleSignIn();
      this.updateLocalFavoritesDisplay(); // Show local favorites immediately
      return;
    }

    // Wait for Google SDK to load
    if (typeof google !== 'undefined') {
      this.setupGoogleAuth();
    } else {
      // Retry after a short delay
      setTimeout(() => this.initializeGoogle(), 100);
    }
  }

  setupGoogleAuth() {
    // Check if Google OAuth is configured
    if (!window.isGoogleConfigured) {
      console.log('Google OAuth not configured, hiding sign-in button');
      this.hideGoogleSignIn();
      return;
    }

    try {
      console.log('🔧 Setting up Google Auth with Client ID:', CONFIG.GOOGLE_CLIENT_ID);
      console.log('🌐 Current domain:', window.location.origin);
      
      // Update the data-client_id attribute
      const onloadDiv = document.getElementById('g_id_onload');
      if (onloadDiv) {
        onloadDiv.setAttribute('data-client_id', CONFIG.GOOGLE_CLIENT_ID);
        console.log('✅ Updated g_id_onload with Client ID');
      }

      // Set up global callback
      window.handleCredentialResponse = (response) => {
        console.log('🔐 Google credential response received');
        this.handleGoogleSignIn(response);
      };

      // Set up error callback
      window.handleGoogleError = (error) => {
        console.error('❌ Google Auth Error:', error);
        console.log('🔧 Troubleshooting tips:');
        console.log('1. Check if your domain is authorized in Google Cloud Console');
        console.log('2. Verify OAuth consent screen is configured');
        console.log('3. Make sure APIs are enabled');
        console.log('4. See OAUTH_ERROR_FIX.md for detailed help');
        
        // Show user-friendly error message
        alert('Google Sign-In temporarily unavailable. You can still use the app in Guest Mode!');
        this.hideGoogleSignIn();
      };

      this.isInitialized = true;
      console.log('✅ Google Auth initialized successfully');
    } catch (error) {
      console.error('❌ Error setting up Google Auth:', error);
      this.hideGoogleSignIn();
    }
  }

  async handleGoogleSignIn(response) {
    try {
      // Decode the JWT token to get user info
      const userInfo = this.parseJwt(response.credential);
      
      this.user = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
      };

      // Save user session
      localStorage.setItem('moodify_user', JSON.stringify(this.user));
      
      this.updateUI();
      this.showFavorites();
      
      console.log('User signed in:', this.user.name);
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
    }
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  signOut() {
    this.user = null;
    localStorage.removeItem('moodify_user');
    this.updateUI();
    this.hideFavorites();
    
    // Sign out from Google
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    
    console.log('User signed out');
  }

  checkExistingSession() {
    const savedUser = localStorage.getItem('moodify_user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.updateUI();
      this.showFavorites();
    }
  }

  hideGoogleSignIn() {
    const signinContainer = document.getElementById('google-signin-container');
    if (signinContainer) {
      signinContainer.style.display = 'none';
    }
    
    // Show a message about enabling Google Sign-In
    const nav = document.querySelector('nav .flex.items-center.space-x-4');
    if (nav && !document.getElementById('oauth-disabled-message')) {
      const message = document.createElement('div');
      message.id = 'oauth-disabled-message';
      message.className = 'text-sm text-gray-500';
      message.innerHTML = '<span title="Google OAuth not configured">🔒 Guest Mode</span>';
      nav.appendChild(message);
    }
  }

  updateUI() {
    const userProfile = document.getElementById('user-profile');
    const signinContainer = document.getElementById('google-signin-container');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');

    if (this.user) {
      // Show user profile
      userProfile.classList.remove('hidden');
      signinContainer.classList.add('hidden');
      
      if (userAvatar) userAvatar.src = this.user.picture;
      if (userName) userName.textContent = this.user.name;
    } else {
      // Show sign-in button
      userProfile.classList.add('hidden');
      signinContainer.classList.remove('hidden');
    }
  }

  // Favorites Management
  addToFavorites(playlist) {
    if (!window.isGoogleConfigured) {
      // Use local favorites when Google OAuth is not configured
      return this.addToLocalFavorites(playlist);
    }
    
    if (!this.user) {
      alert('Please sign in to save favorites!');
      return false;
    }

    const key = `${this.user.id}_favorites`;
    if (!this.favorites[key]) {
      this.favorites[key] = [];
    }

    // Check if already in favorites
    const exists = this.favorites[key].some(fav => fav.id === playlist.id);
    if (exists) {
      return false; // Already in favorites
    }

    this.favorites[key].push(playlist);
    this.saveFavorites();
    this.updateFavoritesDisplay();
    return true;
  }

  addToLocalFavorites(playlist) {
    const key = 'local_favorites';
    if (!this.favorites[key]) {
      this.favorites[key] = [];
    }

    // Check if already in favorites
    const exists = this.favorites[key].some(fav => fav.id === playlist.id);
    if (exists) {
      return false; // Already in favorites
    }

    this.favorites[key].push(playlist);
    this.saveFavorites();
    this.updateLocalFavoritesDisplay();
    return true;
  }

  removeFromFavorites(playlistId) {
    if (!window.isGoogleConfigured) {
      return this.removeFromLocalFavorites(playlistId);
    }
    
    if (!this.user) return;

    const key = `${this.user.id}_favorites`;
    if (this.favorites[key]) {
      this.favorites[key] = this.favorites[key].filter(fav => fav.id !== playlistId);
      this.saveFavorites();
      this.updateFavoritesDisplay();
    }
  }

  removeFromLocalFavorites(playlistId) {
    const key = 'local_favorites';
    if (this.favorites[key]) {
      this.favorites[key] = this.favorites[key].filter(fav => fav.id !== playlistId);
      this.saveFavorites();
      this.updateLocalFavoritesDisplay();
    }
  }

  isInFavorites(playlistId) {
    if (!window.isGoogleConfigured) {
      const key = 'local_favorites';
      return this.favorites[key] ? 
             this.favorites[key].some(fav => fav.id === playlistId) : 
             false;
    }
    
    if (!this.user) return false;
    
    const key = `${this.user.id}_favorites`;
    return this.favorites[key] ? 
           this.favorites[key].some(fav => fav.id === playlistId) : 
           false;
  }

  getUserFavorites() {
    if (!window.isGoogleConfigured) {
      return this.favorites['local_favorites'] || [];
    }
    
    if (!this.user) return [];
    
    const key = `${this.user.id}_favorites`;
    return this.favorites[key] || [];
  }

  loadFavorites() {
    const saved = localStorage.getItem('moodify_favorites');
    return saved ? JSON.parse(saved) : {};
  }

  saveFavorites() {
    localStorage.setItem('moodify_favorites', JSON.stringify(this.favorites));
  }

  showFavorites() {
    const favoritesSection = document.getElementById('favorites-section');
    if (favoritesSection) {
      favoritesSection.classList.remove('hidden');
      this.updateFavoritesDisplay();
    }
  }

  hideFavorites() {
    const favoritesSection = document.getElementById('favorites-section');
    if (favoritesSection) {
      favoritesSection.classList.add('hidden');
    }
  }

  updateFavoritesDisplay() {
    const favoritesList = document.getElementById('favorites-list');
    const noFavorites = document.getElementById('no-favorites');
    const userFavorites = this.getUserFavorites();

    if (userFavorites.length === 0) {
      favoritesList.classList.add('hidden');
      noFavorites.classList.remove('hidden');
    } else {
      favoritesList.classList.remove('hidden');
      noFavorites.classList.add('hidden');
      
      favoritesList.innerHTML = userFavorites.map(playlist => `
        <div class="favorite-item bg-neutral-50 rounded-lg p-3 flex items-center space-x-3">
          <img src="${playlist.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+'}" 
               alt="${playlist.name}" 
               class="w-12 h-12 rounded object-cover">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">${playlist.name}</p>
            <p class="text-xs text-neutral-600 truncate">By ${playlist.owner}</p>
          </div>
          <button onclick="authService.removeFromFavorites('${playlist.id}')" 
                  class="text-red-500 hover:text-red-700 p-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      `).join('');
    }
  }

  updateLocalFavoritesDisplay() {
    this.updateFavoritesDisplay(); // Same display logic
    
    // Show favorites section for local favorites too
    const favoritesSection = document.getElementById('favorites-section');
    if (favoritesSection && this.getUserFavorites().length > 0) {
      favoritesSection.classList.remove('hidden');
      
      // Update section title for guest mode
      const title = favoritesSection.querySelector('h3');
      if (title && !window.isGoogleConfigured) {
        title.textContent = 'Your Favorites (Local)';
      }
    }
  }
}

// Create global instance
window.authService = new AuthService();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Set up sign out button
  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      authService.signOut();
    });
  }

  // Check for existing session
  authService.checkExistingSession();
});

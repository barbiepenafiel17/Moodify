// Configuration
const CONFIG = {
  SPOTIFY_CLIENT_ID: '92e6274a46e0430ba75b3a1747bb2bd5',
  SPOTIFY_CLIENT_SECRET: '42f1ba39b6d24333aa557dbd7c59f807',
  GOOGLE_CLIENT_ID: '1038963909845-42ovgaov748annj182e216f8v80o4t2h.apps.googleusercontent.com'
};

// Check if Google OAuth is configured
const isGoogleConfigured = CONFIG.GOOGLE_CLIENT_ID && CONFIG.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && CONFIG.GOOGLE_CLIENT_ID !== '';

// Debug information
console.log('🔧 Configuration Status:');
console.log('- Google Client ID:', CONFIG.GOOGLE_CLIENT_ID);
console.log('- Google Configured:', isGoogleConfigured);
console.log('- Current Domain:', window.location.origin);

if (!isGoogleConfigured) {
  console.warn('⚠️ Google OAuth not configured. Sign-in features will be disabled.');
  console.log('📋 To enable Google Sign-In:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create OAuth 2.0 credentials');
  console.log('3. Update GOOGLE_CLIENT_ID in config.js');
  console.log('4. See GOOGLE_OAUTH_SETUP.md for detailed instructions');
} else {
  console.log('✅ Google OAuth configured - attempting to initialize...');
}

// Export configuration status
window.CONFIG = CONFIG;
window.isGoogleConfigured = isGoogleConfigured;

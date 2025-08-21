// Configuration with environment variables
const CONFIG = {
  // In production, these should be loaded from environment variables
  SPOTIFY_CLIENT_ID: window.ENV?.SPOTIFY_CLIENT_ID || '92e6274a46e0430ba75b3a1747bb2bd5',
  SPOTIFY_CLIENT_SECRET: window.ENV?.SPOTIFY_CLIENT_SECRET || '42f1ba39b6d24333aa557dbd7c59f807'
};

// Check if we're in development or production
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost');

if (!isDevelopment) {
  console.warn('⚠️ For production, consider implementing OAuth flow for better security.');
}

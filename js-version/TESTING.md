# Demo Configuration for Testing

## Quick Test Setup

To test the Google Sign-In functionality quickly, you can use a demo Google Client ID for localhost testing:

### Development Client ID (localhost only)
```javascript
// For localhost:3000 testing only
GOOGLE_CLIENT_ID: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'
```

⚠️ **Note**: This is just an example format. You need to create your own Client ID.

## Creating Your Own Credentials

1. **Google OAuth Setup**: Follow [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
2. **Spotify API Setup**: Use existing credentials from your .env file

## Test Users

When testing, you can sign in with:
- Any Google account (for production apps)
- Test users you've added in Google Console (for apps in testing mode)

## Features to Test

✅ **Authentication Flow**
- Click "Sign in with Google"
- Complete OAuth flow
- See user profile in navigation
- Sign out functionality

✅ **Favorites System**  
- Browse playlists by mood
- Click ❤️ button to save favorites
- View saved favorites in "Your Favorites" section
- Remove favorites with ✗ button

✅ **Persistence**
- Refresh page and see favorites preserved
- Sign out and back in to see favorites restored

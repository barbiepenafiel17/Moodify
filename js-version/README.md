# Moodify - JavaScript Version

A beautiful client-side web application that helps you discover Spotify playlists based on your current mood.

## 🌟 Features

- 🎵 Browse playlists by mood (Happy, Chill, Sad, Focus, Energetic, Romantic, Party, Sleep)
- 🔍 Real-time playlist search using Spotify's API
- 🎨 Clean, modern UI built with Tailwind CSS
- ⚡ Fast loading with skeleton states
- 📱 Fully responsive design
- 🔄 Rate limiting and error handling
- 🚀 Ready for deployment on Vercel, Netlify, or any static hosting
- 🔐 **Google Sign-In integration**
- ❤️ **Save and manage favorite playlists**
- 👤 **User profile and session management**

## 🚀 Quick Deploy

### Option 1: One-Click Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Connect your GitHub account
3. Import this repository
4. Deploy automatically!

### Option 2: Manual Vercel Deployment

**Prerequisites:**
- Node.js installed
- Git repository (GitHub, GitLab, or Bitbucket)

**Steps:**
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to project directory:
   ```bash
   cd js-version
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

5. Or use the provided script:
   ```bash
   # Windows
   deploy.bat
   
   # macOS/Linux
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Option 3: Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Drag and drop the `js-version` folder to [Netlify Deploy](https://app.netlify.com/drop)
2. Or connect your GitHub repository at [Netlify](https://app.netlify.com)

### Option 4: GitHub Pages
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select source branch
4. Your app will be available at `https://username.github.io/repository-name`

## 🛠️ Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. Or serve with a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

## ⚙️ Configuration

### Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your Client ID and Client Secret

### Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Identity API
4. Create OAuth 2.0 credentials
5. Copy your Client ID

**📋 Detailed setup guide: [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)**

### For Development
Edit `js/config.js` and add your credentials:
```javascript
const CONFIG = {
  SPOTIFY_CLIENT_ID: 'your_spotify_client_id_here',
  SPOTIFY_CLIENT_SECRET: 'your_spotify_client_secret_here',
  GOOGLE_CLIENT_ID: 'your_google_client_id_here.apps.googleusercontent.com'
};
```

### For Production (More Secure)
Use environment variables or implement OAuth flow.

## 📁 Project Structure

```
├── index.html                 # Main page
├── assets/
│   └── css/
│       └── styles.css         # Custom styles
├── js/
│   ├── config.js             # Configuration
│   ├── spotify.js            # Spotify API service
│   └── app.js                # Main application logic
├── vercel.json               # Vercel configuration
├── _redirects                # Netlify configuration
└── README.md                 # This file
```

## 🎯 How It Works

### Mood Mapping
Each mood maps to specific search terms:
- **Happy**: 'happy', 'feel good', 'good vibes'
- **Chill**: 'chill', 'lofi', 'laid back', 'relax'
- **Sad**: 'sad', 'heartbreak', 'emo'
- **Focus**: 'focus', 'deep work', 'concentration', 'instrumental'
- **Energetic**: 'workout', 'hype', 'power', 'pump'
- **Romantic**: 'romantic', 'love', 'date night'
- **Party**: 'party', 'dance', 'club'
- **Sleep**: 'sleep', 'calm', 'ambient'

### API Flow
1. Get access token using Client Credentials flow
2. Search Spotify for playlists using mood keywords
3. Filter and format results
4. Display in responsive grid

### Rate Limiting
- Client-side rate limiting (60 requests per minute)
- Automatic token refresh
- Error handling with user feedback

## 🔒 Security Considerations

⚠️ **Important**: Client credentials are visible to users in client-side apps.

### For Production:
1. **Use OAuth Flow**: Implement Authorization Code with PKCE
2. **Backend Proxy**: Create a serverless function to proxy API calls
3. **Environment Variables**: Store credentials securely

### Improved Security Implementation:
```javascript
// Use backend endpoint instead of direct API calls
const response = await fetch('/api/playlists', {
  method: 'POST',
  body: JSON.stringify({ mood })
});
```

## 🐛 Troubleshooting

### CORS Issues
- Spotify API supports CORS for client-side requests
- If you encounter issues, check browser console

### Token Errors
- Verify your Client ID and Client Secret
- Check Spotify Developer Dashboard settings

### No Results
- Try different mood selections
- Check network connectivity
- Verify API credentials

## 🚀 Deployment Options

### Static Hosting (Recommended)
- **Vercel**: Best for automatic deployments
- **Netlify**: Great free tier
- **GitHub Pages**: Free for public repos
- **Firebase Hosting**: Google's solution
- **Surge.sh**: Simple CLI deployment

### CDN/Storage
- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**

## 🔧 Customization

### Add New Moods
Edit `js/app.js`:
```javascript
this.moodMappings = {
  // ...existing moods...
  'custom': ['custom', 'search', 'terms']
};
```

### Styling
- Edit `assets/css/styles.css` for custom styles
- Modify Tailwind classes in HTML
- Add animations or transitions

### Features
- Add playlist preview
- Implement user favorites
- Add sharing functionality
- Create playlist export

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly  
5. Submit pull request

---

**Note**: This is a client-side implementation. For production apps with sensitive data, consider implementing a backend service to handle API calls securely.

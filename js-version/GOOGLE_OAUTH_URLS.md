# Google OAuth Configuration URLs

## For Google Cloud Console OAuth 2.0 Setup

When setting up your Google OAuth 2.0 credentials in the Google Cloud Console, you'll need to add these URLs:

### 📍 JavaScript Origins (Authorized JavaScript origins)
Add these domains where your app is hosted:

```
https://moodify-89xguy7xn-barbielats-projects.vercel.app
https://moodify-e8igoct4i-barbielats-projects.vercel.app
http://localhost:3000
http://127.0.0.1:5500
```

### 🔄 Authorized Redirect URIs
Add these redirect URLs for OAuth callback:

```
https://moodify-89xguy7xn-barbielats-projects.vercel.app
https://moodify-89xguy7xn-barbielats-projects.vercel.app/
https://moodify-e8igoct4i-barbielats-projects.vercel.app
https://moodify-e8igoct4i-barbielats-projects.vercel.app/
http://localhost:3000
http://localhost:3000/
http://127.0.0.1:5500
http://127.0.0.1:5500/
```

## 📋 Quick Setup Steps

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**: Create a new project or select existing one
3. **Enable Google+ API**: In APIs & Services > Library, search and enable "Google+ API"
4. **Create Credentials**:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add the JavaScript origins above
   - Add the redirect URIs above
5. **Copy Client ID**: Copy the generated Client ID
6. **Update config.js**: Replace the empty GOOGLE_CLIENT_ID with your real Client ID
7. **Redeploy**: Run `vercel --prod` to update your live app

## 🎯 Current App URLs
- **Primary Production URL**: https://moodify-89xguy7xn-barbielats-projects.vercel.app
- **Secondary Production URL**: https://moodify-e8igoct4i-barbielats-projects.vercel.app
- **Local Development**: http://localhost:3000 or http://127.0.0.1:5500

## ⚠️ Important Notes
- Both your current Vercel URLs are included for maximum compatibility
- Local development URLs are included for testing
- Make sure to use HTTPS for production URLs
- The redirect URIs should match your JavaScript origins
- After updating credentials, it may take a few minutes to propagate

## 🔧 After Setup
Once you have your Google Client ID:
1. Update `js/config.js` with your Client ID
2. Deploy with `vercel --prod`
3. Your app will automatically enable Google Sign-In features
4. Users can sync favorites across devices

Your app works perfectly without Google OAuth (local favorites), but adding it enables cloud sync! 🚀

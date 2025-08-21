# Google OAuth Setup Guide

## 🔑 Setting up Google Sign-In for Moodify

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Identity API

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: `Moodify`
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes (optional for basic profile info)
5. Add test users if in development

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: `Moodify Web Client`
5. Add authorized domains:
   - For local development: `http://localhost:3000`
   - For Vercel: `https://your-app-name.vercel.app`
   - For custom domain: `https://yourdomain.com`
6. Copy the **Client ID**

### Step 4: Update Your App

1. Open `js/config.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:
   ```javascript
   GOOGLE_CLIENT_ID: 'your-actual-client-id-here.apps.googleusercontent.com'
   ```

3. Update the HTML file (`index.html`) to use your Client ID:
   ```html
   <div id="g_id_onload"
        data-client_id="your-actual-client-id-here.apps.googleusercontent.com"
        ...>
   ```

### Step 5: Deploy to Vercel

1. Update your config with the new Client ID
2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Add your Vercel domain to Google Console authorized domains

## 🔧 Environment Variables (Recommended)

For production, use environment variables:

1. In Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add `GOOGLE_CLIENT_ID` with your Client ID

2. Update `config.js` to use environment variables:
   ```javascript
   GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'fallback-client-id'
   ```

## ✨ Features Enabled

Once Google Sign-In is configured, users can:
- ✅ Sign in with their Google account
- ✅ Save favorite playlists
- ✅ View their saved favorites
- ✅ Remove playlists from favorites
- ✅ Persistent favorites across sessions

## 🛠️ Testing

1. Test locally at `http://localhost:3000`
2. Test on Vercel deployment
3. Try signing in and saving favorites
4. Check browser localStorage for saved data

## 🔒 Security Notes

- Client ID is safe to expose (it's designed for client-side use)
- Never expose Client Secret in frontend code
- Use HTTPS in production
- Validate user tokens on backend for sensitive operations

## 📱 Mobile Support

Google Sign-In works on mobile browsers and provides a native-like experience on supported devices.

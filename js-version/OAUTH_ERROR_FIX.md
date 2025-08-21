# 🚨 OAuth Error Fix Guide

## Error: "The OAuth client was not found. Error 401: invalid_client"

This error means there's an issue with your Google Cloud Console OAuth configuration. Here's how to fix it:

## 🔧 Step-by-Step Fix

### 1. **Go to Google Cloud Console**
Visit: https://console.cloud.google.com/

### 2. **Check Your Project**
- Make sure you're in the correct project
- If no project exists, create a new one

### 3. **Enable Required APIs**
Go to **APIs & Services > Library** and enable:
- ✅ **Google+ API** (or Google People API)
- ✅ **Google Identity API**

### 4. **Create/Update OAuth 2.0 Credentials**
Go to **APIs & Services > Credentials**

#### If you need to create new credentials:
1. Click **"Create Credentials" > "OAuth 2.0 Client ID"**
2. Choose **"Web application"**
3. Give it a name (e.g., "Moodify App")

#### Add these Authorized JavaScript origins:
```
https://moodify-8qrrm890z-barbielats-projects.vercel.app
https://moodify-89xguy7xn-barbielats-projects.vercel.app
https://moodify-e8igoct4i-barbielats-projects.vercel.app
```

#### Add these Authorized redirect URIs:
```
https://moodify-8qrrm890z-barbielats-projects.vercel.app
https://moodify-8qrrm890z-barbielats-projects.vercel.app/
https://moodify-89xguy7xn-barbielats-projects.vercel.app
https://moodify-89xguy7xn-barbielats-projects.vercel.app/
https://moodify-e8igoct4i-barbielats-projects.vercel.app
https://moodify-e8igoct4i-barbielats-projects.vercel.app/
```

### 5. **Configure OAuth Consent Screen**
Go to **APIs & Services > OAuth consent screen**

1. Choose **"External"** user type
2. Fill in required fields:
   - **App name**: Moodify
   - **User support email**: Your email
   - **Developer contact**: Your email
3. Add your domain to **Authorized domains**:
   - `vercel.app`
4. **Save and Continue**

### 6. **Verify Client ID**
After creating/updating credentials:
1. Copy the **Client ID** (should look like: `1038963909845-xxxxxxxxxx.apps.googleusercontent.com`)
2. Make sure it matches what's in your `config.js`

## 🔄 If You Need a New Client ID

If the current Client ID isn't working, create a fresh one:

1. **Delete the old OAuth credential** in Google Cloud Console
2. **Create a new OAuth 2.0 Client ID**
3. **Copy the new Client ID**
4. **Update config.js** with the new Client ID
5. **Redeploy** with `vercel --prod`

## ⚠️ Common Issues

### Issue 1: Wrong Domain
Make sure your Vercel URLs are exactly correct in Google Console:
- Current URL: `https://moodify-8qrrm890z-barbielats-projects.vercel.app`

### Issue 2: Consent Screen Not Published
- Your OAuth consent screen might need to be published
- Or add yourself as a test user

### Issue 3: API Not Enabled
- Make sure Google+ API or Google People API is enabled

## 🧪 Test Steps

1. **Update Google Console** with correct domains
2. **Wait 5-10 minutes** for changes to propagate
3. **Clear browser cache** 
4. **Try signing in again**

## 🆘 Emergency Fallback

If Google OAuth continues to have issues, your app still works perfectly in **Guest Mode**:
- All playlist discovery works
- Local favorites work
- No sign-in required

To temporarily disable Google Sign-In:
```javascript
GOOGLE_CLIENT_ID: '' // Empty string disables Google OAuth
```

## 📞 Need Help?
If the error persists:
1. Double-check all domains match exactly
2. Ensure OAuth consent screen is properly configured
3. Try creating a completely new OAuth credential
4. Contact me with the exact error message from browser console

Your app works great without Google OAuth, so don't worry if it takes a few tries to get it configured! 🎵

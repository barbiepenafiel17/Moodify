#!/bin/bash

# Vercel Deployment Script for Moodify

echo "🎵 Deploying Moodify to Vercel..."

# Check if configuration is complete
echo "🔍 Checking configuration..."

if grep -q "YOUR_GOOGLE_CLIENT_ID" js/config.js; then
    echo "⚠️  Warning: Google Client ID not configured!"
    echo "   Please update js/config.js with your Google OAuth credentials"
    echo "   See GOOGLE_OAUTH_SETUP.md for detailed instructions"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔑 Please login to Vercel if prompted..."
vercel login

# Deploy the project
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🎉 Your Moodify app is now live!"
echo ""
echo "📋 Post-deployment checklist:"
echo "   1. Update Google OAuth authorized domains"
echo "   2. Test Google Sign-In functionality"
echo "   3. Verify favorites system works"

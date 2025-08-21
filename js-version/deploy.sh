#!/bin/bash

# Vercel Deployment Script for Moodify

echo "🎵 Deploying Moodify to Vercel..."

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

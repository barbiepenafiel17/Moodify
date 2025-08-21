@echo off
echo 🎵 Deploying Moodify to Vercel...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Login to Vercel
echo 🔑 Please login to Vercel if prompted...
vercel login

REM Deploy the project
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🎉 Your Moodify app is now live!
pause

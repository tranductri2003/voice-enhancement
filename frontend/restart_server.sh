#!/bin/bash

# --------------------------------------------------
# Script to Restart the React Frontend Server on Raspberry Pi
# --------------------------------------------------

# Exit on error
set -e

# Project configuration
PROJECT_DIR="/home/tranductri2003/Code/PBL06_multi-speaker-voice-cloning/PBL06_multi-speaker-voice-cloning-frontend"
NODE_MODULES_DIR="$PROJECT_DIR/node_modules"
BUILD_DIR="$PROJECT_DIR/build"
LOG_FILE="$PROJECT_DIR/frontend-server.log"
PORT=3000

echo "🚀 Starting frontend deployment process..."

# Navigate to project directory
cd "$PROJECT_DIR" || { echo "❌ Project directory not found!"; exit 1; }

# Install/Update dependencies
echo "📦 Installing/updating dependencies..."
if [ ! -d "$NODE_MODULES_DIR" ]; then
    echo "📥 Installing dependencies..."
    yarn install
else
    echo "🔄 Updating dependencies..."
    yarn install
fi

# Build the project
echo "🏗️ Building the project..."
yarn build

# Stop existing server instances
echo "🛑 Stopping existing server instances..."
pkill -f "serve -s build" || echo "ℹ️  No existing server running"

# Install serve globally using yarn
echo "🔧 Ensuring serve is installed..."
yarn global add serve

# Add serve to PATH
export PATH="$PATH:$(yarn global bin)"

# Start server
echo "🌟 Starting frontend server..."
nohup yarn preview > "$LOG_FILE" 2>&1 &

# Wait a bit to check if server started successfully
sleep 5

# Check if server is running
if netstat -tulpn 2>/dev/null | grep ":$PORT " > /dev/null; then
    echo "✨ Frontend server started successfully on port $PORT!"
    echo "📝 Logs available at: $LOG_FILE"
else
    echo "❌ Failed to start frontend server. Check logs at: $LOG_FILE"
    exit 1
fi

echo "🎉 Frontend deployment completed!" 
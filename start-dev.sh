#!/bin/bash

echo "🏠 Starting Housing Search Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Start Python backend in background
echo "🐍 Starting Python FastAPI backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Start backend server
echo "🚀 Starting backend server on http://localhost:8000"
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Go back to root directory
cd ..

# Start frontend
echo "⚛️  Starting Next.js frontend..."
echo "🚀 Frontend will be available on http://localhost:3000"

# Set environment variable for backend URL
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"

# Start frontend development server
bun run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both services are running!"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap for cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for either process to finish
wait

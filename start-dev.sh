#!/bin/bash

echo "🏠 Starting Housing Search Application..."

# Start frontend
echo "⚛️  Starting Next.js frontend..."
echo "🚀 Frontend will be available on http://localhost:3000"

# Set environment variable for backend URL
export NEXT_PUBLIC_BACKEND_URL="https://ai-housing-hunter-backend.vercel.app/"

# Start frontend development server
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Frontend service is running!"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the service"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap for cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for either process to finish
wait

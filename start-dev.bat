@echo off
echo 🏠 Starting Housing Search Application...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Start Python backend
echo 🐍 Starting Python FastAPI backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1

REM Start backend server in background
echo 🚀 Starting backend server on http://localhost:8000
start /b python main.py

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Go back to root directory
cd ..

REM Start frontend
echo ⚛️ Starting Next.js frontend...
echo 🚀 Frontend will be available on http://localhost:3000

REM Set environment variable for backend URL
set NEXT_PUBLIC_BACKEND_URL=https://ai-housing-hunter-backend.vercel.app/

REM Start frontend development server
echo.
echo ✅ Services are starting!
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop all services
echo.

start /b bun run dev

REM Keep the window open
pause

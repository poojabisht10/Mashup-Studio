@echo off
REM Mashup Studio - Windows Setup Script

echo ======================================================
echo 🎵 MASHUP STUDIO - Automated Setup (Windows)
echo ======================================================
echo.

REM Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)
echo ✅ Python found
echo.

REM Backend setup
echo ======================================================
echo 🔧 Setting up Backend...
echo ======================================================
cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ✅ Backend setup complete!
echo.
echo ⚠️  IMPORTANT: Configure email settings in backend\app.py
echo     Edit lines 24-27 with your Gmail credentials
echo.

REM Frontend setup
echo ======================================================
echo 🎨 Setting up Frontend...
echo ======================================================
cd ..\frontend

REM Check for npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Install dependencies
echo Installing Node dependencies (this may take a few minutes)...
npm install

echo.
echo ✅ Frontend setup complete!
echo.

REM Done
echo ======================================================
echo 🎉 SETUP COMPLETE!
echo ======================================================
echo.
echo Next steps:
echo.
echo 1. Configure Email (REQUIRED):
echo    - Open backend\app.py
echo    - Update EmailConfig class (lines 24-27)
echo    - Add your Gmail and App Password
echo.
echo 2. Start Backend:
echo    cd backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 3. Start Frontend (in a new terminal):
echo    cd frontend
echo    npm start
echo.
echo 4. Open browser:
echo    http://localhost:3000
echo.
echo For detailed instructions, see:
echo   - QUICKSTART.md (Quick start guide)
echo   - README.md (Full documentation)
echo   - DEPLOYMENT.md (Deployment guide)
echo.
echo ======================================================
pause

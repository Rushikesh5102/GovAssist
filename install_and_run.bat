@echo off
echo ===================================================
echo     GovAssist - Automated Setup ^& Run Script
echo ===================================================
echo.
echo This script will automatically install all required
echo dependencies and start the application.
echo.

echo [1/4] Checking prerequisites...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3.10+ and try again.
    pause
    exit /b
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js (npm) is not installed or not in PATH!
    echo Please install Node.js and try again.
    pause
    exit /b
)
echo Prerequisites found!
echo.

echo [2/4] Installing Backend Dependencies...
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies.
    pause
    exit /b
)
cd ..
echo Backend dependencies installed successfully!
echo.

echo [3/4] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node dependencies.
    pause
    exit /b
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo [4/4] Starting GovAssist...
echo.
echo Starting Backend...
start "GovAssist Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

echo Starting Frontend...
start "GovAssist Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Waiting for servers to start...
timeout /t 5 >nul

echo Opening browser...
start http://localhost:5102

echo.
echo ===================================================
echo  GovAssist is now running!
echo  Frontend: http://localhost:5102
echo  Backend:  http://localhost:8001/docs
echo ===================================================
echo You can close this window. The servers are running in the new terminals.
pause

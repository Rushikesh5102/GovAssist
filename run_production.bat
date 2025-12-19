@echo off
echo ===================================================
echo   GovAssist Production Launcher
echo ===================================================

echo [1/3] Checking Frontend Build...
if exist "frontend\dist\index.html" (
    echo Frontend build found.
) else (
    echo Frontend build NOT found. Running 'npm run build'...
    cd frontend
    call npm run build
    cd ..
)

echo [2/3] Installing/Verifying Backend Dependencies...
cd backend
pip install aiofiles > nul 2>&1
cd ..

echo [3/3] Starting Server...
echo Access the application at: http://localhost:8001
echo (Press Ctrl+C to stop)
echo.

cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
pause

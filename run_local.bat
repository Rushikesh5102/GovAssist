@echo off
echo Starting GovAssist Locally (Port 5102)...
echo.
echo 1. Starting Backend...
start cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"
echo.
echo 2. Starting Frontend...
start cmd /k "cd frontend && npm run dev"
echo.
echo 3. Opening application...
timeout /t 5
start http://localhost:5102
echo.
echo Demo is running!
echo Backend API: http://localhost:8001/docs
echo Frontend: http://localhost:5102
echo.
pause

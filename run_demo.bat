@echo off
echo Starting GovAssist Demo...
echo.
echo 1. Building and starting containers...
docker-compose up --build -d
echo.
echo 2. Waiting for services to be ready...
timeout /t 10
echo.
echo 3. Opening application...
start http://localhost:5173
echo.
echo Demo is running!
echo Backend API: http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
pause

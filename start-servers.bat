@echo off
echo ========================================
echo Starting Akions Application Servers
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server - Port 3000" cmd /k "cd /d %~dp0akions-app\backend && echo Backend Directory: %CD% && echo. && npm start"

timeout /t 2 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server - Expo" cmd /k "cd /d %~dp0akions-app\frontend && echo Frontend Directory: %CD% && echo. && npm start"

echo.
echo ========================================
echo Both servers are starting in separate windows
echo ========================================
echo Backend: http://localhost:3000
echo Frontend: Check the Expo window for the web URL
echo.
pause



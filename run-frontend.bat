@echo off
cd /d %~dp0akions-app\frontend
echo Current directory: %CD%
echo.
echo Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)
echo.
echo Starting frontend server...
echo Press 'w' for web, 'a' for Android, or 'i' for iOS
echo.
call npm start
pause



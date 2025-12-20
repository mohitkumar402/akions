@echo off
cd /d %~dp0akions-app\backend
echo Current directory: %CD%
echo.
echo Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)
echo.
echo Starting backend server...
echo Backend will run on: http://localhost:3000
echo.
call npm start
pause



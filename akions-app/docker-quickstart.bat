@echo off
REM Akions Docker Quick Start Script (Windows)
REM Usage: docker-quickstart.bat [command]

setlocal enabledelayedexpansion

set "COMMAND=%1"
if "%COMMAND%"=="" set "COMMAND=help"

color 0A
cls
echo =============================================
echo   Akions Docker Quick Start
echo =============================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop first
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
docker compose version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Docker Compose is not available
    pause
    exit /b 1
)

REM Parse command
if "%COMMAND%"=="start" goto :start
if "%COMMAND%"=="stop" goto :stop
if "%COMMAND%"=="restart" goto :restart
if "%COMMAND%"=="logs" goto :logs
if "%COMMAND%"=="status" goto :status
if "%COMMAND%"=="build" goto :build
if "%COMMAND%"=="clean" goto :clean
if "%COMMAND%"=="help" goto :help
if "%COMMAND%"=="shell-backend" goto :shell_backend
if "%COMMAND%"=="shell-frontend" goto :shell_frontend

echo [ERROR] Unknown command: %COMMAND%
echo.
goto :help

:start
echo [*] Starting services...
if not exist ".env" (
    echo [!] .env file not found. Creating from .env.example...
    copy .env.example .env
    echo [+] .env created. Please edit it with your settings.
)
docker-compose up -d --pull always
if errorlevel 1 goto :error
echo.
echo [+] Services started!
echo.
echo Backend API: http://localhost:3000
echo Frontend:    http://localhost:19006
echo MongoDB:     localhost:27017
echo.
echo Run 'docker-quickstart.bat logs' to view logs
goto :eof

:stop
echo [*] Stopping services...
docker-compose down
if errorlevel 1 goto :error
echo [+] Services stopped
goto :eof

:restart
echo [*] Restarting services...
docker-compose restart
if errorlevel 1 goto :error
echo [+] Services restarted
goto :eof

:logs
echo [*] Showing logs (Ctrl+C to exit)...
docker-compose logs -f
goto :eof

:status
echo [*] Service status:
docker-compose ps
goto :eof

:shell_backend
echo [*] Opening bash in backend container...
docker-compose exec backend /bin/sh
goto :eof

:shell_frontend
echo [*] Opening bash in frontend container...
docker-compose exec frontend /bin/sh
goto :eof

:build
echo [*] Building images...
docker-compose build --no-cache
if errorlevel 1 goto :error
echo [+] Build complete
goto :eof

:clean
echo.
echo [WARNING] This will delete all containers and volumes (including database data)
set /p CONFIRM="Are you sure? (yes/no): "
if /i not "%CONFIRM%"=="yes" (
    echo Cleanup cancelled
    goto :eof
)
echo [*] Cleaning up...
docker-compose down -v
if errorlevel 1 goto :error
echo [+] Cleanup complete
goto :eof

:help
echo Available commands:
echo.
echo   start                - Start all services
echo   stop                 - Stop all services
echo   restart              - Restart all services
echo   logs                 - View logs from all services
echo   status               - Show service status
echo   shell-backend        - Open bash in backend container
echo   shell-frontend       - Open bash in frontend container
echo   build                - Build images
echo   clean                - Remove containers and volumes (WARNING: data loss)
echo   help                 - Show this help message
echo.
goto :eof

:error
color 0C
echo [ERROR] Command failed!
color 0A
pause
exit /b 1

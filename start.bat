@echo off
echo ========================================
echo   CommUnity Event App - Quick Start
echo ========================================
echo.

echo [1/3] Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is running
) else (
    echo ! MongoDB is not running
    echo   Starting MongoDB service...
    net start MongoDB 2>NUL
    if errorlevel 1 (
        echo   Note: You may need to install MongoDB or start it manually
        echo   Visit: https://www.mongodb.com/try/download/community
    )
)

echo.
echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting React Native App...
start "React Native" cmd /k "npm start"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend: Check the React Native terminal for QR code
echo.
echo Press any key to exit this window...
pause >nul

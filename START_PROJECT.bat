@echo off
echo ========================================
echo Alrabie Real Estate - Project Startup
echo ========================================
echo.
echo Starting Backend on port 3050...
echo.

start "Backend Server" cmd /k "cd backend && set PORT=3050 && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend (dev) with API http://localhost:3050/api ...
echo.

start "Frontend Server" cmd /k "cd frontend-next && set NEXT_PUBLIC_API_URL=http://localhost:3050/api && npm run dev"

echo.
echo Opening Prisma Studio ...
echo.
start "Prisma Studio" cmd /k "cd backend && npx prisma studio"

echo.
echo ========================================
echo Project started successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3050/api
echo Frontend: http://localhost:3001 (or auto 3000 if 3001 busy)
echo Prisma Studio: http://localhost:5555
echo.
echo Note: Frontend started with NEXT_PUBLIC_API_URL=http://localhost:3050/api
echo Note: If Frontend doesn't start on 3001, it will automatically use 3000

echo.
pause


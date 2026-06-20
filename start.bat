@echo off
REM taruh file ini di folder ambachamp/ (sejajar sama folder backend dan frontend)
REM double click buat nyalain backend + frontend otomatis di 2 jendela terminal

echo Nyalain backend...
start "AMBAchamp Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Nyalain frontend...
start "AMBAchamp Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Dua server lagi jalan di jendela terpisah.
echo Backend  : http://localhost:5000
echo Frontend : http://localhost:3000

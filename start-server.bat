@echo off
echo 🔌 Запуск сервера для разработки плагинов Lampa
echo.

REM Проверяем наличие Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python не найден! Установите Python с https://python.org
    pause
    exit /b 1
)

echo ✅ Python найден
echo 🚀 Запускаем HTTP сервер...
echo.

python start-server.py

pause

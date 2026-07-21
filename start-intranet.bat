@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Vicky 作品集 - 内网服务器

cd /d "%~dp0docs"

:: Find local IP (works with both Chinese and English Windows)
set LOCAL_IP=未检测到
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set TMP=%%a
    set TMP=!TMP:~1!
    if not "!TMP!"=="127.0.0.1" set LOCAL_IP=!TMP!
)

echo.
echo ===========================================
echo   Vicky 作品集 - 内网服务器
echo ===========================================
echo.
echo   本机访问:
echo     http://localhost:8080
echo.
echo   内网访问 (手机/其它电脑):
echo     http://!LOCAL_IP!:8080
echo.
echo   按 Ctrl+C 停止服务器
echo ===========================================
echo.

python -m http.server 8080 --bind 0.0.0.0
pause

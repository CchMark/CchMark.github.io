@echo off
echo ====================================
echo Starting Build and Test Script...
echo ====================================

rem Reload PATH from registry to find newly installed Hugo
setlocal enabledelayedexpansion
set "NEW_PATH="
for /f "tokens=2*" %%a in ('reg query "HKLM\System\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "NEW_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do (
    if defined NEW_PATH (
        set "NEW_PATH=!NEW_PATH!;%%b"
    ) else (
        set "NEW_PATH=%%b"
    )
)
if not "!NEW_PATH!"=="" (
    set "PATH=!NEW_PATH!"
)
endlocal & set "PATH=%PATH%"

echo 1. Cleaning old build files...
if exist "public" rmdir /s /q public
if exist "resources" rmdir /s /q resources

echo 2. Checking Hugo version...
hugo version
if %errorlevel% neq 0 (
    echo Error: Hugo is not installed or not in PATH.
    pause
    exit /b 1
)

echo 3. Building website (minify ^& gc)...
hugo --minify --gc --cleanDestinationDir
if %errorlevel% neq 0 (
    echo Error: Hugo build failed.
    pause
    exit /b 1
)

echo 4. Verifying build output...
if exist "public\.htaccess" (
    echo [OK] .htaccess generated.
) else (
    echo [Warning] .htaccess not found.
)

if exist "public\sw.js" (
    echo [OK] Service Worker generated.
) else (
    echo [Warning] Service Worker not found.
)

echo 5. Checking for non-HTTPS resources...
findstr /i "http://" public\*.html >nul 2>&1
if %errorlevel% equ 0 (
    echo [Warning] Found non-HTTPS resource links!
    findstr /i "http://" public\*.html
) else (
    echo [OK] All resources use HTTPS.
)

echo 6. Starting Hugo local server...
echo URL: http://localhost:1313
echo Press Ctrl+C in this window to stop the server.
echo ====================================

start "" "http://localhost:1313"
hugo server --minify -D --disableFastRender
pause

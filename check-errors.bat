@echo off
echo ====================================
echo Starting Code Check Script...
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

echo 1. Checking CSS files...
for %%f in (static\css\*.css) do (
    echo Checking: %%f
    findstr /i "error invalid unexpected" "%%f" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [Warning] Potential issues found in %%f
    )
)

echo 2. Checking JavaScript files...
for %%f in (static\js\*.js) do (
    echo Checking: %%f
    findstr /i "console.log console.error debugger" "%%f" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [Info] %%f contains debug statements.
    )
)

echo 3. Checking Hugo templates...
for /r layouts %%f in (*.html) do (
    findstr /c:"{{" "%%f" | findstr /v /c:"}}" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [Warning] %%f might have unclosed template tags.
    )
)

echo 4. Running Hugo build test...
hugo --quiet --minify --gc --cleanDestinationDir
if %errorlevel% equ 0 (
    echo [OK] Hugo build test succeeded.
) else (
    echo [Error] Hugo build test failed.
)

echo ====================================
echo Check Completed.
echo ====================================
pause

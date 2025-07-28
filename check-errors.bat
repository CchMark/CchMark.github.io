@echo off
echo CSS/JS 錯誤檢查腳本...

echo ====================================
echo 1. 檢查 CSS 語法錯誤
echo ====================================

REM 檢查是否有 CSS 錯誤
echo 檢查 CSS 檔案語法...
for %%f in (static\css\*.css) do (
    echo 檢查: %%f
    findstr /i "error\|invalid\|unexpected" "%%f" >nul 2>&1
    if %errorlevel% equ 0 (
        echo 警告：發現可能的 CSS 語法問題在 %%f
    )
)

echo ====================================
echo 2. 檢查 JavaScript 語法錯誤
echo ====================================

REM 檢查 JavaScript 檔案
echo 檢查 JavaScript 檔案語法...
for %%f in (static\js\*.js) do (
    echo 檢查: %%f
    REM 檢查常見的 JavaScript 錯誤模式
    findstr /i "console\.log\|console\.error\|debugger" "%%f" >nul 2>&1
    if %errorlevel% equ 0 (
        echo 提醒：%%f 包含 debug 程式碼
    )
)

echo ====================================
echo 3. 檢查 HTML 模板語法
echo ====================================

echo 檢查 Hugo 模板語法...
for /r layouts %%f in (*.html) do (
    echo 檢查: %%f
    REM 檢查未關閉的 Hugo 模板標籤
    findstr /c:"{{" "%%f" | findstr /v /c:"}}" >nul 2>&1
    if %errorlevel% equ 0 (
        echo 警告：%%f 可能有未關閉的模板標籤
    )
)

echo ====================================
echo 4. 建置測試
echo ====================================

echo 執行 Hugo 建置測試...
hugo --quiet --minify --gc --cleanDestinationDir

if %errorlevel% equ 0 (
    echo ✓ Hugo 建置成功，無語法錯誤
) else (
    echo ✗ Hugo 建置失敗，請檢查語法錯誤
)

echo ====================================
echo 5. 檢查完成
echo ====================================

pause

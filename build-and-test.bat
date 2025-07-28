@echo off
echo 安全優化建置和測試腳本...

echo ====================================
echo 1. 清理舊的建置檔案
echo ====================================
if exist "public" rmdir /s /q public
if exist "resources" rmdir /s /q resources

echo ====================================
echo 2. 檢查 Hugo 版本
echo ====================================
hugo version

echo ====================================
echo 3. 建置網站（含壓縮和優化）
echo ====================================
hugo --minify --gc --cleanDestinationDir

REM 檢查建置是否成功
if %errorlevel% neq 0 (
    echo 建置失敗！請檢查錯誤訊息。
    pause
    exit /b 1
)

echo ====================================
echo 4. 驗證安全標頭設定
echo ====================================
if exist "public\.htaccess" (
    echo .htaccess 檔案已生成
) else (
    echo 警告：.htaccess 檔案未找到
)

if exist "public\sw.js" (
    echo Service Worker 檔案已生成
) else (
    echo 警告：Service Worker 檔案未找到
)

echo ====================================
echo 5. 檢查 HTTPS 資源
echo ====================================
findstr /i "http://" public\*.html >nul 2>&1
if %errorlevel% equ 0 (
    echo 警告：發現非 HTTPS 資源！
    findstr /i "http://" public\*.html
) else (
    echo ✓ 所有資源均使用 HTTPS
)

echo ====================================
echo 6. 建置完成，準備測試
echo ====================================
echo 檔案統計：
dir public /s /-c | find "File(s)"

echo ====================================
echo 7. 啟動本地測試伺服器
echo ====================================
echo 正在啟動 Hugo 開發伺服器...
echo 網址：http://localhost:1313
echo 按 Ctrl+C 停止伺服器
echo ====================================

start "" "http://localhost:1313"
hugo server --minify -D --disableFastRender

pause

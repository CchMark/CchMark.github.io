@echo off
echo 正在優化圖片...

REM 檢查是否安裝了 ImageMagick
where magick >nul 2>nul
if %errorlevel% neq 0 (
    echo 請先安裝 ImageMagick: https://imagemagick.org/script/download.php#windows
    pause
    exit /b 1
)

REM 建立 WebP 版本的圖片
echo 轉換圖片為 WebP 格式...
for /r "static\images" %%f in (*.jpg *.jpeg *.png) do (
    echo 處理: %%f
    magick "%%f" -quality 85 "%%~dpnf.webp"
)

REM 壓縮原始圖片
echo 壓縮原始圖片...
for /r "static\images" %%f in (*.jpg *.jpeg) do (
    echo 壓縮: %%f
    magick "%%f" -quality 85 -strip "%%f"
)

for /r "static\images" %%f in (*.png) do (
    echo 壓縮: %%f
    magick "%%f" -strip "%%f"
)

echo 圖片優化完成！
pause

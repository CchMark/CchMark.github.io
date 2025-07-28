# 網站效能優化指南

本專案已實施多項效能優化措施，以改善網站載入速度和使用者體驗。

## 已實施的優化措施

### 1. 圖片優化
- ✅ **WebP 格式支援**：自動轉換圖片為 WebP 格式
- ✅ **延遲載入**：圖片只在進入視窗時載入
- ✅ **圖片壓縮**：品質設定為 85% 以平衡檔案大小與畫質
- ✅ **響應式圖片**：根據裝置提供適當大小的圖片

### 2. CDN 和資源優化
- ✅ **DNS 預解析**：預先解析外部資源的 DNS
- ✅ **資源預連接**：建立早期連接至 CDN
- ✅ **字型優化**：使用 `font-display: swap` 改善文字載入
- ✅ **FontAwesome CDN**：使用 CDN 加速圖示載入

### 3. JavaScript 和 CSS 優化
- ✅ **關鍵 CSS 內聯**：首頁渲染所需的 CSS 直接嵌入
- ✅ **非同步載入**：非關鍵資源延遲載入
- ✅ **腳本延遲**：JavaScript 在頁面載入完成後執行
- ✅ **CSS/JS 壓縮**：Hugo minify 功能壓縮資源

### 4. 快取和壓縮
- ✅ **Service Worker**：實施前端快取策略
- ✅ **Gzip/Brotli 壓縮**：伺服器端壓縮設定
- ✅ **瀏覽器快取**：適當的快取標頭設定
- ✅ **ETag 最佳化**：移除不必要的 ETag

### 5. Hugo 設定優化
- ✅ **圖片處理**：自動壓縮和格式轉換
- ✅ **HTML/CSS/JS 最小化**：移除不必要的空白和註解
- ✅ **輸出最佳化**：減少 HTML 檔案大小

### 6. 效能監控
- ✅ **連結預取**：滑鼠懸停時預載下一頁
- ✅ **載入動畫**：改善使用者體驗
- ✅ **錯誤處理**：Service Worker 錯誤處理

## 使用方式

### 建置優化網站
```bash
# 使用提供的批次檔
build-and-test.bat

# 或手動執行
hugo --minify
```

### 圖片優化
```bash
# 執行圖片優化腳本（需要 ImageMagick）
optimize-images.bat
```

### 在文章中使用優化圖片
```markdown
{{< img-lazy src="images/example.jpg" alt="圖片描述" class="responsive" >}}
```

## 效能監控建議

### 工具推薦
1. **Google PageSpeed Insights**：https://pagespeed.web.dev/
2. **GTmetrix**：https://gtmetrix.com/
3. **WebPageTest**：https://www.webpagetest.org/
4. **Lighthouse**：Chrome DevTools 內建

### 關鍵指標
- **First Contentful Paint (FCP)**：< 1.8 秒
- **Largest Contentful Paint (LCP)**：< 2.5 秒
- **First Input Delay (FID)**：< 100 毫秒
- **Cumulative Layout Shift (CLS)**：< 0.1

## 進階優化建議

### 1. 伺服器層級優化
- 啟用 HTTP/2 或 HTTP/3
- 實施 CDN（如 Cloudflare）
- 使用 SSD 儲存
- 最佳化 Time to First Byte (TTFB)

### 2. 第三方資源優化
- 審核所有第三方腳本的必要性
- 使用 `loading="lazy"` 屬性
- 實施 Critical Resource Hints

### 3. 內容最佳化
- 減少首頁內容複雜度
- 實施分頁載入
- 優化字型載入策略

## 故障排除

### 常見問題
1. **Service Worker 無法註冊**：檢查 HTTPS 設定
2. **圖片無法載入**：檢查路徑設定
3. **CSS 樣式丟失**：檢查關鍵 CSS 設定

### 調試工具
- Chrome DevTools > Network 標籤
- Chrome DevTools > Lighthouse 面板
- Console 錯誤訊息監控

## 更新日誌

- **2025-07-28**：初始效能優化實施
  - 圖片延遲載入
  - Service Worker 快取
  - CSS/JS 最佳化
  - Hugo 設定優化

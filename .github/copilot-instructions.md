# Copilot Instructions for AI Coding Agents

## 專案架構總覽
- 本專案為 Hugo 靜態網站，內容與佈局分離，支援多語言與自訂主題。
- 主要目錄：
  - `content/`：網站內容（文章、關於、歸檔等），依主題分類。
  - `layouts/`：HTML 佈局與模板，分為主頁、文章、分類等。
  - `static/`：靜態資源（圖片、CSS、JS），直接公開於網站根目錄。
  - `archetypes/`：文章原型模板，供新文章快速建立。
  - `config.toml`：Hugo 全域設定（主題、語言、導航、SEO 等）。

## 關鍵開發流程
- **建置網站**：
  - 使用 Hugo CLI 指令：`hugo` 於專案根目錄產生 `public/`。
  - 本地預覽：`hugo server -D`（含草稿），預設 http://localhost:1313。
- **內容撰寫**：
  - 新文章：`hugo new posts/xxxx.md`，依 `archetypes/default.md` 模板。
  - 文章檔案皆為 Markdown 格式，前置 YAML（front matter）定義標題、日期、分類等。
- **佈局與樣式**：
  - 修改 `layouts/` 內 HTML 檔案以調整頁面結構。
  - 靜態資源請放於 `static/`，如 `static/css/`、`static/images/`。

## 專案慣例與模式
- 文章命名：`YYYYMMDD主題.md` 或 `YYYY-MM-DD-post.md`，利於排序與歸檔。
- 佈局檔案命名：`baseof.html` 為主模板，其他如 `single.html`、`list.html` 對應內容型態。
- Partial 檔案（`layouts/partials/`）用於重複區塊（如 footer、sidebar、SEO）。
- Shortcodes（`layouts/shortcodes/`）用於 Markdown 內嵌自訂元件。

## 整合與外部依賴
- 主要依賴 Hugo，無額外 build/test 工具。
- 部分頁面整合 Disqus（`layouts/partials/disqus.html`）、SEO（`layouts/partials/seo.html`）。
- JS/CSS 依賴於 `static/js/`、`static/css/`，可直接覆蓋或新增。

## 重要檔案範例
- `config.toml`：網站設定，主題、語言、SEO、導航。
- `content/posts/`：所有文章內容。
- `layouts/_default/baseof.html`：全站主模板。
- `static/css/style.css`：主要自訂樣式。

## 其他注意事項
- `public/` 為 Hugo 輸出目錄，勿直接編輯。
- 若需新增語言或主題，請參考 Hugo 官方文件。
- 本專案無自動化測試或 CI/CD 設定。

---
如有不清楚或需補充之處，請回饋以便持續優化指引。

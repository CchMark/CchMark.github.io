# Giscus 留言板設定指南

本指南將協助您在 GitHub 儲存庫啟用 Discussions，並取得設定 Giscus 所需的參數。

---

## 步驟 1：在 GitHub 儲存庫啟用 Discussions

由於 Giscus 是基於 **GitHub Discussions** 運作，因此您需要確保您的 GitHub 專案已經開啟此功能：

1. 開啟您的 GitHub 儲存庫網頁：[CchMark/CchMark.github.io](https://github.com/CchMark/CchMark.github.io)
2. 點擊頂端選單的 **Settings** (設定)。
3. 在左側選單選擇 **General**。
4. 向下滾動找到 **Features** 區塊，勾選 **Discussions**。
5. 成功啟用後，您的儲存庫頂端選單將會出現 **Discussions** 標籤頁。

> [!IMPORTANT]
> 您的 GitHub 儲存庫必須是 **Public (公開)** 狀態，讀者才能在部落格上讀取與新增留言。

---

## 步驟 2：安裝 Giscus GitHub App

為了讓 Giscus 能夠存取您的 Discussions，您需要授權：

1. 前往 [Giscus GitHub App 安裝頁面](https://github.com/apps/giscus)。
2. 點擊 **Install**，並選擇安裝在您個人的帳戶或特定的 `CchMark.github.io` 儲存庫上。

---

## 步驟 3：獲取儲存庫與分類 ID (Repository & Category ID)

1. 開啟 [giscus.app](https://giscus.app/zh-TW) 網站。
2. 往下滾動至 **儲存庫 (Repository)** 區塊，輸入您的儲存庫名稱：`CchMark/CchMark.github.io`。
3. 成功後，網頁會自動顯示該儲存庫的資訊並取得 **Repository ID**（通常為 `R_kgD...` 開頭）。
4. 繼續往下滾動到 **頁面 ↔ 討論 映射方式**，選擇預設的 **Discussion title contains page pathname**（與專案中的 `pathname` 設置一致）。
5. 往下滾動至 **討論分類 (Discussion Category)**，選擇您在 Discussions 中建立的分類（例如 **Announcements** 或 **General**，建議選擇 Announcements 這樣留言會比較整潔），並取得該分類的 **Category ID**（通常為 `DIC_kwD...` 開頭）。

---

## 步驟 4：更新 config.toml 檔案

取得 `repoId` 與 `categoryId` 後，請開啟您的 [config.toml](file:///D:/GitHub/CchMark.github.io/config.toml) 檔案，將這兩個欄位填入：

```toml
# Giscus 留言板 (替代 Disqus)
[params.giscus]
  enable = true
  repo = "CchMark/CchMark.github.io"
  repoId = "您的 Repository ID"     # <--- 在此填入取得的 Repo ID (e.g. R_kgD...)
  category = "Announcements"       # <--- 在此填入您選擇的分類名稱 (e.g. Announcements)
  categoryId = "您的 Category ID"   # <--- 在此填入取得的 Category ID (e.g. DIC_kwD...)
  mapping = "pathname"
  strict = "0"
  reactionsEnabled = "1"
  emitMetadata = "0"
  inputPosition = "bottom"
  theme = "preferred_color_scheme"
  lang = "zh-TW"
  loading = "lazy"
```

---

## 運作原理與功能特點

- **自動同步深色模式**：本專案的 Giscus 整合了 Dynamic Theme Sync 功能。當您在網站上切換深色/淺色模式（經由 `theme-toggle.js`）時，留言板會透過 HTML 屬性監聽器（MutationObserver）同步變更為對應的樣式，無須重新整理網頁。
- **本地防呆機制**：在您尚未填入 `repoId` 與 `categoryId` 前，本地測試網站會在留言區域顯示提示，而不會產生 Javascript 報錯，方便您在設定完成前繼續開發部落格。
- **原始碼結構**：
  - 新增留言元件：[giscus.html](file:///D:/GitHub/CchMark.github.io/layouts/partials/giscus.html)
  - 留言板載入邏輯：[single.html](file:///D:/GitHub/CchMark.github.io/layouts/_default/single.html)

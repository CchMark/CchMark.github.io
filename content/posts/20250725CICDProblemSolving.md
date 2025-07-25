---
title: "CI/CD Pipeline 問題排查與我的思考流程紀錄"
date: 2025-07-25
tags: [CI/CD, DevOps, 問題排查, Docker, NuGet, Nexus]
categories: [技術筆記]
---


## 問題釐清與分解

這次在 GitLab CI/CD 執行 Docker build 時，遇到 NuGet 套件無法從私有 repo 拉取，導致建置失敗。


- 主要錯誤訊息：`error NU1301: Unable to load the service index for source ...`
- 我在本地 Docker build 都沒問題，只有 CI pipeline 會失敗
### 分解問題

- 問題發生在 CI/CD pipeline 的 release 階段
- 失敗的是 `dotnet restore` 拉取 NuGet 套件
- 只有 CI/CD 的 dev_release job 失敗，本地端都正常


## 多角度分析與 5WHY

我用 5WHY 的方式一步步拆解：

1. 為什麼 dotnet restore 失敗？
   - 因為 NuGet 套件找不到
2. 為什麼找不到？
   - 因為 NuGet repo 無法存取
3. 為什麼無法存取？
   - 因為 CI 沒有拿到授權
4. 為什麼沒拿到授權？
   - 因為 Nexus NuGet 帳密（環境變數）沒設定
5. 為什麼沒設定？
   - 因為 dev_release job 少設變數


## 我的解決方案思考

- 關掉 SSL 驗證（但我不建議這麼做）
- Docker image 加公司自簽憑證
- CI job 先用 curl/wget 測試
  
（補充：其實我一開始一直懷疑是憑證或 SSL 設定出錯，結果反覆檢查才發現，真正的問題是 dev_release 這個 job 沒有設定 Nexus NuGet 的帳密，導致 CI/CD 沒拿到授權無法拉 package。最後只要把帳密環境變數補上，整個流程就順利通過了！這也提醒我，遇到 CI/CD 問題時，環境變數和授權設定真的要優先檢查。）


我在 CI/CD pipeline 的 dev_release job 補上正確的 NuGet 網址帳密環境變數，然後重新執行 pipeline，build 就能正常拉取 NuGet 套件了。

---


![CI/CD pipeline 失敗示意圖](../../static/images/GoogleSheetFile/2025-07-25-cicd-fail-demo.png)

▲ 這是當時 pipeline 失敗的畫面，release 階段 dev_release job 沒通過，build/analysis 都正常。

- 本地端 OK/CI fail 多半就是環境或安全層差異


## 我的思考技巧

- 批判性思維：錯誤不一定在 Dockerfile，可能是環境或流程設計問題
- 逆向思維：本地端沒問題，CI 有問題，說明是環境差異
- 歸納/演繹：內部 SSL/CA 問題在 CI 環境屢見不鮮
**問題**：release 階段無法從私有 NuGet repo 拉套件，造成 build fail。  
**解法**：dev_release job 補上 NuGet 授權帳密設定即可。

---

## 總結

這次排查 CI/CD pipeline 問題，讓我再次體認到「環境變數與授權設定」在自動化流程中的重要性。遇到本地端正常、CI/CD失敗時，除了檢查憑證、網路，也要優先確認 pipeline job 的環境變數是否正確傳遞。只要掌握結構化思考與逐步拆解，問題就能快速聚焦並有效解決，也能累積更多 DevOps 實戰經驗。

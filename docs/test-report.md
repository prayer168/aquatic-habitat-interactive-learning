# 測試報告：水域環境探索趣

> 測試日期：2026-06-19　·　方式：本機伺服器（python http.server）以瀏覽器 DOM 實測。

## 功能檢查
- [x] 頁籤（7 個獨立 HTML）之間連結切換正常（active 標示正確）
- [x] 上一頁／下一頁、鍵盤 ← → 正常
- [x] 水域地圖點擊探索可顯示資訊（海洋＝海水＋流水）、可重設、selected 高亮
- [x] 水生植物拖曳配對（觸控點選路徑）可全對、檢查、重設（4/4 correct）
- [x] 食物鏈動畫每階段只顯示一張正確的圖，圖／流程列 active／說明文字三者同步（實測 algae→smallfish 僅一層 visible）
- [x] 動畫播放／暫停／上一步／下一步／重播正常
- [x] 水質前後切換正常（clean/dirty 各只顯示一張）
- [x] 闖關可作答、計分（含排序題，10/10）、解析、回看連結（href 正確）、重玩
- [x] 答錯顯示 ❌、正解、解析與回看教材連結
- [x] 進度跨頁面（localStorage）記錄正常（5/5 單元、闖關最佳 10/10）
- [x] 外部資源連結 8 筆、target=_blank

## 內容檢查
- [x] 原理正確、用語符合國小高年級
- [x] 題目來自教材內容
- [x] 答案與解釋一致
- [x] 課綱代碼標註「待教師依正式課綱手冊確認」
- [x] 生活應用連結教材概念

## 技術檢查
- [x] 相對路徑、無本機絕對路徑
- [x] SVG 圖層以 attribute hidden 切換（非 element.hidden），實測每階段僅一層可見
- [x] 支援 prefers-reduced-motion
- [x] 無敏感金鑰；config.js / .env 已列入 .gitignore
- [x] JavaScript 主控台無錯誤（error 級別 0 筆）
- [x] GitHub Pages 子路徑相容（base: './'，全相對路徑）

## 備註
- 本教材以 ES Modules + fetch 載入 JSON，需經由伺服器開啟（GitHub Pages 或本機 server）；直接雙擊 HTML 會被瀏覽器安全限制擋下，已於 README 與頁面錯誤訊息說明。

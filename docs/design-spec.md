# 設計規格：水域環境探索趣

## 架構
- 多頁式（MPA）：每個單元一個獨立 HTML 檔，以 `<a>` 連結切換。
- 共用版面由 `js/chrome.js` 依 `<body data-page="...">` 動態產生（頁首、頁籤、上一頁/下一頁、頁尾、鍵盤 ← →）。
- `js/app.js` 依當前頁面載入對應 JSON 並渲染、啟動互動；`js/quiz.js` 專責測驗。
- 內容與邏輯分離：所有文字、階段、題目存於 `data/*.json`。

## 視覺
- 風格：清爽自然風，水青（#1f8a9c）＋水草綠（#57b894）＋暖橘強調（#f4a259）。
- 字級基準 18px，行高 1.8，留白充足，按鈕觸控高度 ≥ 46px。
- 不只以顏色傳達資訊（搭配文字標籤、圖示、✅❌）。

## 互動清單
| 頁面 | 互動 | 重設 | 觸控 | 鍵盤 |
|------|------|------|------|------|
| know | 水域地圖點擊探索 | ✓ | ✓ | Enter/Space |
| plants | 拖曳配對（點選式相容觸控） | ✓ | ✓ | 可點選 |
| animals | 食物鏈逐階段動畫 | ✓（重播） | ✓ | 按鈕操作 |
| cherish | 水質前後切換 | — | ✓ | 按鈕操作 |
| quiz | 單選／是非／排序 | ✓（重玩） | ✓ | 原生表單 |

## SVG 動畫規範（重點）
- 圖形教學寫實：水生植物以「與水面關係」為辨識重點（挺出水面／平貼水面/全沉水中/根懸水中漂流）。
- 逐階段同步：食物鏈每一步同時更新①圖層②流程列 active③說明文字。
- 圖層切換以 `setAttribute("hidden","")` / `removeAttribute("hidden")` 控制，並以 CSS `.stage-layer[hidden]{display:none!important}` 保險，避免 SVG 無 `element.hidden` IDL 的陷阱。
- 支援 `prefers-reduced-motion`：停用擺動與流動動畫。

## 無障礙
- 圖形提供 `role="img"` 與 `aria-label`。
- 動畫說明區 `aria-live="polite"`。
- 焦點可見樣式 `:focus-visible`。

## 資料結構
- `content.json`：各頁文字、分類、植物、食物鏈階段、汙染與行動。
- `quiz.json`：題目（type/level/answer/explain/review）。
- `resources.json`：自主學習資源（含 checkedAt）。
- `curriculum.json`：課綱對應（代碼待官方確認）。

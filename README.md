# 🌊 水域環境探索趣

一份適合 **國小高年級（5–6 年級）自然科學** 的互動式數位教材，帶學生從池塘、溪流到海洋，認識水域環境、水生植物與動物，並學會珍惜這片寶貴的家。

## 教材簡介
以多頁式互動網站呈現，結合教學寫實的 SVG 圖形、逐階段同步的動畫，以及拖曳、點擊、切換等互動，最後以闖關大挑戰檢核學習成效，符合十二年國教素養導向精神。

## 適用對象
- 學習階段：國小高年級（五至六年級）
- 領域：自然科學
- 學習時間：約 40 分鐘（一節課）

## 學習目標
1. 說出常見水域環境的種類與特徵（淡水、海水、靜水、流水）。
2. 辨認挺水、浮葉、沉水、漂浮四類水生植物。
3. 認識水生動物的構造與水域食物鏈的關係。
4. 了解水域汙染的成因，並提出珍惜水域的具體做法。

## 教材特色
- 🧩 **多頁式架構**：每個單元為獨立 HTML，以頁籤連結切換，網址可直接分享到特定單元。
- 🎨 **教學寫實 SVG**：水生植物依「與水面關係」精準繪製；食物鏈每階段只顯示一張正確的圖，並與流程列、說明文字同步。
- 🖐 **多種互動**：點擊探索、拖曳配對（支援觸控）、逐階段動畫（播放／暫停／上下步／重播）、水質前後切換。
- 🏆 **素養導向闖關**：10 題涵蓋理解、應用、推理與圖表判讀，作答後有解析與回看教材連結。
- 💾 **跨頁進度保存**：以 localStorage 記錄學習進度與闖關最佳成績。
- ♿ **無障礙與 RWD**：支援鍵盤操作、`prefers-reduced-motion`、手機／平板／電腦。

## 頁籤內容
| 頁面 | 檔案 | 內容 |
|------|------|------|
| 學習任務 | `index.html` | 學習目標、先備知識、進度總覽 |
| 認識水域環境 | `know.html` | 四種水域分類 + 水域地圖點擊探索 |
| 水生植物 | `plants.html` | 四類植物圖解 + 拖曳配對 |
| 水生動物 | `animals.html` | 構造適應 + 池塘食物鏈動畫 |
| 珍惜水域環境 | `cherish.html` | 水質前後切換 + 生活行動 |
| 闖關大挑戰 | `quiz.html` | 10 題互動測驗 |
| 自主學習 | `resources.html` | 8 個延伸學習資源 |

## 使用方式
直接點選頁籤學習，或用鍵盤 ← → 切換頁面；每頁互動皆有「重設／重播」。

## 本機啟動方式
本教材使用 ES 模組與 `fetch` 載入 JSON，需透過伺服器開啟（直接雙擊 HTML 會因瀏覽器安全限制無法載入資料）。

```bash
npm install
npm run dev      # 啟動本機開發伺服器（Vite）
# 或使用任何靜態伺服器，例如：
npx serve .
```

## 專案結構
```
index / know / plants / animals / cherish / quiz / resources .html
css/   style.css · animation.css · responsive.css
js/    chrome.js · app.js · interactions.js · quiz.js · progress.js
data/  content.json · quiz.json · resources.json · curriculum.json
docs/  lesson-plan.md · design-spec.md · references.md · test-report.md
```

## 使用技術
HTML5、CSS3、SVG、原生 JavaScript（ES Modules）、JSON；建置工具 Vite。無大型框架。

## 課綱對應
對應十二年國教自然科學領域「生物與環境」相關學習內容（INc-Ⅲ、INd-Ⅲ、INf-Ⅲ）與環境／海洋教育議題。**正式課綱代碼請教師依官方課綱手冊確認**，詳見 `data/curriculum.json`。

## GitHub Pages 網址
> 部署後補上：`https://prayer168.github.io/aquatic-habitat-interactive-learning/`

## 開發與更新紀錄
詳見 [CHANGELOG.md](CHANGELOG.md)。

## 授權與引用說明
- 教材內容：CC BY 4.0
- 程式碼：MIT
詳見 [LICENSE](LICENSE)。

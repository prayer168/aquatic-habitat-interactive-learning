/* 共用版面：頁首 / 頁籤導覽 / 上一頁下一頁 / 鍵盤切換
   依 <body data-page="..."> 動態產生，各頁面只需放專屬內容。 */
import { markVisited, getPercent, loadProgress } from "./progress.js";

const PAGES = [
  { id: "home",      file: "index.html",     title: "學習任務",   ico: "🏠" },
  { id: "know",      file: "know.html",      title: "認識水域",   ico: "🌊" },
  { id: "plants",    file: "plants.html",    title: "水生植物",   ico: "🌿" },
  { id: "animals",   file: "animals.html",   title: "水生動物",   ico: "🐟" },
  { id: "cherish",   file: "cherish.html",   title: "珍惜水域",   ico: "💧" },
  { id: "quiz",      file: "quiz.html",      title: "闖關挑戰",   ico: "🏆" },
  { id: "resources", file: "resources.html", title: "自主學習",   ico: "📚" }
];

function buildHeader(current) {
  const tabs = PAGES.map((p) =>
    `<a href="${p.file}" class="${p.id === current ? "active" : ""}"${p.id === current ? ' aria-current="page"' : ""}>
       <span class="tab-ico" aria-hidden="true">${p.ico}</span>${p.title}</a>`
  ).join("");

  return `
  <div class="container">
    <div class="head-top">
      <span class="logo" aria-hidden="true">🐠</span>
      <div>
        <h1>水域環境探索趣</h1>
        <p class="subtitle">國小高年級 · 自然科學</p>
      </div>
    </div>
    <nav class="tabs" aria-label="主要單元導覽">${tabs}</nav>
  </div>`;
}

function buildPager(current) {
  const idx = PAGES.findIndex((p) => p.id === current);
  const prev = PAGES[idx - 1];
  const next = PAGES[idx + 1];
  const prevHtml = prev
    ? `<a class="btn secondary" href="${prev.file}">← 上一頁：${prev.title}</a>`
    : `<span class="spacer"></span>`;
  const nextHtml = next
    ? `<a class="btn" href="${next.file}">下一頁：${next.title} →</a>`
    : `<span class="spacer"></span>`;
  return prevHtml + nextHtml;
}

function buildFooter() {
  return `<div class="container">
    水域環境探索趣 · 國小高年級自然科學互動教材 ·
    內容採 <a href="https://creativecommons.org/licenses/by/4.0/deed.zh-hant" target="_blank" rel="noopener">CC BY 4.0</a> 授權
  </div>`;
}

function setupKeyboardNav(current) {
  const idx = PAGES.findIndex((p) => p.id === current);
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select, button, a")) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight" && PAGES[idx + 1]) location.href = PAGES[idx + 1].file;
    if (e.key === "ArrowLeft" && PAGES[idx - 1]) location.href = PAGES[idx - 1].file;
  });
}

export function initChrome() {
  const page = document.body.dataset.page || "home";

  const header = document.querySelector("[data-chrome=header]");
  if (header) { header.className = "site-header"; header.innerHTML = buildHeader(page); }

  const pager = document.querySelector("[data-chrome=pager]");
  if (pager) { pager.className = "pager"; pager.innerHTML = buildPager(page); }

  const footer = document.querySelector("[data-chrome=footer]");
  if (footer) { footer.className = "site-footer"; footer.innerHTML = buildFooter(); }

  markVisited(page);
  setupKeyboardNav(page);

  // 提供其他模組查詢
  return { page, percent: getPercent(), progress: loadProgress() };
}

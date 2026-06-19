/* 依當前頁面載入需要的 JSON、渲染內容並啟動互動 */
import { initChrome } from "./chrome.js";
import { loadProgress, getPercent, LEARN_PAGES } from "./progress.js";
import {
  getPlantSVG, buildWaterMap, WATER_MAP_INFO,
  buildFoodChainLayers, showFoodChainStage,
  buildCompareSVG, showCompareState, enableDragMatch
} from "./interactions.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

async function getJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("載入失敗：" + path);
  return res.json();
}

/* ============ 首頁 ============ */
function renderHome(data) {
  const h = data.home, s = data.site;
  $("#intro").textContent = s.intro;
  $("#goals").innerHTML = h.goals.map((g) => `<li>${g}</li>`).join("");
  $("#prior").innerHTML = h.prior.map((g) => `<li>${g}</li>`).join("");
  $("#duration").textContent = h.duration;

  const pct = getPercent();
  $("#home-progress-fill").style.width = pct + "%";
  const p = loadProgress();
  const done = LEARN_PAGES.filter((pg) => p.visited.includes(pg)).length;
  $("#home-progress-label").textContent =
    `已完成 ${done} / ${LEARN_PAGES.length} 個單元（${pct}%）` +
    (p.quizBest ? `　·　闖關最佳：${p.quizBest.score}/${p.quizBest.total}` : "");
}

/* ============ 認識水域 ============ */
function renderKnow(data) {
  const k = data.know;
  $("#know-lead").textContent = k.lead;
  $("#know-sections").innerHTML = k.sections.map((sec) => `
    <div class="card">
      <span class="section-flag">${sec.name}</span>
      <p>${sec.desc}</p>
      <div>${sec.examples.map((e) => `<span class="tag">${e}</span>`).join("")}</div>
    </div>`).join("");
  $("#know-note").textContent = k.note;

  // 點擊探索地圖
  $("#water-map").innerHTML = buildWaterMap();
  const info = $("#map-info");
  function select(spot) {
    $$("#water-map .hotspot").forEach((g) =>
      g.classList.toggle("selected", g.dataset.spot === spot));
    const d = WATER_MAP_INFO[spot];
    info.innerHTML = `<strong>${d.name}</strong>　${d.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      <p style="margin:8px 0 0">${d.desc}</p>`;
    info.className = "feedback hint";
  }
  $$("#water-map .hotspot").forEach((g) => {
    g.addEventListener("click", () => select(g.dataset.spot));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g.dataset.spot); } });
  });
  $("#map-reset").addEventListener("click", () => {
    $$("#water-map .hotspot").forEach((g) => g.classList.remove("selected"));
    info.textContent = "點選地圖上的任一水域，看看它的分類與特徵。";
    info.className = "feedback hint";
  });
}

/* ============ 水生植物（拖曳配對） ============ */
function renderPlants(data) {
  const pl = data.plants;
  $("#plants-lead").textContent = pl.lead;
  $("#plants-types").innerHTML = pl.types.map((t) => `
    <div class="card">
      <div class="stage-svg-wrap" style="max-width:200px">${getPlantSVG(t.key)}</div>
      <span class="section-flag">${t.name}</span>
      <p><strong>特徵：</strong>${t.feature}</p>
      <p>${t.desc}</p>
      <div>${t.examples.map((e) => `<span class="tag">${e}</span>`).join("")}</div>
    </div>`).join("");
  $("#plants-role").textContent = pl.role;

  // 拖曳配對：把例子放到正確類別
  buildPlantMatch(pl);
}

const MATCH_ITEMS = [
  { name: "荷花", key: "emergent" },
  { name: "睡蓮", key: "floating-leaf" },
  { name: "水蘊草", key: "submerged" },
  { name: "浮萍", key: "free-floating" }
];

function buildPlantMatch(pl) {
  const pool = $("#match-pool");
  const zones = $("#match-zones");
  // 打散（用固定洗牌避免 Math.random）
  const order = [2, 0, 3, 1];
  pool.innerHTML = order.map((i) => {
    const it = MATCH_ITEMS[i];
    return `<button type="button" class="drag-item" data-key="${it.key}">${it.name}</button>`;
  }).join("");
  zones.innerHTML = pl.types.map((t) => `
    <div class="drop-zone" data-zone="${t.key}">
      <h4>${t.name}</h4><div class="slot"></div>
    </div>`).join("");

  const fb = $("#match-feedback");
  function check() {
    const placed = $$("#match-pool .drag-item.placed, #match-zones .drag-item.placed");
    const all = $$(".drag-item");
    const allPlaced = all.every((i) => i.dataset.placedIn);
    if (!allPlaced) { fb.textContent = "繼續把植物拖到正確的類別吧！"; fb.className = "feedback hint"; return; }
    let correct = 0;
    $$(".drop-zone").forEach((z) => {
      const items = $$(".drag-item", z);
      let zoneOk = items.length > 0;
      items.forEach((it) => { if (it.dataset.key !== z.dataset.zone) zoneOk = false; });
      z.classList.toggle("correct", zoneOk && items.length > 0);
      z.classList.toggle("wrong", !zoneOk && items.length > 0);
      if (zoneOk) correct += items.length;
    });
    if (correct === all.length) {
      fb.textContent = "🎉 全部配對正確！你已經會分辨四類水生植物了。";
      fb.className = "feedback ok";
    } else {
      fb.textContent = `配對對了 ${correct} / ${all.length} 個，紅框的再想想看，點植物再點正確類別即可移動。`;
      fb.className = "feedback no";
    }
  }
  enableDragMatch(document.querySelector("#match-area"), check);
  $("#match-check").addEventListener("click", check);
  $("#match-reset").addEventListener("click", () => buildPlantMatch(pl));
}

/* ============ 水生動物（食物鏈動畫） ============ */
function renderAnimals(data) {
  const a = data.animals;
  $("#animals-lead").textContent = a.lead;
  $("#animals-adapt").innerHTML = a.adaptations.map((ad) => `
    <div class="card"><span class="section-flag">${ad.part}</span><p>${ad.desc}</p></div>`).join("");

  const fc = a.foodchain;
  $("#fc-title").textContent = fc.title;
  $("#fc-intro").textContent = fc.intro;
  $("#fc-svg").innerHTML = buildFoodChainLayers();
  const svgRoot = $("#fc-svg svg");

  // 流程列
  const flow = $("#fc-flow");
  flow.innerHTML = fc.stages.map((s, i) =>
    `${i ? '<span class="stage-arrow" aria-hidden="true">→</span>' : ""}
     <button type="button" class="stage-step" data-stage="${s.key}" data-idx="${i}">
       ${s.name}<span class="role">${s.role}</span></button>`).join("");
  const caption = $("#fc-caption");
  const steps = $$("#fc-flow .stage-step");

  let idx = 0, timer = null;
  function go(i) {
    idx = i;
    const s = fc.stages[i];
    steps.forEach((st) => st.classList.toggle("active", st.dataset.stage === s.key));
    showFoodChainStage(svgRoot, s.key);
    caption.textContent = s.text;
  }
  steps.forEach((st) => st.addEventListener("click", () => { stop(); go(+st.dataset.idx); }));

  function play() {
    stop();
    $("#fc-play").textContent = "▶ 播放中…";
    timer = setInterval(() => {
      if (idx >= fc.stages.length - 1) { stop(); caption.textContent = fc.outro; return; }
      go(idx + 1);
    }, 2000);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; $("#fc-play").textContent = "▶ 播放"; }

  $("#fc-play").addEventListener("click", play);
  $("#fc-pause").addEventListener("click", stop);
  $("#fc-reset").addEventListener("click", () => { stop(); go(0); });
  $("#fc-prev").addEventListener("click", () => { stop(); if (idx > 0) go(idx - 1); });
  $("#fc-next").addEventListener("click", () => { stop(); if (idx < fc.stages.length - 1) go(idx + 1); });

  go(0);
}

/* ============ 珍惜水域 ============ */
function renderCherish(data) {
  const c = data.cherish;
  $("#cherish-lead").textContent = c.lead;

  $("#compare-title").textContent = c.pollution.title;
  $("#compare-svg").innerHTML = buildCompareSVG();
  const svgRoot = $("#compare-svg svg");
  const desc = $("#compare-desc");
  function setState(state) {
    showCompareState(svgRoot, state);
    $$("#compare-toggle .btn").forEach((b) => b.classList.toggle("accent", b.dataset.state === state));
    desc.textContent = state === "clean" ? c.pollution.clean : c.pollution.dirty;
    desc.className = state === "clean" ? "feedback ok" : "feedback no";
  }
  $$("#compare-toggle .btn").forEach((b) =>
    b.addEventListener("click", () => setState(b.dataset.state)));
  setState("clean");

  $("#causes").innerHTML = c.pollution.causes.map((x) => `<span class="tag">${x}</span>`).join("");
  $("#actions").innerHTML = c.actions.map((x) => `<li>${x}</li>`).join("");
}

/* ============ 自主學習 ============ */
function renderResources(list) {
  $("#res-list").innerHTML = list.map((r) => `
    <div class="card">
      <h2><a href="${r.url}" target="_blank" rel="noopener">${r.title} ↗</a></h2>
      <div><span class="tag">${r.type}</span><span class="tag">${r.grade}</span></div>
      <p>${r.description}</p>
      <p class="muted" style="font-size:.85rem">檢視日期：${r.checkedAt}</p>
    </div>`).join("");
}

/* ============ 啟動 ============ */
async function main() {
  const { page } = initChrome();
  try {
    if (page === "resources") {
      const data = await getJSON("data/resources.json");
      renderResources(data.resources);
      return;
    }
    if (page === "quiz") return; // quiz.js 自行處理

    const data = await getJSON("data/content.json");
    const map = { home: renderHome, know: renderKnow, plants: renderPlants, animals: renderAnimals, cherish: renderCherish };
    (map[page] || (() => {}))(data);
  } catch (e) {
    console.error(e);
    const main = document.querySelector("main .container") || document.querySelector("main");
    if (main) {
      const p = document.createElement("p");
      p.className = "feedback no";
      p.textContent = "內容載入失敗，請以本機伺服器（如 npm run dev）或 GitHub Pages 開啟本教材。";
      main.prepend(p);
    }
  }
}

document.addEventListener("DOMContentLoaded", main);

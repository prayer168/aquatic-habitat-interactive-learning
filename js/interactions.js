/* 互動與 SVG 圖形（教學寫實）。
   注意：切換 SVG 圖層一律用 setAttribute/removeAttribute("hidden")，
   不用 element.hidden（SVG 無此 IDL 屬性）。CSS 另有 [hidden]{display:none!important} 保險。 */

/* ---------- 共用 SVG 小元件 ---------- */
function waterBand(y, h, color) {
  return `<rect x="0" y="${y}" width="400" height="${h}" fill="${color}"/>`;
}

/* ---------- 水生植物四類 SVG（與水面關係為辨識重點） ---------- */
// 水面在 y=70；水底在 y=190
const PLANT_SVG = {
  emergent: `
  <svg viewBox="0 0 200 220" role="img" aria-label="挺水植物：荷花，根在水底，莖葉挺出水面">
    <rect x="0" y="0" width="200" height="70" fill="#dff1f7"/>
    <rect x="0" y="70" width="200" height="120" fill="#bfe3ec"/>
    <rect x="0" y="190" width="200" height="30" fill="#caa472"/>
    <line x1="0" y1="70" x2="200" y2="70" stroke="#8fcdd9" stroke-width="2"/>
    <!-- 根在水底 -->
    <path d="M100 190 q-10 8 -22 12 M100 190 q10 8 22 12 M100 190 v14" stroke="#6b8f3a" stroke-width="2" fill="none"/>
    <!-- 挺出水面的莖 -->
    <line x1="100" y1="190" x2="100" y2="50" stroke="#3c8d4e" stroke-width="5"/>
    <line x1="130" y1="190" x2="130" y2="80" stroke="#3c8d4e" stroke-width="4"/>
    <!-- 挺立的荷葉（在空氣中） -->
    <ellipse cx="130" cy="74" rx="26" ry="9" fill="#4caa5d"/>
    <!-- 荷花 -->
    <g transform="translate(100,46)">
      <path d="M0 6 C-14 -6 -10 -22 0 -20 C10 -22 14 -6 0 6Z" fill="#f3a6c0"/>
      <path d="M-12 4 C-22 -4 -18 -18 -8 -16 Z" fill="#f6bcd0"/>
      <path d="M12 4 C22 -4 18 -18 8 -16 Z" fill="#f6bcd0"/>
      <circle cx="0" cy="-6" r="4" fill="#f2d24a"/>
    </g>
    <text x="100" y="212" text-anchor="middle" font-size="11" fill="#5a4427">水底泥土</text>
  </svg>`,

  "floating-leaf": `
  <svg viewBox="0 0 200 220" role="img" aria-label="浮葉植物：睡蓮，根在水底，葉片平貼水面">
    <rect x="0" y="0" width="200" height="70" fill="#dff1f7"/>
    <rect x="0" y="70" width="200" height="120" fill="#bfe3ec"/>
    <rect x="0" y="190" width="200" height="30" fill="#caa472"/>
    <line x1="0" y1="70" x2="200" y2="70" stroke="#8fcdd9" stroke-width="2"/>
    <!-- 根固定水底 -->
    <path d="M100 190 q-8 8 -16 12 M100 190 q8 8 16 12 M100 190 v14" stroke="#6b8f3a" stroke-width="2" fill="none"/>
    <!-- 細長葉柄連到水面 -->
    <path d="M100 190 C96 150 84 110 70 72" stroke="#3c8d4e" stroke-width="3" fill="none"/>
    <path d="M100 190 C108 150 124 110 132 72" stroke="#3c8d4e" stroke-width="3" fill="none"/>
    <!-- 平貼水面的葉（含缺口） -->
    <path d="M44 70 a26 8 0 1 0 52 0 l-24 0 z" fill="#4caa5d"/>
    <path d="M108 70 a24 7 0 1 0 48 0 l-22 0 z" fill="#56b568"/>
    <!-- 水面上的睡蓮花 -->
    <g transform="translate(118,66)">
      <path d="M0 2 C-8 -6 -6 -14 0 -13 C6 -14 8 -6 0 2Z" fill="#f6bcd0"/>
      <circle cx="0" cy="-5" r="2.5" fill="#f2d24a"/>
    </g>
    <text x="100" y="212" text-anchor="middle" font-size="11" fill="#5a4427">水底泥土</text>
  </svg>`,

  submerged: `
  <svg viewBox="0 0 200 220" role="img" aria-label="沉水植物：水蘊草，整株沉在水面下，葉細長柔軟">
    <rect x="0" y="0" width="200" height="70" fill="#dff1f7"/>
    <rect x="0" y="70" width="200" height="120" fill="#bfe3ec"/>
    <rect x="0" y="190" width="200" height="30" fill="#caa472"/>
    <line x1="0" y1="70" x2="200" y2="70" stroke="#8fcdd9" stroke-width="2"/>
    <!-- 根在水底 -->
    <path d="M100 190 q-8 6 -14 10 M100 190 q8 6 14 10" stroke="#6b8f3a" stroke-width="2" fill="none"/>
    <!-- 整株都在水面下，細長柔軟 -->
    <g class="water-plant">
      <path d="M100 190 C92 160 108 140 100 110 C94 92 104 86 100 78" stroke="#3c8d4e" stroke-width="3" fill="none"/>
      <path d="M78 190 C72 162 84 142 78 116 C74 100 82 94 80 86" stroke="#3c8d4e" stroke-width="3" fill="none"/>
      <path d="M122 190 C128 160 116 142 122 116 C126 102 120 96 122 90" stroke="#3c8d4e" stroke-width="3" fill="none"/>
      <!-- 細長葉 -->
      <g stroke="#5cb56b" stroke-width="2">
        <line x1="100" y1="120" x2="90" y2="112"/><line x1="100" y1="120" x2="110" y2="112"/>
        <line x1="78" y1="130" x2="68" y2="124"/><line x1="78" y1="130" x2="88" y2="124"/>
        <line x1="122" y1="130" x2="132" y2="124"/><line x1="122" y1="130" x2="112" y2="124"/>
      </g>
    </g>
    <text x="100" y="212" text-anchor="middle" font-size="11" fill="#5a4427">水底泥土</text>
  </svg>`,

  "free-floating": `
  <svg viewBox="0 0 200 220" role="img" aria-label="漂浮植物：浮萍，根懸在水中沒有固定，整株隨水漂流">
    <rect x="0" y="0" width="200" height="70" fill="#dff1f7"/>
    <rect x="0" y="70" width="200" height="120" fill="#bfe3ec"/>
    <rect x="0" y="190" width="200" height="30" fill="#caa472"/>
    <line x1="0" y1="70" x2="200" y2="70" stroke="#8fcdd9" stroke-width="2"/>
    <!-- 浮在水面的小葉群，根懸在水中 -->
    <g class="water-plant">
      <ellipse cx="70" cy="68" rx="14" ry="6" fill="#56b568"/>
      <ellipse cx="70" cy="68" rx="14" ry="6" fill="none"/>
      <path d="M64 72 v18 M70 72 v22 M76 72 v18" stroke="#7bbf7f" stroke-width="1.5"/>
    </g>
    <g class="water-plant" style="animation-delay:-2s">
      <ellipse cx="120" cy="66" rx="16" ry="6.5" fill="#4caa5d"/>
      <path d="M113 70 v20 M120 70 v24 M127 70 v20" stroke="#7bbf7f" stroke-width="1.5"/>
    </g>
    <ellipse cx="150" cy="70" rx="9" ry="4" fill="#56b568"/>
    <text x="100" y="120" text-anchor="middle" font-size="11" fill="#2a6b7a">根懸在水中，沒有固定</text>
    <text x="100" y="212" text-anchor="middle" font-size="11" fill="#5a4427">水底泥土（根未接觸）</text>
  </svg>`
};

export function getPlantSVG(key) { return PLANT_SVG[key] || ""; }

/* ---------- 點擊探索：水域地圖（know.html） ---------- */
export function buildWaterMap() {
  return `
  <svg viewBox="0 0 400 240" role="img" aria-label="水域地圖：可點選溪流、池塘、湖泊與海洋">
    <rect x="0" y="0" width="400" height="240" fill="#eaf6f3"/>
    <!-- 山與陸地 -->
    <path d="M0 0 L0 120 L120 60 L210 110 L300 50 L400 100 L400 0 Z" fill="#cfe3c4"/>
    <!-- 溪流（流水/淡水） -->
    <g class="hotspot" data-spot="flow" tabindex="0" role="button" aria-label="溪流">
      <path d="M150 0 C160 40 130 70 150 110 C170 150 140 180 160 240" stroke="#6ec6d8" stroke-width="14" fill="none" stroke-linecap="round"/>
      <text x="118" y="40" font-size="13" fill="#156b7a" font-weight="700">溪流</text>
    </g>
    <!-- 池塘（靜水/淡水） -->
    <g class="hotspot" data-spot="pond" tabindex="0" role="button" aria-label="池塘">
      <ellipse cx="70" cy="180" rx="48" ry="30" fill="#7fcfe0"/>
      <text x="70" y="184" text-anchor="middle" font-size="13" fill="#0d4d5c" font-weight="700">池塘</text>
    </g>
    <!-- 湖泊（靜水/淡水） -->
    <g class="hotspot" data-spot="lake" tabindex="0" role="button" aria-label="湖泊">
      <ellipse cx="250" cy="170" rx="40" ry="26" fill="#69bdd0"/>
      <text x="250" y="174" text-anchor="middle" font-size="13" fill="#0d4d5c" font-weight="700">湖泊</text>
    </g>
    <!-- 海洋（海水/流水） -->
    <g class="hotspot" data-spot="sea" tabindex="0" role="button" aria-label="海洋">
      <rect x="320" y="120" width="80" height="120" fill="#2f86b0"/>
      <path d="M320 132 q10 -6 20 0 t20 0 t20 0 t20 0" stroke="#bfe3ec" stroke-width="2" fill="none"/>
      <text x="360" y="180" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">海洋</text>
    </g>
  </svg>`;
}

export const WATER_MAP_INFO = {
  pond:  { name: "池塘", tags: ["淡水", "靜水"], desc: "鹽分低、水流慢。常見挺水植物（荷花）與小魚、青蛙。" },
  lake:  { name: "湖泊", tags: ["淡水", "靜水"], desc: "面積較大的靜止淡水，水深處有沉水植物。" },
  flow:  { name: "溪流", tags: ["淡水", "流水"], desc: "水持續流動、帶來氧氣，住著喜歡清涼流水的魚與水生昆蟲。" },
  sea:   { name: "海洋", tags: ["海水", "流水"], desc: "含鹽分、面積廣大，有海藻、珊瑚與各種海洋魚類。" }
};

/* ---------- 食物鏈四階段 SVG（每階段只顯示一張） ---------- */
// 底圖：池塘剖面。各階段強調當前生物。
function pondBase(extra) {
  return `
    <rect x="0" y="0" width="400" height="60" fill="#dff1f7"/>
    <rect x="0" y="60" width="400" height="180" fill="#9fd4e3"/>
    <rect x="0" y="225" width="400" height="15" fill="#caa472"/>
    <line x1="0" y1="60" x2="400" y2="60" stroke="#8fcdd9" stroke-width="2"/>
    ${extra}`;
}
function algaeShape(hi) {
  const c = hi ? "#3c8d4e" : "#8fbf94";
  return `<g class="water-plant">
    <path d="M40 225 C34 200 46 185 40 165" stroke="${c}" stroke-width="3" fill="none"/>
    <path d="M55 225 C61 200 49 185 55 168" stroke="${c}" stroke-width="3" fill="none"/>
    <circle cx="80" cy="150" r="4" fill="${c}"/><circle cx="92" cy="160" r="3" fill="${c}"/>
    <circle cx="70" cy="165" r="3" fill="${c}"/></g>`;
}
function smallFish(hi) {
  const c = hi ? "#e08c3e" : "#bcd";
  return `<g transform="translate(150,140)"><path d="M0 0 q14 -8 28 0 q-14 8 -28 0Z" fill="${c}"/><path d="M28 0 l8 -5 v10 Z" fill="${c}"/><circle cx="6" cy="-1" r="1.6" fill="#333"/></g>`;
}
function bigFish(hi) {
  const c = hi ? "#3f7fa0" : "#bcd";
  return `<g transform="translate(180,150)"><path d="M0 0 q34 -20 66 0 q-34 20 -66 0Z" fill="${c}"/><path d="M66 0 l16 -10 v20 Z" fill="${c}"/><path d="M30 -14 l6 -10 6 10 Z" fill="${c}"/><circle cx="14" cy="-2" r="3" fill="#222"/></g>`;
}
function bird(hi) {
  const c = hi ? "#5a5048" : "#cfd6d2";
  // 水鳥（蒼鷺風）站立、長腿長喙
  return `<g transform="translate(250,20)">
    <ellipse cx="20" cy="40" rx="22" ry="12" fill="${c}"/>
    <path d="M30 32 q14 -22 6 -30" stroke="${c}" stroke-width="6" fill="none"/>
    <circle cx="34" cy="6" r="6" fill="${c}"/>
    <path d="M40 6 l20 2 -20 4 Z" fill="#e0a23a"/>
    <line x1="14" y1="50" x2="14" y2="78" stroke="${c}" stroke-width="3"/>
    <line x1="26" y1="50" x2="26" y2="78" stroke="${c}" stroke-width="3"/>
  </g>`;
}

export function buildFoodChainLayers() {
  // 每個 stage-layer 為完整一張圖，只強調當前生物
  const L = (key, content) =>
    `<g class="stage-layer" data-stage="${key}" ${key === "algae" ? "" : "hidden"}>${pondBase(content)}</g>`;

  const layers =
    L("algae",    algaeShape(true)  + smallFish(false) + bigFish(false) + bird(false)) +
    L("smallfish",algaeShape(false) + smallFish(true)  + bigFish(false) + bird(false)) +
    L("bigfish",  algaeShape(false) + smallFish(false) + bigFish(true)  + bird(false)) +
    L("bird",     algaeShape(false) + smallFish(false) + bigFish(false) + bird(true));

  return `<svg viewBox="0 0 400 240" role="img" aria-label="池塘食物鏈動畫">${layers}</svg>`;
}

export function showFoodChainStage(svgRoot, stageKey) {
  svgRoot.querySelectorAll(".stage-layer").forEach((g) => {
    if (g.dataset.stage === stageKey) g.removeAttribute("hidden");
    else g.setAttribute("hidden", "");
  });
}

/* ---------- 水質前後切換（cherish.html） ---------- */
export function buildCompareSVG() {
  const clean = `
  <g class="compare-stage" data-state="clean">
    <rect x="0" y="0" width="400" height="70" fill="#dff1f7"/>
    <rect x="0" y="70" width="400" height="150" fill="#7fcfe0"/>
    <rect x="0" y="210" width="400" height="30" fill="#caa472"/>
    <path d="M40 220 C34 195 46 180 40 160" stroke="#3c8d4e" stroke-width="3" fill="none"/>
    <path d="M360 220 C366 195 354 180 360 162" stroke="#3c8d4e" stroke-width="3" fill="none"/>
    <g transform="translate(150,140)"><path d="M0 0 q16 -9 32 0 q-16 9 -32 0Z" fill="#e08c3e"/><path d="M32 0 l8 -5 v10Z" fill="#e08c3e"/></g>
    <g transform="translate(240,160)"><path d="M0 0 q12 -7 24 0 q-12 7 -24 0Z" fill="#d6694f"/><path d="M24 0 l6 -4 v8Z" fill="#d6694f"/></g>
    <text x="200" y="40" text-anchor="middle" font-size="14" fill="#156b7a" font-weight="700">清澈、生物多</text>
  </g>`;
  const dirty = `
  <g class="compare-stage" data-state="dirty" hidden>
    <rect x="0" y="0" width="400" height="70" fill="#e4e0d2"/>
    <rect x="0" y="70" width="400" height="150" fill="#9a9b6d"/>
    <rect x="0" y="210" width="400" height="30" fill="#7d6a4a"/>
    <!-- 垃圾 -->
    <rect x="60" y="78" width="18" height="12" fill="#b94b3a" transform="rotate(12 69 84)"/>
    <circle cx="300" cy="82" r="7" fill="#555"/>
    <path d="M180 80 q10 6 20 0" stroke="#6b6a3a" stroke-width="2" fill="none"/>
    <!-- 翻肚的魚 -->
    <g transform="translate(150,150)"><path d="M0 0 q16 -9 32 0 q-16 9 -32 0Z" fill="#cfc9b0"/><path d="M16 0 l3 -6 3 6Z" fill="#a59f86"/></g>
    <text x="200" y="44" text-anchor="middle" font-size="14" fill="#5a4d2a" font-weight="700">混濁、生物減少</text>
  </g>`;
  return `<svg viewBox="0 0 400 240" role="img" aria-label="水質乾淨與受汙染對照">${clean}${dirty}</svg>`;
}

export function showCompareState(svgRoot, state) {
  svgRoot.querySelectorAll(".compare-stage").forEach((g) => {
    if (g.dataset.state === state) g.removeAttribute("hidden");
    else g.setAttribute("hidden", "");
  });
}

/* ---------- 拖曳配對（含觸控） ---------- */
export function enableDragMatch(root, onDrop) {
  let dragging = null;

  function place(item, zone) {
    const slot = zone.querySelector(".slot");
    slot.appendChild(item);
    item.classList.add("placed");
    item.dataset.placedIn = zone.dataset.zone;
    onDrop && onDrop();
  }

  // 滑鼠 / HTML5 拖放
  root.querySelectorAll(".drag-item").forEach((item) => {
    item.setAttribute("draggable", "true");
    item.addEventListener("dragstart", () => { dragging = item; item.classList.add("dragging"); });
    item.addEventListener("dragend", () => { item.classList.remove("dragging"); });
  });
  root.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault(); zone.classList.remove("over");
      if (dragging) place(dragging, zone);
    });
  });

  // 觸控：點選 item 後點選區域
  let selected = null;
  root.querySelectorAll(".drag-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (selected === item) { item.classList.remove("dragging"); selected = null; return; }
      root.querySelectorAll(".drag-item").forEach((i) => i.classList.remove("dragging"));
      selected = item; item.classList.add("dragging");
    });
  });
  root.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("click", () => {
      if (selected) { place(selected, zone); selected.classList.remove("dragging"); selected = null; }
    });
  });
}

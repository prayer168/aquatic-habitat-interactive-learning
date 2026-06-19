/* 互動與 SVG 圖形（教學寫實）。
   注意：切換 SVG 圖層一律用 setAttribute/removeAttribute("hidden")，
   不用 element.hidden（SVG 無此 IDL 屬性）。CSS 另有 [hidden]{display:none!important} 保險。 */

/* ---------- 共用 SVG 小元件 ---------- */
function waterBand(y, h, color) {
  return `<rect x="0" y="${y}" width="400" height="${h}" fill="${color}"/>`;
}

/* ---------- 水域分類動畫 SVG（認識水域 know.html 四張卡片） ---------- */
// 重點：鹹淡（淡水/海水）與流動（靜水/流水）。皆含動畫。
const WATER_TYPE_SVG = {
  fresh: `
  <svg viewBox="0 0 220 120" role="img" aria-label="淡水水域：清澈、鹽分低，可飲用">
    <rect x="0" y="0" width="220" height="120" fill="#eaf7ef"/>
    <path d="M0 46 Q110 38 220 50 L220 120 L0 120 Z" fill="#bfe0a3"/>
    <path d="M20 60 Q110 50 200 62 L192 104 Q110 114 28 102 Z" fill="#79cadd"/>
    <g class="rip-soft" stroke="#e4f5f9" stroke-width="2.5" fill="none" opacity=".85" stroke-linecap="round">
      <path d="M56 76 q14 -5 28 0"/><path d="M118 90 q14 -5 28 0"/>
    </g>
    <g transform="translate(92,84)">
      <path d="M0 0 q14 -8 28 0 q-14 8 -28 0Z" fill="#f4a259"/>
      <path d="M28 0 l8 -5 v10 Z" fill="#f4a259"/><circle cx="7" cy="-1" r="1.8" fill="#333"/>
    </g>
    <g stroke="#5a7d32" stroke-width="2.5"><line x1="26" y1="62" x2="22" y2="38"/><line x1="33" y1="64" x2="30" y2="44"/></g>
    <ellipse cx="22" cy="36" rx="3" ry="7" fill="#8a6d3b"/>
    <path d="M198 18 c7 9 7 16 0 21 c-7 -5 -7 -12 0 -21Z" fill="#5bb6cf"/>
  </svg>`,

  salt: `
  <svg viewBox="0 0 220 120" role="img" aria-label="海水水域：含鹽分、面積廣大">
    <rect x="0" y="0" width="220" height="120" fill="#cdeefb"/>
    <circle cx="38" cy="28" r="14" fill="#ffe48a"/>
    <rect x="0" y="54" width="220" height="66" fill="#2f86b0"/>
    <rect x="0" y="54" width="220" height="22" fill="#3f97c0"/>
    <g class="wave-move">
      <path d="M-30 64 q14 -8 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" stroke="#cdeaf2" stroke-width="3" fill="none"/>
      <path d="M-30 84 q14 -8 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" stroke="#9fd0e0" stroke-width="2" fill="none" opacity=".7"/>
    </g>
    <g fill="#ffffff" opacity=".92">
      <path d="M150 30 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4Z"/>
      <path d="M182 46 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6Z"/>
    </g>
    <text x="158" y="22" font-size="11" fill="#156b7a" font-weight="700">鹽分高</text>
  </svg>`,

  still: `
  <svg viewBox="0 0 220 120" role="img" aria-label="靜水水域：水面平靜、幾乎不流動">
    <rect x="0" y="0" width="220" height="120" fill="#eaf7ef"/>
    <path d="M0 50 Q110 44 220 52 L220 120 L0 120 Z" fill="#bfe0a3"/>
    <ellipse cx="110" cy="86" rx="98" ry="27" fill="#86cfe0"/>
    <line x1="30" y1="80" x2="84" y2="80" stroke="#cdeef4" stroke-width="2.5" opacity=".7"/>
    <ellipse class="rip-ring" cx="96" cy="90" rx="26" ry="8" fill="none" stroke="#dff1f7" stroke-width="2.5"/>
    <path d="M150 86 a15 5 0 1 0 30 0 l-14 0 z" fill="#4caa5d"/>
    <text x="110" y="34" text-anchor="middle" font-size="11" fill="#2a6b7a" font-weight="700">水面平靜</text>
  </svg>`,

  flow: `
  <svg viewBox="0 0 220 120" role="img" aria-label="流水水域：水持續流動、帶來氧氣">
    <rect x="0" y="0" width="220" height="120" fill="#eaf7ef"/>
    <path d="M0 0 L0 120 L220 120 L220 0 Z" fill="#eaf7ef"/>
    <path d="M0 34 Q110 28 220 40 L220 56 Q110 44 0 50 Z" fill="#bfe0a3"/>
    <path d="M0 50 L220 56 L220 96 L0 86 Z" fill="#5bb6cf"/>
    <path d="M0 86 Q110 96 220 96 L220 120 L0 120 Z" fill="#bfe0a3"/>
    <g class="flow-current" stroke="#e4f5f9" stroke-width="3.5" fill="none" stroke-linecap="round">
      <path d="M14 62 L120 70"/><path d="M44 56 L150 64"/><path d="M22 74 L128 82"/>
    </g>
    <g fill="#dff1f7"><path d="M150 62 l12 3.5 -12 3.5 4 -3.5Z"/><path d="M156 76 l12 3.5 -12 3.5 4 -3.5Z"/></g>
    <ellipse cx="78" cy="74" rx="9" ry="5" fill="#9a8b6f"/>
    <ellipse cx="170" cy="84" rx="7" ry="4" fill="#8a7c61"/>
    <text x="44" y="30" font-size="11" fill="#156b7a" font-weight="700">水流方向 →</text>
  </svg>`
};

export function getWaterTypeSVG(key) { return WATER_TYPE_SVG[key] || ""; }

/* ---------- 水生植物四類 SVG（與水面關係為辨識重點，加大、寫實） ---------- */
// viewBox 240×300：空氣 0–90、水 90–255、泥土 255–300，水面線 y=90
function plantBands() {
  return `
    <rect x="0" y="0" width="240" height="90" fill="#e3f3f9"/>
    <rect x="0" y="90" width="240" height="165" fill="#bfe3ec"/>
    <rect x="0" y="180" width="240" height="75" fill="#abd6e4"/>
    <rect x="0" y="255" width="240" height="45" fill="#caa472"/>
    <line x1="0" y1="90" x2="240" y2="90" stroke="#8fcdd9" stroke-width="2.5"/>
    <g fill="#b0884f"><circle cx="42" cy="278" r="3"/><circle cx="150" cy="285" r="3"/><circle cx="205" cy="272" r="2.5"/></g>`;
}

const PLANT_SVG = {
  emergent: `
  <svg viewBox="0 0 240 300" role="img" aria-label="挺水植物：荷花。根長在水底泥土，莖和葉挺出水面">
    ${plantBands()}
    <ellipse cx="120" cy="262" rx="15" ry="6" fill="#c9b083"/>
    <path d="M120 262 q-28 8 -48 6 M120 262 q28 8 48 6 M120 262 v18" stroke="#7a5a2e" stroke-width="2.5" fill="none"/>
    <path d="M120 262 C116 200 110 140 104 70" stroke="#3c8d4e" stroke-width="6" fill="none"/>
    <path d="M120 262 C128 200 144 150 156 86" stroke="#3c8d4e" stroke-width="5" fill="none"/>
    <!-- 荷葉：挺出水面、微凹、有放射葉脈 -->
    <g class="water-plant" style="animation-delay:-1.4s">
      <path d="M112 84 Q156 58 200 84 Q156 98 112 84 Z" fill="#4caa5d"/>
      <path d="M112 84 Q156 70 200 84" fill="none" stroke="#3a8a4d" stroke-width="2"/>
      <g stroke="#3a8a4d" stroke-width="1.2" opacity=".55">
        <line x1="156" y1="90" x2="120" y2="84"/><line x1="156" y1="90" x2="140" y2="78"/>
        <line x1="156" y1="90" x2="156" y2="74"/><line x1="156" y1="90" x2="172" y2="78"/><line x1="156" y1="90" x2="192" y2="84"/>
      </g>
    </g>
    <!-- 荷花：層疊花瓣 + 蓮蓬 -->
    <g class="water-plant">
      <path d="M104 72 C84 52 86 26 104 18 C122 26 124 52 104 72Z" fill="#f3b6cd"/>
      <path d="M104 70 C78 60 68 34 82 20 C100 26 104 48 104 70Z" fill="#f6c6d8"/>
      <path d="M104 70 C130 60 140 34 126 20 C108 26 104 48 104 70Z" fill="#f6c6d8"/>
      <path d="M104 72 C90 54 90 32 104 24 C118 32 118 54 104 72Z" fill="#f79ac0"/>
      <path d="M104 70 C86 66 74 48 84 34 C98 38 104 54 104 70Z" fill="#fbd2e0"/>
      <path d="M104 70 C122 66 134 48 124 34 C110 38 104 54 104 70Z" fill="#fbd2e0"/>
      <ellipse cx="104" cy="48" rx="7" ry="6" fill="#f2d24a"/>
      <circle cx="101" cy="47" r="1.2" fill="#c9a42a"/><circle cx="107" cy="48" r="1.2" fill="#c9a42a"/><circle cx="104" cy="44" r="1.2" fill="#c9a42a"/>
    </g>
    <text x="120" y="284" text-anchor="middle" font-size="12" fill="#5a4427">水底泥土</text>
  </svg>`,

  "floating-leaf": `
  <svg viewBox="0 0 240 300" role="img" aria-label="浮葉植物：睡蓮。根固定水底，葉片平貼漂浮在水面">
    ${plantBands()}
    <path d="M120 262 q-24 8 -42 6 M120 262 q24 8 42 6 M120 262 v16" stroke="#7a5a2e" stroke-width="2.5" fill="none"/>
    <!-- 細長葉柄連到水面 -->
    <path d="M120 262 C108 200 84 140 70 96" stroke="#3c8d4e" stroke-width="3.5" fill="none"/>
    <path d="M120 262 C132 200 158 140 168 96" stroke="#3c8d4e" stroke-width="3.5" fill="none"/>
    <path d="M120 262 C126 210 156 150 200 94" stroke="#3c8d4e" stroke-width="3" fill="none"/>
    <!-- 平貼水面的圓葉（有缺口、葉脈） -->
    <path d="M30 90 a40 11 0 1 0 80 0 l-37 0 z" fill="#4caa5d"/>
    <g stroke="#3a8a4d" stroke-width="1" opacity=".5"><line x1="70" y1="90" x2="36" y2="88"/><line x1="70" y1="90" x2="52" y2="98"/><line x1="70" y1="90" x2="92" y2="98"/><line x1="70" y1="90" x2="104" y2="88"/></g>
    <path d="M118 90 a34 9 0 1 0 68 0 l-31 0 z" fill="#56b568"/>
    <g stroke="#3a8a4d" stroke-width="1" opacity=".5"><line x1="152" y1="90" x2="124" y2="96"/><line x1="152" y1="90" x2="152" y2="98"/><line x1="152" y1="90" x2="180" y2="96"/></g>
    <!-- 睡蓮花：低平、層疊，浮在水面 -->
    <g class="water-plant" style="animation-delay:-1s">
      <ellipse cx="200" cy="90" rx="20" ry="6" fill="#eaf3f5" opacity=".5"/>
      <g fill="#fbd2e0">
        <ellipse cx="184" cy="88" rx="9" ry="3.5" transform="rotate(-12 200 88)"/>
        <ellipse cx="216" cy="88" rx="9" ry="3.5" transform="rotate(12 200 88)"/>
        <ellipse cx="200" cy="84" rx="3.5" ry="9"/>
      </g>
      <g fill="#f79ac0">
        <ellipse cx="192" cy="86" rx="7" ry="3" transform="rotate(-28 200 86)"/>
        <ellipse cx="208" cy="86" rx="7" ry="3" transform="rotate(28 200 86)"/>
      </g>
      <ellipse cx="200" cy="86" rx="4" ry="3.5" fill="#f2d24a"/>
    </g>
    <text x="120" y="284" text-anchor="middle" font-size="12" fill="#5a4427">水底泥土</text>
  </svg>`,

  submerged: `
  <svg viewBox="0 0 240 300" role="img" aria-label="沉水植物：水蘊草。整株沉在水面下，葉細長柔軟">
    ${plantBands()}
    <path d="M120 262 q-18 8 -30 6 M120 262 q18 8 30 6 M120 262 v14" stroke="#7a5a2e" stroke-width="2" fill="none"/>
    <!-- 整株沉水、輪生細葉，隨水搖曳 -->
    <g class="water-plant">
      <g stroke="#3c8d4e" stroke-width="3.5" fill="none">
        <path d="M96 258 C88 214 102 176 96 132 C93 116 99 112 97 106"/>
        <path d="M120 258 C126 212 114 176 120 132 C123 116 117 112 120 104"/>
        <path d="M146 258 C152 216 140 184 146 144 C149 130 144 126 146 120"/>
      </g>
      <g stroke="#62ba70" stroke-width="2" stroke-linecap="round">
        <path d="M96 230 l-12 -6 M96 230 l12 -6 M96 210 l-13 -5 M96 210 l13 -5 M96 190 l-12 -6 M96 190 l12 -6 M96 168 l-12 -6 M96 168 l12 -6 M96 146 l-11 -6 M96 146 l11 -6 M97 124 l-10 -5 M97 124 l10 -5"/>
        <path d="M120 226 l-12 -6 M120 226 l12 -6 M120 206 l-13 -5 M120 206 l13 -5 M120 186 l-12 -6 M120 186 l12 -6 M120 164 l-12 -6 M120 164 l12 -6 M120 142 l-11 -6 M120 142 l11 -6 M120 122 l-10 -5 M120 122 l10 -5"/>
        <path d="M146 232 l-11 -6 M146 232 l11 -6 M146 212 l-12 -5 M146 212 l12 -5 M146 192 l-11 -6 M146 192 l11 -6 M146 170 l-11 -6 M146 170 l11 -6 M146 150 l-10 -6 M146 150 l10 -6 M146 134 l-9 -5 M146 134 l9 -5"/>
      </g>
    </g>
    <text x="120" y="284" text-anchor="middle" font-size="12" fill="#5a4427">水底泥土</text>
  </svg>`,

  "free-floating": `
  <svg viewBox="0 0 240 300" role="img" aria-label="漂浮植物：浮萍。根懸在水中沒有固定，整株隨水漂流">
    ${plantBands()}
    <!-- 三叢浮萍，葉群浮在水面、細根懸在水中 -->
    <g class="water-plant">
      <ellipse cx="62" cy="88" rx="13" ry="6" fill="#56b568"/><ellipse cx="79" cy="90" rx="11" ry="5" fill="#4caa5d"/><ellipse cx="70" cy="83" rx="9" ry="4.5" fill="#62ba70"/>
      <g stroke="#a7d8b0" stroke-width="1.4"><line x1="60" y1="93" x2="58" y2="122"/><line x1="70" y1="94" x2="69" y2="128"/><line x1="79" y1="94" x2="81" y2="120"/></g>
    </g>
    <g class="water-plant" style="animation-delay:-1.6s">
      <ellipse cx="128" cy="86" rx="14" ry="6" fill="#4caa5d"/><ellipse cx="146" cy="88" rx="11" ry="5" fill="#56b568"/><ellipse cx="137" cy="82" rx="9" ry="4.5" fill="#62ba70"/>
      <g stroke="#a7d8b0" stroke-width="1.4"><line x1="126" y1="91" x2="124" y2="124"/><line x1="137" y1="92" x2="136" y2="130"/><line x1="146" y1="92" x2="148" y2="122"/></g>
    </g>
    <g class="water-plant" style="animation-delay:-0.8s">
      <ellipse cx="194" cy="90" rx="12" ry="5.5" fill="#56b568"/><ellipse cx="180" cy="88" rx="9" ry="4.5" fill="#62ba70"/>
      <g stroke="#a7d8b0" stroke-width="1.4"><line x1="192" y1="94" x2="191" y2="120"/><line x1="180" y1="92" x2="179" y2="116"/></g>
    </g>
    <text x="120" y="166" text-anchor="middle" font-size="12" fill="#2a6b7a">根懸在水中，沒有固定</text>
    <text x="120" y="284" text-anchor="middle" font-size="12" fill="#5a4427">水底泥土（根未接觸）</text>
  </svg>`
};

export function getPlantSVG(key) { return PLANT_SVG[key] || ""; }

/* ---------- 更多常見水生植物（圖鑑小圖，viewBox 120×140） ---------- */
function speciesBands() {
  return `
    <rect x="0" y="0" width="120" height="58" fill="#e3f3f9"/>
    <rect x="0" y="58" width="120" height="62" fill="#bfe3ec"/>
    <rect x="0" y="120" width="120" height="20" fill="#caa472"/>
    <line x1="0" y1="58" x2="120" y2="58" stroke="#8fcdd9" stroke-width="2"/>`;
}

const SPECIES_SVG = {
  // 挺水：香蒲（葉劍形挺立、棕色蠟燭狀花穗）
  cattail: `
  <svg viewBox="0 0 120 140" role="img" aria-label="香蒲：挺水植物，花穗像棕色蠟燭">
    ${speciesBands()}
    <path d="M60 118 q-14 8 -22 12 M60 118 q14 8 22 12 M60 118 v14" stroke="#7a5a2e" stroke-width="2" fill="none"/>
    <g class="water-plant">
      <path d="M52 118 C44 80 40 50 42 18" stroke="#4c9a52" stroke-width="4" fill="none"/>
      <path d="M70 118 C78 78 82 48 80 16" stroke="#57b05c" stroke-width="4" fill="none"/>
      <line x1="60" y1="118" x2="60" y2="34" stroke="#3c8d4e" stroke-width="4"/>
      <rect x="55" y="24" width="10" height="26" rx="5" fill="#8a5a2b"/>
      <line x1="60" y1="24" x2="60" y2="12" stroke="#3c8d4e" stroke-width="2.5"/>
    </g>
    <text x="60" y="134" text-anchor="middle" font-size="9" fill="#5a4427">挺水</text>
  </svg>`,

  // 挺水：水稻（細葉、低垂稻穗，長在水田）
  rice: `
  <svg viewBox="0 0 120 140" role="img" aria-label="水稻：挺水植物，結稻穗，種在水田">
    ${speciesBands()}
    <path d="M60 118 q-12 8 -20 12 M60 118 q12 8 20 12 M60 118 v14" stroke="#7a5a2e" stroke-width="2" fill="none"/>
    <g class="water-plant">
      <line x1="60" y1="118" x2="58" y2="40" stroke="#7aa83f" stroke-width="3.5"/>
      <path d="M58 80 C44 74 38 64 36 54" stroke="#8cbf52" stroke-width="3" fill="none"/>
      <path d="M58 70 C72 64 80 56 84 48" stroke="#8cbf52" stroke-width="3" fill="none"/>
      <path d="M58 40 C58 30 66 26 70 22" stroke="#c9a64b" stroke-width="2.5" fill="none"/>
      <g fill="#d8b85a"><ellipse cx="62" cy="34" rx="2.6" ry="4.5"/><ellipse cx="66" cy="29" rx="2.6" ry="4.5"/><ellipse cx="70" cy="24" rx="2.6" ry="4.5"/><ellipse cx="56" cy="38" rx="2.6" ry="4.5"/></g>
    </g>
    <text x="60" y="134" text-anchor="middle" font-size="9" fill="#5a4427">挺水</text>
  </svg>`,

  // 浮葉：菱角（菱形葉成叢浮水面，水下有角果）
  caltrop: `
  <svg viewBox="0 0 120 140" role="img" aria-label="菱角：浮葉植物，菱形葉成叢浮在水面，果實有角">
    ${speciesBands()}
    <path d="M60 118 q-10 6 -18 10 M60 118 q10 6 18 10" stroke="#7a5a2e" stroke-width="2" fill="none"/>
    <path d="M60 118 C58 96 56 76 58 60" stroke="#3c8d4e" stroke-width="2.5" fill="none"/>
    <!-- 浮在水面的菱形葉蓮座 -->
    <g fill="#4caa5d" stroke="#3a8a4d" stroke-width="1">
      <path d="M60 54 l8 -6 8 6 -8 6 z"/><path d="M60 54 l-8 -6 -8 6 8 6 z"/>
      <path d="M60 50 l6 -7 7 4 -5 7 z"/><path d="M60 50 l-6 -7 -7 4 5 7 z"/>
      <path d="M60 58 l7 5 -3 8 -8 -5 z"/><path d="M60 58 l-7 5 3 8 8 -5 z"/>
    </g>
    <!-- 水下角果 -->
    <path d="M60 80 l6 6 -6 4 -6 -4 z" fill="#5a4427"/>
    <text x="60" y="134" text-anchor="middle" font-size="9" fill="#5a4427">浮葉</text>
  </svg>`,

  // 沉水：金魚藻（羽狀輪生細葉，整株沉水）
  hornwort: `
  <svg viewBox="0 0 120 140" role="img" aria-label="金魚藻：沉水植物，葉細裂像羽毛">
    ${speciesBands()}
    <g class="water-plant">
      <path d="M60 120 C56 96 64 80 60 64" stroke="#3c8d4e" stroke-width="3" fill="none"/>
      <g stroke="#57b05c" stroke-width="1.6" stroke-linecap="round">
        <path d="M60 108 q-10 -2 -16 -8 M60 108 q10 -2 16 -8"/>
        <path d="M60 96 q-11 -2 -17 -9 M60 96 q11 -2 17 -9"/>
        <path d="M60 84 q-10 -2 -16 -8 M60 84 q10 -2 16 -8"/>
        <path d="M60 72 q-9 -2 -14 -8 M60 72 q9 -2 14 -8"/>
      </g>
    </g>
    <text x="60" y="134" text-anchor="middle" font-size="9" fill="#5a4427">沉水</text>
  </svg>`,

  // 漂浮：布袋蓮（葉柄膨大充氣浮水，紫花，外來種）
  hyacinth: `
  <svg viewBox="0 0 120 140" role="img" aria-label="布袋蓮：漂浮植物，葉柄膨大充氣，開紫花">
    ${speciesBands()}
    <g class="water-plant">
      <ellipse cx="48" cy="60" rx="9" ry="13" fill="#7bbf7f"/>
      <ellipse cx="72" cy="60" rx="9" ry="13" fill="#6bb46f"/>
      <ellipse cx="48" cy="44" rx="11" ry="8" fill="#4caa5d"/>
      <ellipse cx="72" cy="44" rx="11" ry="8" fill="#57b05c"/>
      <line x1="60" y1="50" x2="60" y2="24" stroke="#5a8a3f" stroke-width="2.5"/>
      <g fill="#9b7fd4"><circle cx="60" cy="22" r="4"/><circle cx="54" cy="26" r="3.5"/><circle cx="66" cy="26" r="3.5"/></g>
      <g stroke="#a7d8b0" stroke-width="1.3"><line x1="56" y1="72" x2="54" y2="100"/><line x1="64" y1="72" x2="66" y2="104"/><line x1="60" y1="74" x2="60" y2="110"/></g>
    </g>
    <text x="60" y="134" text-anchor="middle" font-size="9" fill="#5a4427">漂浮</text>
  </svg>`,

  // 漂浮：大萍（葉成蓮座狀漂浮，像小白菜）
  waterlettuce: `
  <svg viewBox="0 0 120 140" role="img" aria-label="大萍：漂浮植物，葉成蓮座狀漂浮如小白菜">
    ${speciesBands()}
    <g class="water-plant">
      <g fill="#7bbf7f" stroke="#5a9a52" stroke-width="1">
        <ellipse cx="44" cy="50" rx="11" ry="15"/><ellipse cx="76" cy="50" rx="11" ry="15"/>
        <ellipse cx="60" cy="44" rx="11" ry="16"/>
        <ellipse cx="52" cy="54" rx="9" ry="13" fill="#8fce8f"/><ellipse cx="68" cy="54" rx="9" ry="13" fill="#8fce8f"/>
      </g>
      <g stroke="#a7d8b0" stroke-width="1.3"><line x1="56" y1="64" x2="54" y2="98"/><line x1="64" y1="64" x2="66" y2="102"/><line x1="60" y1="66" x2="60" y2="108"/></g>
    </g>
    <text x="60" y="134" text-anchor="middle" font-size="9" fill="#5a4427">漂浮</text>
  </svg>`
};

export function getSpeciesSVG(key) { return SPECIES_SVG[key] || ""; }

/* ---------- 點擊探索：水域地圖（know.html） ---------- */
// 連貫地景：山上溪流注入海洋，岸邊有池塘與湖泊，右側為沙灘與海。
function mapLabel(x, y, text, dark) {
  const w = text.length * 15 + 14, h = 22;
  const fill = dark ? "#0d4d5c" : "#fff";
  const bg = dark ? "rgba(255,255,255,.82)" : "rgba(13,77,92,.55)";
  return `<g>
    <rect x="${x - w / 2}" y="${y - h + 5}" width="${w}" height="${h}" rx="11" fill="${bg}"/>
    <text x="${x}" y="${y}" text-anchor="middle" font-size="14" font-weight="700" fill="${fill}">${text}</text>
  </g>`;
}

export function buildWaterMap() {
  return `
  <svg viewBox="0 0 400 250" role="img" aria-label="水域地景：可點選溪流、池塘、湖泊與海洋">
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#cdeefb"/><stop offset="1" stop-color="#eaf7ef"/>
      </linearGradient>
      <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#46a4c8"/><stop offset="1" stop-color="#216f97"/>
      </linearGradient>
      <linearGradient id="riverG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8fd3e3"/><stop offset="1" stop-color="#5bb6cf"/>
      </linearGradient>
    </defs>

    <!-- 天空 -->
    <rect x="0" y="0" width="400" height="250" fill="url(#skyG)"/>
    <circle cx="56" cy="40" r="17" fill="#ffe48a"/>
    <ellipse cx="300" cy="34" rx="26" ry="9" fill="#ffffff" opacity=".75"/>
    <ellipse cx="320" cy="40" rx="20" ry="8" fill="#ffffff" opacity=".7"/>

    <!-- 遠山 -->
    <path d="M0 110 L70 46 L150 110 Z" fill="#a7cb96"/>
    <path d="M110 110 L195 34 L285 110 Z" fill="#8fbb7e"/>
    <path d="M195 56 L210 46 L225 56 L218 64 L202 64 Z" fill="#ffffff" opacity=".85"/>

    <!-- 草地 -->
    <path d="M0 96 Q120 84 250 92 Q330 96 400 104 L400 250 L0 250 Z" fill="#bfe0a3"/>
    <path d="M0 150 Q200 140 400 156 L400 250 L0 250 Z" fill="#aed592"/>

    <!-- 沙灘 -->
    <path d="M300 96 C322 140 300 190 322 250 L400 250 L400 96 Z" fill="#f0dca6"/>

    <!-- 海洋（海水 / 流水） -->
    <g class="hotspot" data-spot="sea" tabindex="0" role="button" aria-label="海洋">
      <path d="M332 96 C352 140 330 190 352 250 L400 250 L400 96 Z" fill="url(#seaG)"/>
      <g stroke="#dff1f7" stroke-width="2" fill="none" opacity=".8">
        <path d="M350 120 q12 -6 24 0 t24 0"/>
        <path d="M348 150 q12 -6 24 0 t24 0"/>
        <path d="M350 182 q12 -6 24 0 t24 0"/>
        <path d="M352 214 q12 -6 24 0 t24 0"/>
      </g>
      ${mapLabel(368, 110, "海洋", false)}
    </g>

    <!-- 溪流（淡水 / 流水）：自山谷流下注入海洋 -->
    <g class="hotspot" data-spot="flow" tabindex="0" role="button" aria-label="溪流">
      <path d="M205 60
               C196 92 214 110 206 134
               C198 160 226 176 236 196
               C246 214 300 210 338 206
               L342 224
               C300 228 250 232 226 210
               C206 192 214 168 224 146
               C232 124 214 104 222 78
               C224 70 226 66 224 60 Z"
            fill="url(#riverG)"/>
      <!-- 水花石頭 -->
      <ellipse cx="214" cy="120" rx="5" ry="3" fill="#cfeaf0"/>
      <ellipse cx="232" cy="172" rx="6" ry="3" fill="#cfeaf0"/>
      ${mapLabel(168, 120, "溪流", true)}
    </g>

    <!-- 湖泊（淡水 / 靜水）：草地上較大的靜止水域 -->
    <g class="hotspot" data-spot="lake" tabindex="0" role="button" aria-label="湖泊">
      <ellipse cx="150" cy="150" rx="62" ry="34" fill="#74c4d8"/>
      <ellipse cx="150" cy="150" rx="62" ry="34" fill="none" stroke="#9bd6e4" stroke-width="3" opacity=".7"/>
      <path d="M120 150 q10 -4 20 0 t20 0" stroke="#dff1f7" stroke-width="2" fill="none" opacity=".8"/>
      ${mapLabel(150, 155, "湖泊", true)}
    </g>

    <!-- 池塘（淡水 / 靜水）：左下角小水塘，有荷葉與蘆葦 -->
    <g class="hotspot" data-spot="pond" tabindex="0" role="button" aria-label="池塘">
      <ellipse cx="64" cy="214" rx="56" ry="30" fill="#86cfe0"/>
      <ellipse cx="64" cy="214" rx="56" ry="30" fill="none" stroke="#a7dde9" stroke-width="3" opacity=".7"/>
      <!-- 荷葉 -->
      <path d="M34 210 a11 4 0 1 0 22 0 l-10 0 z" fill="#5cb56b"/>
      <ellipse cx="84" cy="206" rx="10" ry="4" fill="#4caa5d"/>
      <!-- 蘆葦 -->
      <line x1="18" y1="214" x2="16" y2="190" stroke="#6b8f3a" stroke-width="2"/>
      <ellipse cx="16" cy="188" rx="2.5" ry="6" fill="#8a6d3b"/>
      <line x1="24" y1="216" x2="23" y2="196" stroke="#6b8f3a" stroke-width="2"/>
      ${mapLabel(70, 219, "池塘", true)}
    </g>
  </svg>`;
}

export const WATER_MAP_INFO = {
  pond:  { name: "池塘", tags: ["淡水", "靜水"], desc: "鹽分低、水流慢。常見挺水植物（荷花）與小魚、青蛙。" },
  lake:  { name: "湖泊", tags: ["淡水", "靜水"], desc: "面積較大的靜止淡水，水深處有沉水植物。" },
  flow:  { name: "溪流", tags: ["淡水", "流水"], desc: "水持續流動、帶來氧氣，住著喜歡清涼流水的魚與水生昆蟲。" },
  sea:   { name: "海洋", tags: ["海水", "流水"], desc: "含鹽分、面積廣大，有海藻、珊瑚與各種海洋魚類。" }
};

/* ---------- 水生動物特殊構造 SVG（會動） ---------- */
const ADAPT_SVG = {
  // 鰓：魚頭特寫，水從嘴進、由鰓蓋排出（氣泡上升）
  gill: `
  <svg viewBox="0 0 200 140" role="img" aria-label="鰓：魚用鰓吸收水中溶氧，水從嘴進、由鰓排出">
    <rect x="0" y="0" width="200" height="140" fill="#cfeaf2"/>
    <g class="bob">
      <path d="M150 70 q-70 -44 -120 0 q50 44 120 0Z" fill="#7fb4cf"/>
      <path d="M150 70 q-70 -44 -120 0 q14 12 14 0 q0 -12 14 -8" fill="#92c2d8"/>
      <!-- 鰓蓋 -->
      <path d="M64 44 q14 26 0 52" fill="none" stroke="#4a7e99" stroke-width="3"/>
      <!-- 紅色鰓 -->
      <g stroke="#d6584a" stroke-width="3" fill="none">
        <path d="M58 50 q10 20 0 40"/><path d="M52 52 q10 18 0 36"/>
      </g>
      <!-- 嘴 -->
      <path d="M30 70 q-6 -5 0 -10 M30 70 q-6 5 0 10" stroke="#4a7e99" stroke-width="2.5" fill="none"/>
      <circle cx="120" cy="62" r="5" fill="#fff"/><circle cx="120" cy="62" r="2.5" fill="#222"/>
      <path d="M150 70 l24 -16 v32 Z" fill="#7fb4cf"/>
    </g>
    <!-- 水流箭頭：進嘴 -->
    <g stroke="#2f86b0" stroke-width="2.5" fill="#2f86b0">
      <line x1="6" y1="70" x2="24" y2="70"/><path d="M24 70 l-7 -4 v8 Z"/>
    </g>
    <!-- 氣泡從鰓排出 -->
    <g fill="#eaf7fb"><circle class="bubble" cx="60" cy="44" r="3"/><circle class="bubble" cx="68" cy="46" r="2.2" style="animation-delay:-1.4s"/><circle class="bubble" cx="55" cy="42" r="2.6" style="animation-delay:-2.4s"/></g>
    <text x="100" y="128" text-anchor="middle" font-size="11" fill="#156b7a">水從嘴進，氧氣由鰓吸收</text>
  </svg>`,

  // 鰭：標出各種鰭，尾鰭擺動
  fin: `
  <svg viewBox="0 0 200 140" role="img" aria-label="鰭：魚靠背鰭、胸鰭、尾鰭游泳、平衡與轉向">
    <rect x="0" y="0" width="200" height="140" fill="#cfeaf2"/>
    <g class="bob">
      <!-- 背鰭 -->
      <path d="M96 56 q18 -22 38 -6 l-30 8 Z" fill="#3f7fa0"/>
      <!-- 身體 -->
      <path d="M44 78 q56 -34 110 0 q-56 34 -110 0Z" fill="#6fa8c6"/>
      <!-- 尾鰭擺動 -->
      <g class="tail-flick"><path d="M154 78 l26 -16 v32 Z" fill="#3f7fa0"/></g>
      <!-- 胸鰭 -->
      <path d="M92 86 q6 18 -12 22 q-2 -16 12 -22Z" fill="#3f7fa0"/>
      <!-- 腹鰭 -->
      <path d="M110 90 q2 12 -8 16 q-2 -10 8 -16Z" fill="#5793b3"/>
      <circle cx="64" cy="74" r="5" fill="#fff"/><circle cx="64" cy="74" r="2.6" fill="#222"/>
    </g>
    <g font-size="10" fill="#156b7a" font-weight="700">
      <text x="118" y="40" text-anchor="middle">背鰭</text>
      <text x="70" y="120" text-anchor="middle">胸鰭</text>
      <text x="184" y="50" text-anchor="end">尾鰭</text>
    </g>
  </svg>`,

  // 流線型身體：魚前進，周圍水流線（流動）
  streamline: `
  <svg viewBox="0 0 200 140" role="img" aria-label="流線型身體：身體呈流線型，游泳時水的阻力較小">
    <rect x="0" y="0" width="200" height="140" fill="#cfeaf2"/>
    <!-- 流線（環繞身體、流動） -->
    <g class="flow-current" stroke="#9fd0e0" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M186 50 q-70 -10 -150 8"/>
      <path d="M186 70 q-80 0 -160 0"/>
      <path d="M186 90 q-70 10 -150 -8"/>
    </g>
    <g class="bob">
      <path d="M40 70 q60 -32 116 0 q-60 32 -116 0Z" fill="#5b96b8"/>
      <path d="M156 70 l26 -15 v30 Z" fill="#3f7fa0"/>
      <path d="M96 50 q14 -16 30 -4 l-24 7 Z" fill="#3f7fa0"/>
      <circle cx="62" cy="66" r="5" fill="#fff"/><circle cx="62" cy="66" r="2.6" fill="#222"/>
    </g>
    <g stroke="#2f86b0" stroke-width="2.5" fill="#2f86b0"><line x1="150" y1="120" x2="178" y2="120"/><path d="M178 120 l-8 -4 v8 Z"/></g>
    <text x="60" y="124" text-anchor="middle" font-size="11" fill="#156b7a">前進方向</text>
  </svg>`,

  // 蹼：青蛙的蹼足，划水擺動
  web: `
  <svg viewBox="0 0 200 140" role="img" aria-label="蹼：青蛙與水鳥的腳有蹼，划水更有力">
    <rect x="0" y="0" width="200" height="140" fill="#cfeaf2"/>
    <!-- 腿 -->
    <path d="M70 30 q24 22 30 50" stroke="#5a9a52" stroke-width="9" fill="none" stroke-linecap="round"/>
    <!-- 蹼足（趾間有蹼膜），划水擺動 -->
    <g class="paddle">
      <path d="M100 80 L78 116 Q100 108 122 118 L100 80 Z" fill="#6bb46f"/>
      <path d="M100 80 L80 114 M100 80 L92 120 M100 80 L108 120 M100 80 L120 116" stroke="#3c8d4e" stroke-width="2.5"/>
      <path d="M78 116 Q100 108 122 118" fill="none" stroke="#4caa5d" stroke-width="2"/>
    </g>
    <!-- 划水波紋 -->
    <g stroke="#9fd0e0" stroke-width="2" fill="none" opacity=".8"><path class="rip-soft" d="M132 110 q10 -5 20 0"/><path class="rip-soft" d="M132 122 q10 -5 20 0" style="animation-delay:-1s"/></g>
    <text x="100" y="134" text-anchor="middle" font-size="11" fill="#156b7a">趾間有蹼，划水更有力</text>
  </svg>`
};

export function getAdaptSVG(key) { return ADAPT_SVG[key] || ""; }

/* ---------- 池塘食物鏈：豐富的生態場景，每階段強調當前生物 ---------- */
// 同一場景畫四層，只切換顯示一層（每階段只一張正確的圖）。
// 非當前營養階用低透明度淡化；當前階加光暈、可點選跳階。
function dim(active, key) { return active === key ? "1" : "0.25"; }
function glow(active, key, cx, cy, rx, ry) {
  return active === key
    ? `<ellipse class="fc-glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffe9a8"/>`
    : "";
}
// 捕食／能量箭頭（指向當前階）
function preyArrow(active) {
  const arr = {
    algae:     [54, 54, 70, 150],   // 陽光 → 藻類
    smallfish: [96, 168, 138, 150], // 藻類 → 小魚
    bigfish:   [180, 150, 236, 150],// 小魚 → 大魚
    bird:      [276, 150, 320, 126] // 大魚 → 水鳥
  }[active];
  if (!arr) return "";
  const [x1, y1, x2, y2] = arr;
  const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return `<g class="energy-arrow flowing" stroke="#f4a259" stroke-width="3.5" fill="#f4a259" stroke-linecap="round">
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
    <g transform="translate(${x2},${y2}) rotate(${ang})"><path d="M0 0 l-11 -5 v10 Z"/></g>
  </g>`;
}

function pondScene(active) {
  return `
    <!-- 背景 -->
    <rect x="0" y="0" width="400" height="60" fill="#dff1f7"/>
    <rect x="0" y="60" width="400" height="165" fill="#9fd4e3"/>
    <rect x="0" y="150" width="400" height="75" fill="#86c6d8"/>
    <rect x="0" y="225" width="400" height="15" fill="#caa472"/>
    <line x1="0" y1="60" x2="400" y2="60" stroke="#8fcdd9" stroke-width="2"/>
    <circle cx="44" cy="30" r="15" fill="#ffe48a"/>
    <!-- 常駐生態：蘆葦、荷葉、石頭、蝸牛、蜻蜓、氣泡 -->
    <g stroke="#6b8f3a" stroke-width="3" fill="none"><path d="M24 225 C20 180 30 150 26 120"/><path d="M34 225 C40 184 30 154 36 128"/></g>
    <ellipse cx="26" cy="118" rx="3" ry="8" fill="#8a6d3b"/>
    <path d="M120 60 a20 6 0 1 0 40 0 l-18 0 z" fill="#5cb56b"/>
    <ellipse cx="356" cy="216" rx="22" ry="10" fill="#9a8b6f"/>
    <ellipse cx="300" cy="220" rx="14" ry="7" fill="#8a7c61"/>
    <!-- 蝸牛 -->
    <g transform="translate(40,214)"><circle cx="0" cy="0" r="6" fill="#c9a26a"/><path d="M0 0 a3.5 3.5 0 1 1 -1 -3" fill="none" stroke="#7a5a2e" stroke-width="1.5"/><path d="M-6 2 q-6 0 -8 4" stroke="#c9a26a" stroke-width="3" fill="none"/></g>
    <!-- 蜻蜓（空中） -->
    <g class="fly" transform="translate(330,30)"><line x1="0" y1="0" x2="16" y2="0" stroke="#3f7fa0" stroke-width="2"/><ellipse cx="6" cy="-3" rx="7" ry="2" fill="#bfe3ec"/><ellipse cx="6" cy="3" rx="7" ry="2" fill="#bfe3ec"/><circle cx="0" cy="0" r="2.5" fill="#3f7fa0"/></g>
    <g fill="#eaf7fb" opacity=".8"><circle class="bubble" cx="150" cy="150" r="3"/><circle class="bubble" cx="158" cy="160" r="2.2" style="animation-delay:-1.6s"/><circle class="bubble" cx="250" cy="170" r="2.6" style="animation-delay:-2.6s"/></g>

    ${preyArrow(active)}

    <!-- ① 生產者：水草、藻類、浮萍 -->
    ${glow(active, "algae", 70, 168, 52, 40)}
    <g class="fc-creature" data-jump="algae" tabindex="0" role="button" aria-label="生產者：水草與藻類" opacity="${dim(active, "algae")}">
      <g class="water-plant" stroke="#3c8d4e" stroke-width="3.5" fill="none">
        <path d="M60 225 C52 196 66 176 60 150 C57 138 63 132 61 124"/>
        <path d="M80 225 C88 198 76 178 82 152 C85 140 79 134 81 128"/>
        <path d="M98 225 C92 200 104 184 98 162"/>
      </g>
      <g stroke="#62ba70" stroke-width="2" stroke-linecap="round" class="water-plant">
        <path d="M60 196 l-9 -5 M60 196 l9 -5 M60 172 l-9 -5 M60 172 l9 -5 M82 198 l-9 -5 M82 198 l9 -5 M82 176 l-9 -5 M82 176 l9 -5"/>
      </g>
      <g fill="#5cb56b"><circle cx="108" cy="150" r="4"/><circle cx="118" cy="158" r="3"/><circle cx="100" cy="162" r="3"/></g>
      <g fill="#56b568"><ellipse cx="150" cy="62" rx="9" ry="4"/><ellipse cx="166" cy="62" rx="7" ry="3.5"/></g>
    </g>

    <!-- ② 初級消費者：小魚群、蝌蚪、水蝦、水生昆蟲 -->
    ${glow(active, "smallfish", 150, 150, 56, 34)}
    <g class="fc-creature" data-jump="smallfish" tabindex="0" role="button" aria-label="初級消費者：小魚、蝌蚪、水蝦與水生昆蟲" opacity="${dim(active, "smallfish")}">
      <g class="swim">
        <g transform="translate(132,144)" fill="#e08c3e"><path d="M0 0 q11 -6 22 0 q-11 6 -22 0Z"/><path d="M22 0 l7 -4 v8Z"/><circle cx="5" cy="-1" r="1.4" fill="#222"/></g>
        <g transform="translate(150,158)" fill="#eaa45c"><path d="M0 0 q9 -5 18 0 q-9 5 -18 0Z"/><path d="M18 0 l6 -3 v6Z"/><circle cx="4" cy="-1" r="1.2" fill="#222"/></g>
        <g transform="translate(168,150)" fill="#e08c3e"><path d="M0 0 q10 -5 20 0 q-10 5 -20 0Z"/><path d="M20 0 l6 -4 v8Z"/><circle cx="5" cy="-1" r="1.3" fill="#222"/></g>
      </g>
      <!-- 蝌蚪 -->
      <g transform="translate(110,178)" fill="#3b3b3b"><ellipse cx="0" cy="0" rx="6" ry="4"/><path class="wiggle" d="M6 0 q8 -3 12 0 q-8 3 -12 0Z"/></g>
      <!-- 水蝦 -->
      <g transform="translate(196,196)" fill="#d98b6a" class="wiggle"><path d="M0 0 q-10 -4 -16 2 q8 6 16 -2Z"/><path d="M0 0 q3 -5 8 -4" stroke="#d98b6a" stroke-width="1.5" fill="none"/></g>
      <!-- 水黽（水面昆蟲） -->
      <g transform="translate(230,61)" stroke="#5a5048" stroke-width="1.5"><line x1="0" y1="0" x2="-8" y2="6"/><line x1="0" y1="0" x2="8" y2="6"/><line x1="0" y1="0" x2="-6" y2="-4"/><line x1="0" y1="0" x2="6" y2="-4"/><ellipse cx="0" cy="0" rx="4" ry="2" fill="#5a5048"/></g>
    </g>

    <!-- ③ 次級消費者：大魚 -->
    ${glow(active, "bigfish", 262, 150, 44, 28)}
    <g class="fc-creature" data-jump="bigfish" tabindex="0" role="button" aria-label="次級消費者：大魚" opacity="${dim(active, "bigfish")}">
      <g class="swim" style="animation-delay:-2s">
        <path d="M226 150 q34 -22 66 0 q-34 22 -66 0Z" fill="#3f7fa0"/>
        <path d="M292 150 l18 -12 v24 Z" fill="#356d8c"/>
        <path d="M252 132 q8 -12 18 -4 l-14 6 Z" fill="#356d8c"/>
        <path d="M250 158 q6 12 -6 16 q-3 -12 6 -16Z" fill="#356d8c"/>
        <circle cx="244" cy="146" r="3.4" fill="#fff"/><circle cx="244" cy="146" r="1.8" fill="#111"/>
      </g>
    </g>

    <!-- ④ 高級消費者：水鳥（蒼鷺，涉水站立） -->
    ${glow(active, "bird", 320, 110, 34, 44)}
    <g class="fc-creature" data-jump="bird" tabindex="0" role="button" aria-label="高級消費者：水鳥蒼鷺" opacity="${dim(active, "bird")}">
      <line x1="312" y1="150" x2="310" y2="222" stroke="#7a8a86" stroke-width="3"/>
      <line x1="326" y1="150" x2="330" y2="222" stroke="#7a8a86" stroke-width="3"/>
      <ellipse cx="320" cy="138" rx="26" ry="13" fill="#9aa6a2"/>
      <path d="M338 132 q4 -34 -6 -44" stroke="#9aa6a2" stroke-width="7" fill="none"/>
      <circle cx="332" cy="86" r="7" fill="#9aa6a2"/>
      <path d="M338 86 l26 3 -26 4 Z" fill="#e0a23a"/>
      <path d="M324 84 q-12 -4 -20 2" stroke="#6f7c78" stroke-width="2" fill="none"/>
      <circle cx="335" cy="84" r="1.6" fill="#222"/>
      <path d="M300 138 q22 -6 40 0 q-20 10 -40 0Z" fill="#8794905c"/>
    </g>`;
}

export function buildFoodChainLayers() {
  const L = (key) =>
    `<g class="stage-layer" data-stage="${key}" ${key === "algae" ? "" : "hidden"}>${pondScene(key)}</g>`;
  const layers = L("algae") + L("smallfish") + L("bigfish") + L("bird");
  return `<svg viewBox="0 0 400 240" role="img" aria-label="池塘食物鏈動畫">${layers}</svg>`;
}

export function showFoodChainStage(svgRoot, stageKey) {
  svgRoot.querySelectorAll(".stage-layer").forEach((g) => {
    if (g.dataset.stage === stageKey) g.removeAttribute("hidden");
    else g.setAttribute("hidden", "");
  });
}

/* ---------- 水質前後切換（cherish.html）：生物多樣性對照 ---------- */
export function buildCompareSVG() {
  const clean = `
  <g class="compare-stage" data-state="clean">
    <rect x="0" y="0" width="400" height="70" fill="#dff1f7"/>
    <rect x="0" y="70" width="400" height="140" fill="#7fcfe0"/>
    <rect x="0" y="160" width="400" height="50" fill="#69c0d4"/>
    <rect x="0" y="210" width="400" height="30" fill="#caa472"/>
    <line x1="0" y1="70" x2="400" y2="70" stroke="#a7dde9" stroke-width="2"/>
    <circle cx="40" cy="34" r="14" fill="#ffe48a"/>
    <!-- 水生植物 -->
    <g class="water-plant" stroke="#3c8d4e" stroke-width="3" fill="none"><path d="M34 210 C28 184 40 168 34 150"/><path d="M48 210 C54 186 44 170 50 154"/></g>
    <g class="water-plant" stroke="#3c8d4e" stroke-width="3" fill="none"><path d="M366 210 C372 184 360 168 366 150"/><path d="M352 210 C346 188 356 172 350 156"/></g>
    <!-- 荷葉 + 蘆葦 -->
    <path d="M150 70 a20 6 0 1 0 40 0 l-18 0 z" fill="#5cb56b"/>
    <g stroke="#6b8f3a" stroke-width="3" fill="none"><path d="M22 210 C18 176 28 150 24 126"/></g>
    <ellipse cx="24" cy="124" rx="3" ry="7" fill="#8a6d3b"/>
    <!-- 蜻蜓 -->
    <g class="fly" transform="translate(300,34)"><line x1="0" y1="0" x2="16" y2="0" stroke="#3f7fa0" stroke-width="2"/><ellipse cx="6" cy="-3" rx="7" ry="2" fill="#bfe3ec"/><ellipse cx="6" cy="3" rx="7" ry="2" fill="#bfe3ec"/><circle cx="0" cy="0" r="2.5" fill="#3f7fa0"/></g>
    <!-- 多樣魚群 -->
    <g class="swim"><g transform="translate(120,128)" fill="#e08c3e"><path d="M0 0 q16 -9 32 0 q-16 9 -32 0Z"/><path d="M32 0 l8 -5 v10Z"/><circle cx="7" cy="-1" r="1.8" fill="#222"/></g></g>
    <g class="swim" style="animation-delay:-2s"><g transform="translate(244,150)" fill="#3f7fa0"><path d="M0 0 q20 -12 40 0 q-20 12 -40 0Z"/><path d="M40 0 l10 -6 v12Z"/><circle cx="9" cy="-1" r="2" fill="#fff"/><circle cx="9" cy="-1" r="1" fill="#111"/></g></g>
    <g class="swim" style="animation-delay:-1s"><g transform="translate(300,110)" fill="#d6694f"><path d="M0 0 q11 -6 22 0 q-11 6 -22 0Z"/><path d="M22 0 l6 -4 v8Z"/></g></g>
    <!-- 蝌蚪 + 蝦 -->
    <g transform="translate(90,186)" fill="#3b3b3b"><ellipse cx="0" cy="0" rx="6" ry="4"/><path class="wiggle" d="M6 0 q8 -3 12 0 q-8 3 -12 0Z"/></g>
    <g transform="translate(210,196)" fill="#d98b6a" class="wiggle"><path d="M0 0 q-10 -4 -16 2 q8 6 16 -2Z"/></g>
    <!-- 青蛙在荷葉上 -->
    <g transform="translate(160,64)" fill="#6bb46f"><ellipse cx="0" cy="0" rx="9" ry="6"/><circle cx="-4" cy="-5" r="2.5"/><circle cx="4" cy="-5" r="2.5"/><circle cx="-4" cy="-5" r="1" fill="#111"/><circle cx="4" cy="-5" r="1" fill="#111"/></g>
    <!-- 水鳥 -->
    <g transform="translate(348,150)"><line x1="0" y1="0" x2="-2" y2="60" stroke="#7a8a86" stroke-width="2.5"/><line x1="10" y1="0" x2="12" y2="60" stroke="#7a8a86" stroke-width="2.5"/><ellipse cx="5" cy="-10" rx="18" ry="9" fill="#9aa6a2"/><path d="M18 -16 q3 -22 -5 -28" stroke="#9aa6a2" stroke-width="5" fill="none"/><circle cx="14" cy="-40" r="5" fill="#9aa6a2"/><path d="M19 -40 l16 2 -16 3 Z" fill="#e0a23a"/></g>
    <text x="200" y="40" text-anchor="middle" font-size="15" fill="#156b7a" font-weight="700">清澈、生物多又多樣</text>
  </g>`;
  const dirty = `
  <g class="compare-stage" data-state="dirty" hidden>
    <rect x="0" y="0" width="400" height="70" fill="#ded9c4"/>
    <rect x="0" y="70" width="400" height="140" fill="#8f9162"/>
    <rect x="0" y="160" width="400" height="50" fill="#7c7d52"/>
    <rect x="0" y="210" width="400" height="30" fill="#6e5d3e"/>
    <line x1="0" y1="70" x2="400" y2="70" stroke="#9a9a72" stroke-width="2"/>
    <!-- 油污 -->
    <ellipse cx="200" cy="74" rx="120" ry="8" fill="#5b5a3a" opacity=".5"/>
    <!-- 大量垃圾 -->
    <rect x="48" y="78" width="22" height="14" rx="2" fill="#b94b3a" transform="rotate(12 59 85)"/>
    <rect x="250" y="80" width="16" height="20" rx="3" fill="#3f7fa0" opacity=".85" transform="rotate(-10 258 90)"/>
    <ellipse cx="120" cy="120" rx="14" ry="6" fill="#cfd2c0" opacity=".85"/>
    <text x="120" y="123" text-anchor="middle" font-size="8" fill="#777">塑膠袋</text>
    <circle cx="320" cy="92" r="8" fill="#555"/>
    <rect x="170" y="150" width="24" height="10" rx="2" fill="#9a5a3a" transform="rotate(8 182 155)"/>
    <path d="M70 150 l10 4 -3 9 -10 -4 Z" fill="#7a7a55"/>
    <circle cx="300" cy="170" r="6" fill="#444"/>
    <rect x="220" y="120" width="10" height="14" rx="2" fill="#b9a23a" transform="rotate(20 225 127)"/>
    <path d="M40 188 q8 -6 16 0 t16 0" stroke="#5b5a3a" stroke-width="2" fill="none"/>
    <!-- 廢水管排放 -->
    <rect x="0" y="96" width="30" height="14" fill="#777"/>
    <path d="M30 103 q16 4 30 14" stroke="#6b6a3a" stroke-width="5" fill="none" opacity=".7"/>
    <!-- 翻肚死魚 -->
    <g transform="translate(150,150)"><path d="M0 0 q16 -9 32 0 q-16 9 -32 0Z" fill="#cfc9b0"/><path d="M32 0 l8 -5 v10Z" fill="#b3ad94"/><path d="M14 -3 l4 4 M18 -3 l-4 4" stroke="#777" stroke-width="1.5"/></g>
    <g transform="translate(248,182)"><path d="M0 0 q11 -6 22 0 q-11 6 -22 0Z" fill="#c4bfa6"/><path d="M22 0 l6 -4 v8Z" fill="#aaa488"/></g>
    <text x="200" y="44" text-anchor="middle" font-size="15" fill="#5a4d2a" font-weight="700">混濁、垃圾多、生物大量死亡</text>
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

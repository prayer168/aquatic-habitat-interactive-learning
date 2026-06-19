/* 闖關大挑戰：載入 data/quiz.json，作答、計分、回饋、重玩 */
import { initChrome } from "./chrome.js";
import { setQuizBest } from "./progress.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

let QUIZ = null;
let answers = {};      // id -> 使用者答案
let submitted = false;

async function getJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("載入失敗：" + path);
  return res.json();
}

function renderQuestion(q, n) {
  let body = "";
  if (q.type === "single" || q.type === "tf") {
    body = `<div class="q-options">` + q.options.map((opt, i) =>
      `<label class="q-opt"><input type="radio" name="q${q.id}" value="${i}"> <span>${opt}</span></label>`
    ).join("") + `</div>`;
  } else if (q.type === "order") {
    body = `<p class="muted">用 ▲▼ 把順序排好：</p><ol class="q-order" id="order-${q.id}">` +
      q.items.map((it, i) => `<li data-orig="${i}">
        <span class="q-order-text">${it}</span>
        <span class="q-order-btns">
          <button type="button" class="btn secondary q-up" aria-label="上移">▲</button>
          <button type="button" class="btn secondary q-down" aria-label="下移">▼</button>
        </span></li>`).join("") + `</ol>`;
  }
  return `<div class="card q-card" data-qid="${q.id}">
    <div class="q-head"><span class="q-num">第 ${n} 關</span><span class="tag">${q.level}</span></div>
    <p class="q-stem">${q.stem}</p>
    ${body}
    <div class="q-feedback" hidden></div>
  </div>`;
}

function renderAll() {
  $("#quiz-title").textContent = QUIZ.title;
  $("#quiz-list").innerHTML = QUIZ.questions.map((q, i) => renderQuestion(q, i + 1)).join("");

  // 排序題按鈕
  $$(".q-order").forEach((ol) => {
    ol.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      if (e.target.classList.contains("q-up") && li.previousElementSibling)
        ol.insertBefore(li, li.previousElementSibling);
      if (e.target.classList.contains("q-down") && li.nextElementSibling)
        ol.insertBefore(li.nextElementSibling, li);
    });
  });
}

function collect() {
  QUIZ.questions.forEach((q) => {
    if (q.type === "order") {
      answers[q.id] = $$(`#order-${q.id} li`).map((li) => +li.dataset.orig);
    } else {
      const sel = $(`input[name="q${q.id}"]:checked`);
      answers[q.id] = sel ? +sel.value : null;
    }
  });
}

function isCorrect(q) {
  const a = answers[q.id];
  if (q.type === "order") {
    if (!Array.isArray(a) || a.length !== q.answer.length) return false;
    return a.every((v, i) => v === q.answer[i]);
  }
  return a === q.answer;
}

function grade() {
  collect();
  // 檢查是否全部作答
  const unanswered = QUIZ.questions.filter((q) => answers[q.id] === null);
  if (unanswered.length && !submitted) {
    $("#quiz-warn").textContent = `還有 ${unanswered.length} 題沒作答，全部作答後再交卷會更準確喔！（仍可直接交卷）`;
    $("#quiz-warn").hidden = false;
  }
  submitted = true;
  let score = 0;
  QUIZ.questions.forEach((q) => {
    const card = $(`.q-card[data-qid="${q.id}"]`);
    const fb = $(".q-feedback", card);
    const ok = isCorrect(q);
    if (ok) score++;
    fb.hidden = false;
    fb.className = "q-feedback feedback " + (ok ? "ok" : "no");
    const ansText = q.type === "order"
      ? q.answer.map((i) => q.items[i]).join(" → ")
      : q.options[q.answer];
    fb.innerHTML = `${ok ? "✅ 答對了！" : "❌ 再加油！"} <strong>正確答案：</strong>${ansText}<br>${q.explain}
      <br><a href="${q.review}">↩ 回看相關教材</a>`;
  });

  const total = QUIZ.questions.length;
  setQuizBest(score, total);
  const pass = score >= QUIZ.passScore;
  const advice = pass
    ? "太棒了！你已經掌握水域環境的重點，可以到自主學習延伸探索。"
    : "別氣餒！點各題的『回看相關教材』複習後，再挑戰一次吧。";
  const res = $("#quiz-result");
  res.hidden = false;
  res.className = "card center";
  res.innerHTML = `<h2>${pass ? "🏆 闖關成功！" : "💪 再接再厲"}</h2>
    <p style="font-size:1.4rem"><strong>${score} / ${total}</strong> 題</p>
    <p>${advice}</p>
    <button type="button" class="btn accent" id="quiz-retry">🔄 重新挑戰</button>`;
  res.scrollIntoView({ behavior: "smooth", block: "center" });
  $("#quiz-retry").addEventListener("click", reset);
}

function reset() {
  submitted = false; answers = {};
  $("#quiz-warn").hidden = true;
  $("#quiz-result").hidden = true;
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function main() {
  initChrome();
  try {
    QUIZ = await getJSON("data/quiz.json");
    renderAll();
    $("#quiz-submit").addEventListener("click", grade);
  } catch (e) {
    console.error(e);
    $("#quiz-list").innerHTML = `<p class="feedback no">題庫載入失敗，請以本機伺服器或 GitHub Pages 開啟。</p>`;
  }
}

document.addEventListener("DOMContentLoaded", main);

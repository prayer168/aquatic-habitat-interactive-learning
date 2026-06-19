/* 跨頁面學習進度（localStorage） */
const PKEY = "aquatic-habitat-progress-v1";

// 計入進度的學習頁面（不含首頁本身與自主學習）
export const LEARN_PAGES = ["know", "plants", "animals", "cherish", "quiz"];

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PKEY)) || { visited: [], quizBest: null };
  } catch (e) {
    return { visited: [], quizBest: null };
  }
}

export function saveProgress(p) {
  try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) { /* 忽略 */ }
}

export function markVisited(page) {
  if (!LEARN_PAGES.includes(page)) return;
  const p = loadProgress();
  if (!p.visited.includes(page)) {
    p.visited.push(page);
    saveProgress(p);
  }
}

export function setQuizBest(score, total) {
  const p = loadProgress();
  if (!p.quizBest || score > p.quizBest.score) {
    p.quizBest = { score, total };
    saveProgress(p);
  }
}

export function getPercent() {
  const p = loadProgress();
  const done = LEARN_PAGES.filter((pg) => p.visited.includes(pg)).length;
  return Math.round((done / LEARN_PAGES.length) * 100);
}

export function resetProgress() {
  saveProgress({ visited: [], quizBest: null });
}

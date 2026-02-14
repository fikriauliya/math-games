import { generateQuestion, checkAnswer, getResultText, TOTAL, type TargetQuestion } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'math-target';
let _analyticsStartTime = 0;
let current: TargetQuestion;
let selected: boolean[];
let score = 0, round = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  current = generateQuestion(round);
  selected = new Array(current.numbers.length).fill(false);
  document.getElementById('target-num')!.textContent = String(current.target);
  document.getElementById('round-info')!.textContent = `${round + 1} / ${TOTAL}`;
  document.getElementById('score-display')!.textContent = `⭐ ${score}`;
  document.getElementById('current-sum')!.textContent = 'Sum: 0';
  renderNumbers();
}

function renderNumbers() {
  const container = document.getElementById('numbers')!;
  container.innerHTML = '';
  current.numbers.forEach((n, i) => {
    const btn = document.createElement('button');
    btn.className = 'num-btn' + (selected[i] ? ' selected' : '');
    btn.textContent = String(n);
    btn.onclick = () => { selected[i] = !selected[i]; playClick(); renderNumbers(); updateSum(); };
    container.appendChild(btn);
  });
}

function updateSum() {
  const sum = current.numbers.filter((_, i) => selected[i]).reduce((a, b) => a + b, 0);
  document.getElementById('current-sum')!.textContent = `Sum: ${sum}`;
}

function submitAnswer() {
  const sel = current.numbers.filter((_, i) => selected[i]);
  const correct = checkAnswer(sel, current.target);
  if (correct) { score++; playCorrect(); }
  else { playWrong(); }

  document.getElementById('feedback')!.textContent = correct ? '🎯 Hit!' : '✗ Miss!';
  document.getElementById('feedback')!.className = 'feedback ' + (correct ? 'correct' : 'wrong');
  setTimeout(() => {
    document.getElementById('feedback')!.textContent = '';
    round++; nextRound();
  }, correct ? 800 : 1200);
}

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${TOTAL}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}
initMuteButton();
(window as any).startGame = startGame;
(window as any).submitAnswer = submitAnswer;

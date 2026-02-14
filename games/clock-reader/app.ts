import { generateQuestion, checkAnswer, getResultText, TOTAL, DIFFICULTY_SCHEDULE, type ClockQuestion } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'clock-reader';
let _analyticsStartTime = 0;
let current: ClockQuestion;
let score = 0;
let round = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function drawClock(h: number, m: number) {
  const canvas = document.getElementById('clock-canvas') as HTMLCanvasElement;
  const size = Math.min(280, window.innerWidth - 40);
  canvas.width = size; canvas.height = size;
  const c = canvas.getContext('2d')!;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10;

  // Face
  c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fillStyle = '#fdf6e3'; c.fill();
  c.strokeStyle = '#8b6914'; c.lineWidth = 4; c.stroke();

  // Numbers
  c.fillStyle = '#5c4a1e'; c.font = `bold ${r * 0.18}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) {
    const a = (i * Math.PI / 6) - Math.PI / 2;
    c.fillText(String(i), cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78);
  }

  // Tick marks
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI / 30) - Math.PI / 2;
    const inner = i % 5 === 0 ? r * 0.88 : r * 0.92;
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    c.lineTo(cx + Math.cos(a) * r * 0.96, cy + Math.sin(a) * r * 0.96);
    c.strokeStyle = '#8b6914'; c.lineWidth = i % 5 === 0 ? 2 : 1; c.stroke();
  }

  // Hour hand
  const ha = ((h % 12) + m / 60) * Math.PI / 6 - Math.PI / 2;
  c.beginPath(); c.moveTo(cx, cy);
  c.lineTo(cx + Math.cos(ha) * r * 0.5, cy + Math.sin(ha) * r * 0.5);
  c.strokeStyle = '#3e2c0a'; c.lineWidth = 6; c.lineCap = 'round'; c.stroke();

  // Minute hand
  const ma = m * Math.PI / 30 - Math.PI / 2;
  c.beginPath(); c.moveTo(cx, cy);
  c.lineTo(cx + Math.cos(ma) * r * 0.7, cy + Math.sin(ma) * r * 0.7);
  c.strokeStyle = '#6b4e1a'; c.lineWidth = 3; c.lineCap = 'round'; c.stroke();

  // Center dot
  c.beginPath(); c.arc(cx, cy, 5, 0, Math.PI * 2);
  c.fillStyle = '#3e2c0a'; c.fill();
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  const diff = DIFFICULTY_SCHEDULE[round];
  current = generateQuestion(diff);
  drawClock(current.hour, current.minute);
  document.getElementById('round-info')!.textContent = `${round + 1} / ${TOTAL}`;
  document.getElementById('score-display')!.textContent = `⭐ ${score}`;

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt;
    btn.onclick = () => pick(btn, opt);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: string) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.display);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) { score++; playCorrect(); }
  else {
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (b.textContent === current.display) b.classList.add('correct');
    });
  }
  setTimeout(() => { round++; nextRound(); }, correct ? 800 : 1500);
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
    el.textContent = '🎉 REKOR BARU!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Skor terbaik: ${best}/${TOTAL}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}
initMuteButton();
(window as any).startGame = startGame;

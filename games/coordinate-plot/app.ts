import { genQuestion, checkAnswer, getGrade, type Question } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'coordinate-plot';
let _startTime = 0;
let state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: 10, currentQ: null as Question | null };

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: parseInt((document.getElementById('qcount') as HTMLSelectElement).value), currentQ: null };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  drawGrid();
  nextQ();
}

function drawGrid() {
  const canvas = document.getElementById('grid-canvas') as HTMLCanvasElement;
  const size = Math.min(window.innerWidth - 40, 350);
  canvas.width = size; canvas.height = size;
  renderGrid(canvas);
}

function renderGrid(canvas: HTMLCanvasElement, highlight?: { x: number; y: number; correct: boolean }) {
  const ctx = canvas.getContext('2d')!;
  const s = canvas.width;
  const cell = s / 11;
  ctx.clearRect(0, 0, s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, s, s);

  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath(); ctx.moveTo(cell + i * cell, cell); ctx.lineTo(cell + i * cell, s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cell, cell + i * cell); ctx.lineTo(s, cell + i * cell); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = `${cell * 0.5}px Nunito`; ctx.textAlign = 'center';
  for (let i = 0; i <= 9; i++) {
    ctx.fillText(String(i), cell * 1.5 + i * cell, cell * 0.7);
    ctx.fillText(String(i), cell * 0.5, s - i * cell - cell * 0.3);
  }

  if (highlight) {
    ctx.fillStyle = highlight.correct ? '#4caf50' : '#f44336';
    ctx.beginPath();
    ctx.arc(cell * 1.5 + highlight.x * cell, s - cell - highlight.y * cell, cell * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

function nextQ() {
  if (state.qIdx >= state.total) return endGame();
  const q = genQuestion();
  state.currentQ = q;
  document.getElementById('q-text')!.textContent = q.text;
  document.getElementById('left')!.textContent = String(state.total - state.qIdx);
  const canvas = document.getElementById('grid-canvas') as HTMLCanvasElement;
  renderGrid(canvas);

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const cell = canvas.width / 11;
    const cx = Math.round((e.clientX - rect.left - cell * 1.5) / cell);
    const cy = Math.round((canvas.height - (e.clientY - rect.top) - cell) / cell);
    if (cx < 0 || cx > 9 || cy < 0 || cy > 9) return;
    canvas.onclick = null;
    const ok = checkAnswer(cx, cy, q.targetX, q.targetY);
    if (ok) { state.correct++; state.score += 10; playCorrect(); }
    else { state.wrong++; playWrong(); }
    renderGrid(canvas, { x: ok ? cx : q.targetX, y: ok ? cy : q.targetY, correct: ok });
    document.getElementById('score')!.textContent = String(state.score);
    state.qIdx++;
    setTimeout(nextQ, ok ? 500 : 1200);
  };
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const { grade, message } = getGrade(state.correct, state.total);
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = String(state.correct);
  document.getElementById('r-wrong')!.textContent = String(state.wrong);
  document.getElementById('r-score')!.textContent = String(state.score);
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, state.score, Date.now() - _startTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (setHighScore(GAME_ID, state.score)) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;'; document.getElementById('r-score')!.after(el); }
  if (state.correct === state.total) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `Your best: ${best}`; el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;'; document.querySelector('#start .big-btn')!.before(el); }
initMuteButton();
(window as any).startGame = startGame;

import { genQuestion, getGrade, type Question } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'fraction-compare';
let _startTime = 0;
let state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: 10, currentQ: null as Question | null };

function drawPie(canvas: HTMLCanvasElement, num: number, den: number) {
  const ctx = canvas.getContext('2d')!;
  const s = canvas.width, r = s / 2 - 10, cx = s / 2, cy = s / 2;
  ctx.clearRect(0, 0, s, s);
  // Draw full circle
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  // Draw filled portion
  ctx.fillStyle = '#ffd93d';
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (num / den) * Math.PI * 2);
  ctx.closePath(); ctx.fill();
  // Draw slices
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
  for (let i = 0; i < den; i++) {
    const angle = -Math.PI / 2 + (i / den) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.stroke();
  }
  ctx.strokeStyle = 'white'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
}

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: parseInt((document.getElementById('qcount') as HTMLSelectElement).value), currentQ: null };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextQ();
}

function nextQ() {
  if (state.qIdx >= state.total) return endGame();
  const q = genQuestion();
  state.currentQ = q;
  document.getElementById('left')!.textContent = String(state.total - state.qIdx);
  document.getElementById('frac1-label')!.textContent = `${q.frac1[0]}/${q.frac1[1]}`;
  document.getElementById('frac2-label')!.textContent = `${q.frac2[0]}/${q.frac2[1]}`;
  drawPie(document.getElementById('pie1') as HTMLCanvasElement, q.frac1[0], q.frac1[1]);
  drawPie(document.getElementById('pie2') as HTMLCanvasElement, q.frac2[0], q.frac2[1]);
  document.querySelectorAll<HTMLButtonElement>('.pick-btn').forEach(b => { b.disabled = false; b.classList.remove('correct', 'wrong'); });
}

function pick(choice: 'left' | 'right' | 'equal') {
  document.querySelectorAll<HTMLButtonElement>('.pick-btn').forEach(b => b.disabled = true);
  const ok = choice === state.currentQ!.answer;
  const btn = document.querySelector(`[data-pick="${choice}"]`) as HTMLButtonElement;
  if (ok) { btn.classList.add('correct'); state.correct++; state.score += 10; playCorrect(); }
  else { btn.classList.add('wrong'); state.wrong++; playWrong(); (document.querySelector(`[data-pick="${state.currentQ!.answer}"]`) as HTMLButtonElement).classList.add('correct'); }
  document.getElementById('score')!.textContent = String(state.score);
  state.qIdx++;
  setTimeout(nextQ, ok ? 400 : 1000);
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
(window as any).pick = pick;

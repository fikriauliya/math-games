import { genQuestion, getGrade, type Question } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'area-perimeter';
let _startTime = 0;
let state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: 10, currentQ: null as Question | null };

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: parseInt((document.getElementById('qcount') as HTMLSelectElement).value), currentQ: null };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextQ();
}

function drawShape(q: Question) {
  const canvas = document.getElementById('shape-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scale = Math.min(200 / q.width, 150 / q.height, 25);
  const w = q.width * scale, h = q.height * scale;
  const x = (canvas.width - w) / 2, y = (canvas.height - h) / 2;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  if (q.shape === 'rectangle') {
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#fff'; ctx.font = '14px Nunito'; ctx.textAlign = 'center';
    ctx.fillText(String(q.width), x + w / 2, y + h + 20);
    ctx.save(); ctx.translate(x - 10, y + h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(String(q.height), 0, 0); ctx.restore();
  } else {
    ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '14px Nunito'; ctx.textAlign = 'center';
    ctx.fillText(String(q.width), x + w / 2, y + h + 20);
    ctx.save(); ctx.translate(x - 10, y + h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(String(q.height), 0, 0); ctx.restore();
  }
}

function nextQ() {
  if (state.qIdx >= state.total) return endGame();
  const q = genQuestion();
  state.currentQ = q;
  document.getElementById('q-text')!.textContent = q.text;
  document.getElementById('left')!.textContent = String(state.total - state.qIdx);
  drawShape(q);
  const div = document.getElementById('choices')!;
  div.innerHTML = '';
  q.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(c);
    btn.onclick = () => answer(c, btn);
    div.appendChild(btn);
  });
}

function answer(val: number, btn: HTMLButtonElement) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  if (val === state.currentQ!.answer) {
    btn.classList.add('correct'); state.correct++; state.score += 10; playCorrect();
  } else {
    btn.classList.add('wrong'); state.wrong++; playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (parseFloat(b.textContent!) === state.currentQ!.answer) b.classList.add('correct'); });
  }
  document.getElementById('score')!.textContent = String(state.score);
  state.qIdx++;
  setTimeout(nextQ, val === state.currentQ!.answer ? 400 : 1000);
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
  if (setHighScore(GAME_ID, state.score)) {
    const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (state.correct === state.total) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `Your best: ${best}`; el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;'; document.querySelector('#start .big-btn')!.before(el); }
initMuteButton();
(window as any).startGame = startGame;

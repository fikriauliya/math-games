import { genQuestion, getGrade, type Question } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'graph-reader';
let _startTime = 0;
let state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: 10, currentQ: null as Question | null };

function drawBars(q: Question) {
  const canvas = document.getElementById('chart') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maxVal = Math.max(...q.bars.map(b => b.value));
  const barW = (canvas.width - 40) / q.bars.length;
  const chartH = canvas.height - 40;
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6', '#e67e22', '#1abc9c'];
  q.bars.forEach((b, i) => {
    const h = (b.value / maxVal) * chartH * 0.85;
    const x = 30 + i * barW + barW * 0.15;
    const w = barW * 0.7;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, canvas.height - 30 - h, w, h);
    ctx.fillStyle = 'white'; ctx.font = '11px Nunito'; ctx.textAlign = 'center';
    ctx.fillText(b.label, x + w / 2, canvas.height - 12);
    ctx.fillText(String(b.value), x + w / 2, canvas.height - 35 - h);
  });
}

function startGame() {
  _startTime = Date.now(); trackGameStart(GAME_ID);
  state = { score: 0, correct: 0, wrong: 0, qIdx: 0, total: parseInt((document.getElementById('qcount') as HTMLSelectElement).value), currentQ: null };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextQ();
}

function nextQ() {
  if (state.qIdx >= state.total) return endGame();
  const q = genQuestion(); state.currentQ = q;
  document.getElementById('q-text')!.textContent = q.questionText;
  document.getElementById('left')!.textContent = String(state.total - state.qIdx);
  drawBars(q);
  const div = document.getElementById('choices')!; div.innerHTML = '';
  q.choices.forEach(c => {
    const btn = document.createElement('button'); btn.className = 'choice-btn'; btn.textContent = String(c);
    btn.onclick = () => answer(c, btn); div.appendChild(btn);
  });
}

function answer(val: number, btn: HTMLButtonElement) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const ok = val === state.currentQ!.answer;
  if (ok) { btn.classList.add('correct'); state.correct++; state.score += 10; playCorrect(); }
  else { btn.classList.add('wrong'); state.wrong++; playWrong(); document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (parseInt(b.textContent!) === state.currentQ!.answer) b.classList.add('correct'); }); }
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

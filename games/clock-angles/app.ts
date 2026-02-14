import { generateQuestion, checkAnswer, getGrade, type ClockQuestion } from './logic';
import { playCorrect, playWrong, playWin, playCombo, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'clock-angles';
let currentQ: ClockQuestion;
let score = 0, correct = 0, wrong = 0, streak = 0, qIdx = 0, total = 10;
let diff = 'medium', startTime = 0;

function drawClock(hour: number, minute: number) {
  const canvas = document.getElementById('clock') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const size = canvas.width;
  const cx = size / 2, cy = size / 2, r = size * 0.4;

  ctx.clearRect(0, 0, size, size);
  // Face
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 3; ctx.stroke();
  // Numbers
  ctx.fillStyle = 'white'; ctx.font = `${r * 0.2}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    ctx.fillText(String(i), cx + r * 0.82 * Math.cos(a), cy + r * 0.82 * Math.sin(a));
  }
  // Hour hand
  const ha = ((hour % 12) * 30 + minute * 0.5 - 90) * Math.PI / 180;
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.5 * Math.cos(ha), cy + r * 0.5 * Math.sin(ha));
  ctx.strokeStyle = '#ff6b6b'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
  // Minute hand
  const ma = (minute * 6 - 90) * Math.PI / 180;
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.75 * Math.cos(ma), cy + r * 0.75 * Math.sin(ma));
  ctx.strokeStyle = '#4d96ff'; ctx.lineWidth = 4; ctx.stroke();
  // Center dot
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill();
}

function startGame() {
  diff = (document.getElementById('diff') as HTMLSelectElement).value;
  total = parseInt((document.getElementById('qcount') as HTMLSelectElement).value);
  score = correct = wrong = streak = qIdx = 0;
  startTime = Date.now();
  trackGameStart(GAME_ID, diff);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextQ();
}

function nextQ() {
  if (qIdx >= total) return endGame();
  currentQ = generateQuestion(diff);
  const timeStr = `${currentQ.hour}:${String(currentQ.minute).padStart(2, '0')}`;
  document.getElementById('time-display')!.textContent = timeStr;
  document.getElementById('score')!.textContent = String(score);
  document.getElementById('progress')!.textContent = `${qIdx + 1}/${total}`;
  drawClock(currentQ.hour, currentQ.minute);
  const div = document.getElementById('choices')!;
  div.innerHTML = '';
  currentQ.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${c}°`;
    btn.onclick = () => answer(c, btn);
    div.appendChild(btn);
  });
}

function answer(val: number, btn: HTMLButtonElement) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  if (checkAnswer(val, currentQ.angle)) {
    btn.classList.add('correct'); correct++; streak++;
    score += 10 * Math.min(streak, 5);
    streak >= 3 ? playCombo(streak) : playCorrect();
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (b.textContent === `${currentQ.angle}°`) b.classList.add('correct'); });
    wrong++; streak = 0; playWrong();
  }
  qIdx++;
  setTimeout(nextQ, val === currentQ.angle ? 400 : 1000);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const { grade, message } = getGrade(correct, total);
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = String(correct);
  document.getElementById('r-wrong')!.textContent = String(wrong);
  document.getElementById('r-score')!.textContent = String(score);
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - startTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (setHighScore(GAME_ID, score)) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;'; document.getElementById('r-score')!.after(el); }
  if (correct === total) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `🏆 Best: ${best}`; el.style.cssText = 'font-size:1.1rem;opacity:0.7;'; document.querySelector('.big-btn')?.before(el); }
initMuteButton();
(window as any).startGame = startGame;

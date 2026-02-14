import { generateQuestion, getStars, calcScore, getGrade, TOTAL_ROUNDS, type Difficulty, type LineQuestion } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'number-line';
let question: LineQuestion;
let round = 0;
let totalStars = 0;
let diff: Difficulty = 'easy';
let currentGuess = -1;

function startGame() {
  diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  round = 0; totalStars = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) return endGame();
  question = generateQuestion(diff);
  currentGuess = -1;

  document.getElementById('round-num')!.textContent = `${round + 1}/${TOTAL_ROUNDS}`;
  document.getElementById('stars')!.textContent = `⭐ ${totalStars}`;
  document.getElementById('target-num')!.textContent = String(question.target);
  document.getElementById('marker')!.style.display = 'none';
  document.getElementById('feedback')!.textContent = '';

  renderLine();
}

function renderLine() {
  const container = document.getElementById('number-line')!;
  container.innerHTML = '';
  const { min, max, step } = question;

  const line = document.createElement('div');
  line.className = 'line-track';

  // Tick marks
  for (let v = min; v <= max; v += step) {
    const tick = document.createElement('div');
    tick.className = 'tick';
    const pct = ((v - min) / (max - min)) * 100;
    tick.style.left = `${pct}%`;

    const label = document.createElement('span');
    label.className = 'tick-label';
    label.textContent = String(v);
    tick.appendChild(label);
    line.appendChild(tick);
  }

  container.appendChild(line);

  // Click handler on the track
  const clickArea = document.createElement('div');
  clickArea.className = 'click-area';
  clickArea.addEventListener('click', (e) => {
    const rect = clickArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    currentGuess = Math.round(min + pct * (max - min));
    currentGuess = Math.max(min, Math.min(max, currentGuess));

    playClick();
    const marker = document.getElementById('marker')!;
    marker.style.display = 'flex';
    marker.style.left = `${(pct * 100)}%`;
    marker.textContent = String(currentGuess);
  });
  container.appendChild(clickArea);
}

function submitGuess() {
  if (currentGuess < 0) return;
  const stars = getStars(currentGuess, question.target, question.max);
  totalStars += stars;

  const fb = document.getElementById('feedback')!;
  if (stars === 3) {
    fb.textContent = '⭐⭐⭐ Perfect!';
    playCorrect();
  } else if (stars >= 1) {
    fb.textContent = stars === 2 ? '⭐⭐ Close!' : '⭐ Not bad!';
    playCorrect();
  } else {
    fb.textContent = `The answer was ${question.target}`;
    playWrong();
  }

  // Show correct position
  const correctPct = ((question.target - question.min) / (question.max - question.min)) * 100;
  const correct = document.createElement('div');
  correct.className = 'correct-marker';
  correct.style.left = `${correctPct}%`;
  correct.textContent = String(question.target);
  document.querySelector('.line-track')!.appendChild(correct);

  document.getElementById('stars')!.textContent = `⭐ ${totalStars}`;

  setTimeout(() => { round++; nextRound(); }, 1500);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const maxStars = TOTAL_ROUNDS * 3;
  const score = calcScore(totalStars);
  const { grade, message } = getGrade(totalStars, maxStars);

  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-stars')!.textContent = `${totalStars}/${maxStars}`;
  document.getElementById('r-score')!.textContent = String(score);

  playWin();
  setLastPlayed(GAME_ID);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (totalStars === maxStars) showConfetti();
}

document.getElementById('submit-btn')?.addEventListener('click', submitGuess);

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `Your best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('#start .big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

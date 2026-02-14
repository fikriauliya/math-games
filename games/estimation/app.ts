import { generateRound, scoreEstimation, scoreLabel, getResultText, TOTAL, type EstimationRound } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'estimation';
let _analyticsStartTime = 0;
let current: EstimationRound;
let totalScore = 0, round = 0;
const MAX_SCORE = TOTAL * 10;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  totalScore = 0; round = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  current = generateRound(round);
  document.getElementById('round-info')!.textContent = `${round + 1} / ${TOTAL}`;
  document.getElementById('score-display')!.textContent = `⭐ ${totalScore}`;
  document.getElementById('feedback')!.textContent = '';
  (document.getElementById('guess-input') as HTMLInputElement).value = '';
  (document.getElementById('guess-input') as HTMLInputElement).disabled = false;
  document.getElementById('submit-btn')!.style.display = '';
  renderJar();
}

function renderJar() {
  const jar = document.getElementById('jar')!;
  jar.innerHTML = '';
  current.dotPositions.forEach(d => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.cssText = `left:${d.x}%;top:${d.y}%;background:${d.color};`;
    jar.appendChild(dot);
  });
}

function submitGuess() {
  const input = document.getElementById('guess-input') as HTMLInputElement;
  const guess = parseInt(input.value);
  if (isNaN(guess) || guess < 0) return;
  input.disabled = true;
  document.getElementById('submit-btn')!.style.display = 'none';

  const points = scoreEstimation(guess, current.actual);
  totalScore += points;
  const label = scoreLabel(points);

  if (points >= 7) playCorrect(); else playWrong();

  document.getElementById('feedback')!.innerHTML = `${label}<br>Actual: <b>${current.actual}</b> | Your guess: <b>${guess}</b> | +${points} pts`;
  document.getElementById('score-display')!.textContent = `⭐ ${totalScore}`;

  setTimeout(() => { round++; nextRound(); }, 2000);
}

function endGame() {
  const result = getResultText(totalScore, MAX_SCORE);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, totalScore);
  if (isNew && totalScore > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (totalScore >= MAX_SCORE * 0.9) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${MAX_SCORE}`;
  el.style.cssText = 'color:rgba(0,0,0,0.5);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}
initMuteButton();
(window as any).startGame = startGame;
(window as any).submitGuess = submitGuess;

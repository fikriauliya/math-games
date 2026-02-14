import { generateRound, getExpectedPattern, checkPattern, getResultText, TOTAL_ROUNDS, type MirrorRound } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'mirror-draw';
let _analyticsStartTime = 0;
let round: number, score: number, currentRound: MirrorRound, userGrid: boolean[][];

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; score = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) return endGame();
  currentRound = generateRound(round);
  userGrid = Array.from({ length: currentRound.size }, () => Array(currentRound.size).fill(false));
  document.getElementById('round-num')!.textContent = `Round ${round + 1} / ${TOTAL_ROUNDS}`;
  document.getElementById('score-display')!.textContent = `Score: ${score}`;
  const modeLabel = currentRound.mode === 'same' ? 'Copy' : currentRound.mode === 'mirror' ? 'Mirror' : 'Rotate 90°';
  document.getElementById('mode-label')!.textContent = modeLabel;
  renderGrids();
}

function renderGrids() {
  renderGrid('pattern-grid', currentRound.pattern, currentRound.size, false);
  renderGrid('user-grid', userGrid, currentRound.size, true);
}

function renderGrid(id: string, grid: boolean[][], size: number, interactive: boolean) {
  const el = document.getElementById(id)!;
  el.innerHTML = '';
  el.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('button');
      cell.className = 'grid-cell' + (grid[r][c] ? ' active' : '');
      if (interactive) {
        cell.onclick = () => {
          userGrid[r][c] = !userGrid[r][c];
          playClick();
          renderGrids();
        };
      }
      el.appendChild(cell);
    }
  }
}

function submitAnswer() {
  const expected = getExpectedPattern(currentRound);
  const result = checkPattern(userGrid, expected);
  if (result.perfect) { score++; playCorrect(); }
  else { playWrong(); }

  // Show expected briefly
  renderGrid('user-grid', expected, currentRound.size, false);
  const feedback = document.createElement('div');
  feedback.className = result.perfect ? 'feedback correct' : 'feedback wrong';
  feedback.textContent = result.perfect ? '✓ Perfect!' : `✗ ${result.correct}/${result.total} cells correct`;
  document.getElementById('game-area')!.appendChild(feedback);

  setTimeout(() => {
    const f = document.querySelector('.feedback');
    if (f) f.remove();
    round++;
    nextRound();
  }, 1500);
}

function endGame() {
  const result = getResultText(score, TOTAL_ROUNDS);
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
  if (score === TOTAL_ROUNDS) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${TOTAL_ROUNDS}`;
  el.style.cssText = 'color:rgba(0,0,0,0.5);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).submitAnswer = submitAnswer;

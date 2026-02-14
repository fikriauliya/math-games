import { generateGrid, validateAnswer, calcScore, getGrade, getElapsedText, DIFFICULTY_CONFIG, type Difficulty, type GridCell } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'times-table';
let _analyticsStartTime = 0;

let grid: GridCell[] = [];
let blanks = 0;
let filled = 0;
let mistakes = 0;
let startTime = 0;
let timerInterval: any = null;
let diff: Difficulty = 'easy';

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  grid = generateGrid(diff);
  blanks = grid.filter(c => c.isBlank).length;
  filled = 0;
  mistakes = 0;
  startTime = Date.now();

  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');

  renderGrid();
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

function renderGrid() {
  const size = DIFFICULTY_CONFIG[diff].size;
  const container = document.getElementById('grid')!;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `60px repeat(${size}, 1fr)`;

  // Top-left corner
  const corner = document.createElement('div');
  corner.className = 'grid-header corner';
  corner.textContent = '×';
  container.appendChild(corner);

  // Column headers
  for (let c = 1; c <= size; c++) {
    const h = document.createElement('div');
    h.className = 'grid-header col-header';
    h.textContent = String(c);
    container.appendChild(h);
  }

  // Rows
  for (let r = 1; r <= size; r++) {
    const rh = document.createElement('div');
    rh.className = 'grid-header row-header';
    rh.textContent = String(r);
    container.appendChild(rh);

    for (let c = 1; c <= size; c++) {
      const cell = grid[(r - 1) * size + (c - 1)];
      const el = document.createElement('div');
      el.className = 'grid-cell' + (r % 2 === 0 ? ' even-row' : '');

      if (cell.isBlank) {
        const input = document.createElement('input');
        input.type = 'number';
        input.inputMode = 'numeric';
        input.className = 'cell-input';
        input.dataset.row = String(r);
        input.dataset.col = String(c);
        input.addEventListener('change', (e) => checkCell(input, cell));
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') checkCell(input, cell);
        });
        el.appendChild(input);
      } else {
        el.textContent = String(cell.answer);
        el.classList.add('filled');
      }

      container.appendChild(el);
    }
  }

  document.getElementById('blanks-left')!.textContent = String(blanks - filled);
}

function checkCell(input: HTMLInputElement, cell: GridCell) {
  const val = parseInt(input.value);
  if (isNaN(val)) return;

  if (validateAnswer(val, cell.answer)) {
    input.disabled = true;
    input.parentElement!.classList.add('correct');
    input.parentElement!.classList.add('filled');
    playCorrect();
    filled++;
    document.getElementById('blanks-left')!.textContent = String(blanks - filled);
    if (filled >= blanks) endGame();
  } else {
    input.parentElement!.classList.add('wrong');
    mistakes++;
    document.getElementById('mistakes')!.textContent = String(mistakes);
    playWrong();
    setTimeout(() => {
      input.parentElement!.classList.remove('wrong');
      input.value = '';
      input.focus();
    }, 600);
  }
}

function updateTimer() {
  const elapsed = Date.now() - startTime;
  document.getElementById('timer')!.textContent = getElapsedText(elapsed);
}

function endGame() {
  clearInterval(timerInterval);
  const elapsed = Date.now() - startTime;

  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');

  const score = calcScore(blanks, mistakes, elapsed);
  const { grade, message } = getGrade(mistakes, blanks);

  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-time')!.textContent = getElapsedText(elapsed);
  document.getElementById('r-mistakes')!.textContent = String(mistakes);
  document.getElementById('r-score')!.textContent = String(score);

  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (mistakes === 0) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `Your best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('#start .big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

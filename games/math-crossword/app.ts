import { getPuzzle, checkPuzzle, getResultText, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'math-crossword';
let _analyticsStartTime = 0;
let puzzle: Puzzle;
let userGrid: string[][] = [];

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)!.classList.remove('hidden');
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  puzzle = getPuzzle(0);
  userGrid = puzzle.grid.map(r => r.map(c => c === null ? '' : ''));
  show('game');
  renderGrid();
  renderClues();
}

function renderGrid() {
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;

  // Find which cells get clue numbers
  const clueNums: Record<string, number> = {};
  puzzle.clues.forEach(c => {
    const key = `${c.row},${c.col}`;
    if (!clueNums[key]) clueNums[key] = c.number;
  });

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell' + (puzzle.grid[r][c] === null ? ' black' : '');
      const key = `${r},${c}`;
      if (clueNums[key]) {
        const numLabel = document.createElement('span');
        numLabel.className = 'cell-num';
        numLabel.textContent = String(clueNums[key]);
        cell.appendChild(numLabel);
      }
      if (puzzle.grid[r][c] !== null) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.inputMode = 'numeric';
        input.pattern = '[0-9]';
        input.className = 'cell-input';
        input.dataset.row = String(r);
        input.dataset.col = String(c);
        input.oninput = (e) => {
          const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
          (e.target as HTMLInputElement).value = val;
          userGrid[r][c] = val;
          playClick();
        };
        cell.appendChild(input);
      }
      grid.appendChild(cell);
    }
  }
}

function renderClues() {
  const acrossEl = document.getElementById('clues-across')!;
  const downEl = document.getElementById('clues-down')!;
  acrossEl.innerHTML = '<strong>Across</strong>';
  downEl.innerHTML = '<strong>Down</strong>';
  puzzle.clues.forEach(c => {
    const div = document.createElement('div');
    div.className = 'clue';
    div.textContent = `${c.number}. ${c.expression}`;
    (c.direction === 'across' ? acrossEl : downEl).appendChild(div);
  });
}

function checkAnswers() {
  const result = checkPuzzle(userGrid, puzzle);
  // Highlight cells
  document.querySelectorAll<HTMLInputElement>('.cell-input').forEach(input => {
    const r = parseInt(input.dataset.row!);
    const c = parseInt(input.dataset.col!);
    if (userGrid[r][c] === puzzle.grid[r][c]) {
      input.classList.add('correct');
    } else {
      input.classList.add('wrong');
    }
  });

  if (result.correct === result.total) {
    playCorrect();
    setTimeout(() => endGame(result.correct, result.total), 800);
  } else {
    playWrong();
  }
}

function endGame(correct: number, total: number) {
  const result = getResultText(correct, total);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, correct, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  const isNew = setHighScore(GAME_ID, correct);
  if (isNew && correct > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 PERFECT!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (correct === total) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).checkAnswers = checkAnswers;

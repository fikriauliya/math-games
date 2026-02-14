import { getPuzzle, getPuzzleCount, createEmptyGrid, checkCell, checkComplete, countCorrect, totalLetters, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'crossword-mini';
let _startTime = 0;
let puzzle: Puzzle;
let userGrid: (string | null)[][];
let puzzleIndex = 0;
let selectedCell: { r: number; c: number } | null = null;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  puzzleIndex = Math.floor(Math.random() * getPuzzleCount());
  puzzle = getPuzzle(puzzleIndex);
  userGrid = createEmptyGrid(puzzle);
  selectedCell = null;
  show('game-screen');
  renderGrid();
  renderClues();
}

function renderGrid() {
  const board = document.getElementById('board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (puzzle.grid[r][c] === null) {
        cell.classList.add('black');
      } else {
        cell.textContent = userGrid[r][c] || '';
        if (selectedCell && selectedCell.r === r && selectedCell.c === c) cell.classList.add('selected');
        cell.onclick = () => { selectedCell = { r, c }; playClick(); renderGrid(); };
      }
      board.appendChild(cell);
    }
  }
}

function renderClues() {
  const list = document.getElementById('clues')!;
  list.innerHTML = '';
  const across = puzzle.clues.filter(c => c.direction === 'across');
  const down = puzzle.clues.filter(c => c.direction === 'down');
  if (across.length) {
    const h = document.createElement('div'); h.className = 'clue-header'; h.textContent = 'Across →'; list.appendChild(h);
    across.forEach(cl => { const d = document.createElement('div'); d.className = 'clue-item'; d.textContent = `${cl.id}. ${cl.clue}`; list.appendChild(d); });
  }
  if (down.length) {
    const h = document.createElement('div'); h.className = 'clue-header'; h.textContent = 'Down ↓'; list.appendChild(h);
    down.forEach(cl => { const d = document.createElement('div'); d.className = 'clue-item'; d.textContent = `${cl.id}. ${cl.clue}`; list.appendChild(d); });
  }
}

function handleKey(e: KeyboardEvent) {
  if (!selectedCell) return;
  const { r, c } = selectedCell;
  if (puzzle.grid[r][c] === null) return;
  const key = e.key.toUpperCase();
  if (key === 'BACKSPACE') {
    userGrid[r][c] = '';
    playClick();
    renderGrid();
    return;
  }
  if (key.length === 1 && key >= 'A' && key <= 'Z') {
    userGrid[r][c] = key;
    if (checkCell(puzzle, r, c, key)) playCorrect(); else playWrong();
    renderGrid();
    if (checkComplete(puzzle, userGrid)) {
      playWin();
      showConfetti();
      setLastPlayed(GAME_ID);
      const elapsed = Date.now() - _startTime;
      const score = totalLetters(puzzle);
      const best = getHighScore(GAME_ID);
      if (!best || score > best) setHighScore(GAME_ID, score);
      trackGameEnd(GAME_ID, score, elapsed, true);
      setTimeout(() => {
        document.getElementById('result-emoji')!.textContent = '🏆';
        document.getElementById('result-title')!.textContent = 'Puzzle Complete!';
        document.getElementById('result-sub')!.textContent = `Solved in ${Math.round(elapsed / 1000)}s`;
        show('result-screen');
        createRatingUI(GAME_ID, document.getElementById('result-screen')!);
      }, 1500);
    } else {
      // Move to next cell
      let nc = c + 1;
      while (nc < puzzle.size && puzzle.grid[r][nc] === null) nc++;
      if (nc < puzzle.size) selectedCell = { r, c: nc };
    }
    renderGrid();
  }
}

document.addEventListener('keydown', handleKey);
initMuteButton();
(window as any).startGame = startGame;

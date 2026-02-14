import { PUZZLES, checkSolution, createEmptyGrid, toggleCell, getRandomPuzzle, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'nonogram';
let _analyticsStartTime = 0;
let puzzle: Puzzle;
let playerGrid: boolean[][];
let solved = false;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  puzzle = getRandomPuzzle(PUZZLES);
  playerGrid = createEmptyGrid();
  solved = false;
  show('game-screen');
  render();
}

function render() {
  const container = document.getElementById('grid-container')!;
  container.innerHTML = '';

  // Build table with clues
  const table = document.createElement('table');
  table.className = 'nono-table';

  // Column clues header
  const maxColClue = Math.max(...puzzle.colClues.map(c => c.length));
  for (let ci = 0; ci < maxColClue; ci++) {
    const tr = document.createElement('tr');
    tr.appendChild(document.createElement('td')); // empty corner
    for (let c = 0; c < 5; c++) {
      const td = document.createElement('td');
      td.className = 'clue col-clue';
      const clue = puzzle.colClues[c];
      const idx = ci - (maxColClue - clue.length);
      td.textContent = idx >= 0 ? String(clue[idx]) : '';
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  // Rows with row clues
  for (let r = 0; r < 5; r++) {
    const tr = document.createElement('tr');
    const clueTd = document.createElement('td');
    clueTd.className = 'clue row-clue';
    clueTd.textContent = puzzle.rowClues[r].join(' ');
    tr.appendChild(clueTd);

    for (let c = 0; c < 5; c++) {
      const td = document.createElement('td');
      td.className = 'cell' + (playerGrid[r][c] ? ' filled' : '');
      if (solved && puzzle.grid[r][c]) td.classList.add('solution');
      td.onclick = () => { if (!solved) { playClick(); playerGrid = toggleCell(playerGrid, r, c); render(); } };
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  container.appendChild(table);
}

function checkPuzzle() {
  if (checkSolution(playerGrid, puzzle)) {
    solved = true;
    playWin();
    render();
    showConfetti();
    setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
    setHighScore(GAME_ID, (getHighScore(GAME_ID) || 0) + 1);
    document.getElementById('message')!.textContent = `✅ Solved! It's a ${puzzle.name}!`;
  } else {
    playWrong();
    document.getElementById('message')!.textContent = '❌ Not quite right...';
    setTimeout(() => document.getElementById('message')!.textContent = '', 1500);
  }
}

function resetGrid() {
  playerGrid = createEmptyGrid();
  solved = false;
  document.getElementById('message')!.textContent = '';
  render();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Puzzles solved: ${best}`;
  el.style.cssText = 'color:rgba(0,60,0,0.6);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}
initMuteButton();
(window as any).startGame = startGame;
(window as any).checkPuzzle = checkPuzzle;
(window as any).resetGrid = resetGrid;

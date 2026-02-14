import { getPuzzle, getPuzzleCount, setCell, checkComplete, countFilled, countTotal, type Puzzle, type InputCell, type ClueCell } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'kakuro';
let _startTime = 0;
let puzzle: Puzzle;
let selected: { r: number; c: number } | null = null;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  puzzle = getPuzzle(Math.floor(Math.random() * getPuzzleCount()));
  selected = null;
  show('game-screen');
  render();
}

function render() {
  const board = document.getElementById('board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const cell = puzzle.grid[r][c];
      const div = document.createElement('div');
      div.className = 'cell';
      if (cell.type === 'blank') {
        div.classList.add('blank');
      } else if (cell.type === 'clue') {
        div.classList.add('clue');
        const cl = cell as ClueCell;
        if (cl.across) { const s = document.createElement('span'); s.className = 'clue-across'; s.textContent = String(cl.across); div.appendChild(s); }
        if (cl.down) { const s = document.createElement('span'); s.className = 'clue-down'; s.textContent = String(cl.down); div.appendChild(s); }
      } else {
        div.classList.add('input');
        const inp = cell as InputCell;
        if (inp.value !== null) div.textContent = String(inp.value);
        if (selected && selected.r === r && selected.c === c) div.classList.add('selected');
        div.onclick = () => { selected = { r, c }; playClick(); render(); };
      }
      board.appendChild(div);
    }
  }
  document.getElementById('progress')!.textContent = `${countFilled(puzzle)} / ${countTotal(puzzle)}`;
}

function handleKey(e: KeyboardEvent) {
  if (!selected) return;
  const { r, c } = selected;
  if (e.key === 'Backspace') { puzzle = setCell(puzzle, r, c, null); playClick(); render(); return; }
  const n = parseInt(e.key);
  if (n >= 1 && n <= 9) {
    puzzle = setCell(puzzle, r, c, n);
    const ic = puzzle.grid[r][c] as InputCell;
    if (ic.value === ic.answer) playCorrect(); else playWrong();
    render();
    if (checkComplete(puzzle)) {
      playWin(); showConfetti(); setLastPlayed(GAME_ID);
      const elapsed = Date.now() - _startTime;
      trackGameEnd(GAME_ID, countTotal(puzzle), elapsed, true);
      setTimeout(() => {
        document.getElementById('result-emoji')!.textContent = '🧮';
        document.getElementById('result-title')!.textContent = 'Kakuro Solved!';
        document.getElementById('result-sub')!.textContent = `Completed in ${Math.round(elapsed / 1000)}s`;
        show('result-screen');
        createRatingUI(GAME_ID, document.getElementById('result-screen')!);
      }, 1500);
    }
  }
}

document.addEventListener('keydown', handleKey);
initMuteButton();
(window as any).startGame = startGame;

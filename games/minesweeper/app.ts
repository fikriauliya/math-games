import { DIFFICULTIES, placeMines, reveal, toggleFlag, checkWin, checkLoss, countFlags, revealAll, type Board, type GameConfig } from './logic';
import { playClick, playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'minesweeper';
let _start = 0, board: Board, config: GameConfig, firstClick = true, gameOver = false, timer: any, seconds = 0, flagMode = false, difficulty = 'easy';

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame(diff?: string) {
  if (diff) difficulty = diff;
  config = DIFFICULTIES[difficulty];
  _start = Date.now(); trackGameStart(GAME_ID, difficulty);
  firstClick = true; gameOver = false; seconds = 0; flagMode = false;
  board = Array.from({ length: config.rows }, () =>
    Array.from({ length: config.cols }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );
  clearInterval(timer);
  document.getElementById('timer')!.textContent = '⏱ 0s';
  document.getElementById('flag-btn')!.textContent = '🚩 Flag: OFF';
  const grid = document.getElementById('grid')!;
  grid.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
  show('game-screen');
  render();
}

function render() {
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  document.getElementById('mine-count')!.textContent = `💣 ${config.mines - countFlags(board)}`;
  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      const cell = board[r][c];
      const btn = document.createElement('button');
      btn.className = 'cell' + (cell.revealed ? ' revealed' : '') + (cell.flagged ? ' flagged' : '');
      if (cell.revealed) {
        if (cell.mine) btn.textContent = '💣';
        else if (cell.adjacent > 0) { btn.textContent = String(cell.adjacent); btn.dataset.num = String(cell.adjacent); }
      } else if (cell.flagged) {
        btn.textContent = '🚩';
      }
      if (!gameOver) {
        btn.onclick = () => handleClick(r, c);
        let longTimer: any;
        btn.ontouchstart = (e) => { longTimer = setTimeout(() => { e.preventDefault(); handleFlag(r, c); }, 500); };
        btn.ontouchend = () => clearTimeout(longTimer);
      }
      grid.appendChild(btn);
    }
  }
}

function handleClick(r: number, c: number) {
  if (gameOver || board[r][c].flagged) return;
  if (flagMode) { handleFlag(r, c); return; }
  if (firstClick) {
    firstClick = false;
    board = placeMines(config.rows, config.cols, config.mines, r, c);
    timer = setInterval(() => { seconds++; document.getElementById('timer')!.textContent = `⏱ ${seconds}s`; }, 1000);
  }
  board = reveal(board, r, c);
  playClick();
  if (checkLoss(board)) { gameOver = true; clearInterval(timer); board = revealAll(board); render(); playWrong(); setTimeout(() => endGame(false), 1000); return; }
  if (checkWin(board)) { gameOver = true; clearInterval(timer); render(); playCorrect(); setTimeout(() => endGame(true), 500); return; }
  render();
}

function handleFlag(r: number, c: number) {
  if (gameOver || board[r][c].revealed) return;
  board = toggleFlag(board, r, c);
  playClick();
  render();
}

function endGame(won: boolean) {
  document.getElementById('result-emoji')!.textContent = won ? '🏆' : '💥';
  document.getElementById('result-title')!.textContent = won ? 'You Win!' : 'Game Over!';
  document.getElementById('result-sub')!.textContent = won ? `Cleared in ${seconds}s` : 'Hit a mine!';
  show('result-screen');
  if (won) { playWin(); showConfetti(); }
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, won ? Math.max(0, 300 - seconds) : 0, Date.now() - _start, won);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  if (won) { const score = Math.max(0, 300 - seconds); setHighScore(GAME_ID, score); }
}

document.getElementById('flag-btn')!.onclick = () => {
  flagMode = !flagMode;
  document.getElementById('flag-btn')!.textContent = `🚩 Flag: ${flagMode ? 'ON' : 'OFF'}`;
};

initMuteButton();
(window as any).startGame = startGame;

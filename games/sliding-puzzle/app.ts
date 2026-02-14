import { GRID_SIZE, shuffleBoard, isSolved, canMove, moveTile, getDifficultyMoves, getResultText, type Board } from './logic';
import { playClick, playWin, playCorrect, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'sliding-puzzle';
let _start = 0, board: Board, moves = 0, timer: any, seconds = 0, difficulty = 'easy';

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame(diff?: string) {
  if (diff) difficulty = diff;
  _start = Date.now(); trackGameStart(GAME_ID, difficulty);
  moves = 0; seconds = 0;
  board = shuffleBoard(getDifficultyMoves(difficulty));
  show('game-screen');
  clearInterval(timer);
  timer = setInterval(() => { seconds++; document.getElementById('timer')!.textContent = `⏱ ${seconds}s`; }, 1000);
  render();
}

function render() {
  document.getElementById('moves')!.textContent = `Moves: ${moves}`;
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  board.forEach((val, i) => {
    const tile = document.createElement('button');
    tile.className = 'tile' + (val === 0 ? ' empty' : '') + (canMove(board, i) ? ' movable' : '');
    tile.textContent = val === 0 ? '' : String(val);
    if (val !== 0) tile.onclick = () => handleMove(i);
    grid.appendChild(tile);
  });
}

function handleMove(index: number) {
  if (!canMove(board, index)) return;
  board = moveTile(board, index);
  moves++;
  playClick();
  render();
  if (isSolved(board)) { clearInterval(timer); endGame(); }
}

function endGame() {
  const r = getResultText(moves, seconds);
  document.getElementById('result-emoji')!.textContent = r.emoji;
  document.getElementById('result-title')!.textContent = r.title;
  document.getElementById('result-sub')!.textContent = r.sub;
  show('result-screen'); playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, Math.max(0, 200 - moves), Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const score = Math.max(0, 200 - moves);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;'; document.getElementById('result-title')!.after(el); }
  showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;

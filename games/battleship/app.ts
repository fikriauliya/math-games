import { createBoard, fire, aiFire, isGameOver, countHits, type Board } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'battleship';
let enemyBoard: Board;
let playerBoard: Board;
let shots = 0;
let startTime = 0;
let gameActive = false;

function startGame() {
  enemyBoard = createBoard();
  playerBoard = createBoard();
  shots = 0;
  gameActive = true;
  startTime = Date.now();
  trackGameStart(GAME_ID);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('shots')!.textContent = '0';
  document.getElementById('status')!.textContent = 'Your turn — tap to fire!';
  renderBoard('enemy-grid', enemyBoard, true);
  renderBoard('player-grid', playerBoard, false);
}

function renderBoard(id: string, board: Board, clickable: boolean) {
  const grid = document.getElementById(id)!;
  grid.innerHTML = '';
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const v = board[r][c];
      if (v === 'hit') cell.classList.add('hit');
      else if (v === 'miss') cell.classList.add('miss');
      else if (v === 'ship' && !clickable) cell.classList.add('ship');
      if (clickable && gameActive) cell.onclick = () => playerFire(r, c);
      grid.appendChild(cell);
    }
  }
}

function playerFire(r: number, c: number) {
  if (!gameActive) return;
  const result = fire(enemyBoard, r, c);
  if (result.result === 'already') return;
  shots++;
  document.getElementById('shots')!.textContent = String(shots);
  result.result === 'hit' ? playCorrect() : playClick();
  document.getElementById('status')!.textContent = result.result === 'hit' ? '💥 HIT!' : '🌊 Miss...';

  if (isGameOver(enemyBoard)) { endGame(true); return; }
  renderBoard('enemy-grid', enemyBoard, true);

  // AI turn
  setTimeout(() => {
    const { r: ar, c: ac } = aiFire(playerBoard);
    fire(playerBoard, ar, ac);
    renderBoard('player-grid', playerBoard, false);
    if (isGameOver(playerBoard)) { endGame(false); return; }
    document.getElementById('status')!.textContent = 'Your turn — tap to fire!';
  }, 500);
}

function endGame(won: boolean) {
  gameActive = false;
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const score = won ? Math.max(0, 1000 - shots * 10) : 0;
  document.getElementById('grade')!.textContent = won ? '🏆' : '💀';
  document.getElementById('grade-text')!.textContent = won ? `You won in ${shots} shots!` : 'Your fleet was sunk!';
  document.getElementById('r-shots')!.textContent = String(shots);
  document.getElementById('r-score')!.textContent = String(score);
  won ? playWin() : playWrong();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - startTime, won);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (won && setHighScore(GAME_ID, score)) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;'; document.getElementById('r-score')!.after(el); }
  if (won && shots <= 40) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `🏆 Best: ${best}`; el.style.cssText = 'font-size:1.1rem;opacity:0.7;'; document.querySelector('.big-btn')?.before(el); }
initMuteButton();
(window as any).startGame = startGame;

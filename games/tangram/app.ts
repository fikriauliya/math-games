import { createPieces, rotatePiece, movePiece, getPuzzlesForDifficulty, type Piece, type Puzzle } from './logic';
import { playClick, playCorrect, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'tangram';
let _start = 0, pieces: Piece[], puzzles: Puzzle[], currentPuzzle = 0, puzzleIndex = 0, dragPiece: number | null = null, dragOffset = { x: 0, y: 0 }, difficulty = 'easy';

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame(diff?: string) {
  if (diff) difficulty = diff;
  _start = Date.now(); trackGameStart(GAME_ID, difficulty);
  puzzles = getPuzzlesForDifficulty(difficulty);
  puzzleIndex = 0;
  show('game-screen');
  loadPuzzle();
}

function loadPuzzle() {
  if (puzzleIndex >= puzzles.length) return endGame();
  pieces = createPieces();
  currentPuzzle = puzzleIndex;
  document.getElementById('puzzle-name')!.textContent = `${puzzleIndex + 1}/${puzzles.length}: ${puzzles[currentPuzzle].name}`;
  renderSilhouette();
  renderPieces();
}

function renderSilhouette() {
  const el = document.getElementById('silhouette')!;
  el.style.clipPath = puzzles[currentPuzzle].silhouette;
}

function renderPieces() {
  const container = document.getElementById('pieces-area')!;
  container.innerHTML = '';
  pieces.forEach((piece, i) => {
    const el = document.createElement('div');
    el.className = `piece ${piece.type}`;
    el.style.cssText = `left:${piece.x}px;top:${piece.y}px;transform:rotate(${piece.rotation}deg);background:${piece.color};`;
    el.onpointerdown = (e) => startDrag(e, i);
    el.ondblclick = () => { pieces[i] = rotatePiece(pieces[i]); playClick(); renderPieces(); };
    container.appendChild(el);
  });
}

function startDrag(e: PointerEvent, index: number) {
  dragPiece = index;
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  const move = (e: PointerEvent) => {
    if (dragPiece === null) return;
    const area = document.getElementById('pieces-area')!.getBoundingClientRect();
    pieces[dragPiece] = movePiece(pieces[dragPiece], e.clientX - area.left - dragOffset.x, e.clientY - area.top - dragOffset.y);
    renderPieces();
  };
  const up = () => { dragPiece = null; document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
}

function nextPuzzle() {
  puzzleIndex++;
  playCorrect();
  loadPuzzle();
}

function endGame() {
  document.getElementById('result-emoji')!.textContent = '🏆';
  document.getElementById('result-title')!.textContent = 'All Puzzles Done!';
  document.getElementById('result-sub')!.textContent = `Completed ${puzzles.length} tangram puzzles!`;
  show('result-screen'); playWin(); showConfetti(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, puzzles.length, Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
}

document.getElementById('next-btn')!.onclick = nextPuzzle;

initMuteButton();
(window as any).startGame = startGame;

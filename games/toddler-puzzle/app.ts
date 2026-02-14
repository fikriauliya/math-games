import { createPuzzle, swapPieces, isSolved, getEndResult, type PuzzlePiece, type Puzzle } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-puzzle';
let pieces: PuzzlePiece[] = [];
let puzzle: Puzzle;
let moves = 0;
let selected: number | null = null;
let startTime = 0;
const QUADRANT_EMOJIS: Record<string, string[]> = {};

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  speechSynthesis.speak(u);
}

// Each piece shows a portion represented by emoji + quadrant indicator
function getPieceLabel(piece: PuzzlePiece): string {
  const pos = ['↖️','↗️','↙️','↘️'];
  return `${puzzle.emoji}${pos[piece.id]}`;
}

(window as any).startGame = () => {
  startTime = Date.now();
  trackGameStart(GAME_ID);
  const result = createPuzzle();
  puzzle = result.puzzle;
  pieces = result.pieces;
  moves = 0;
  selected = null;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('preview')!.textContent = puzzle.emoji;
  document.getElementById('puzzle-name')!.textContent = puzzle.name;
  render();
};

function render() {
  document.getElementById('moves')!.textContent = `Langkah: ${moves}`;
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  for (let pos = 0; pos < 4; pos++) {
    const piece = pieces.find(p => p.currentPos === pos)!;
    const el = document.createElement('div');
    el.className = 'puzzle-piece' + (piece.currentPos === piece.correctPos ? ' correct' : '') + (selected === pos ? ' selected' : '');
    el.textContent = getPieceLabel(piece);
    el.onclick = () => handleClick(pos);
    grid.appendChild(el);
  }
}

function handleClick(pos: number) {
  if (selected === null) {
    selected = pos;
    render();
  } else if (selected === pos) {
    selected = null;
    render();
  } else {
    pieces = swapPieces(pieces, selected, pos);
    moves++;
    selected = null;
    playToddlerCorrect();
    render();
    if (isSolved(pieces)) {
      setTimeout(endGame, 500);
    }
  }
}

function endGame() {
  const res = getEndResult(moves);
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, Math.max(0, 20 - moves), Date.now() - startTime, true);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('result-title')!.textContent = res.title;
  document.getElementById('big-stars')!.textContent = res.stars;
  document.getElementById('result-moves')!.textContent = `${moves} langkah`;
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
  speak('Hebat! Puzzle selesai!');
}

initMuteButton();

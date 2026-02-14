import { getPuzzle, canConnect, isSolved, addBridge, type Puzzle, type Bridge, type Island } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'bridges';
let puzzle: Puzzle;
let bridges: Bridge[] = [];
let selected: number | null = null;
let _startTime = 0;

const canvas = document.getElementById('board') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const status = document.getElementById('status')!;

function cellSize() { return canvas.width / puzzle.size; }

function draw() {
  const cs = cellSize();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw bridges
  for (const b of bridges) {
    if (b.count === 0) continue;
    const a = puzzle.islands[b.from], z = puzzle.islands[b.to];
    ctx.strokeStyle = '#48cae4'; ctx.lineWidth = b.count === 2 ? 4 : 2;
    if (b.count === 2) {
      const horiz = a.row === z.row;
      const off = 3;
      ctx.beginPath();
      ctx.moveTo(a.col * cs + cs / 2 + (horiz ? 0 : -off), a.row * cs + cs / 2 + (horiz ? -off : 0));
      ctx.lineTo(z.col * cs + cs / 2 + (horiz ? 0 : -off), z.row * cs + cs / 2 + (horiz ? -off : 0));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(a.col * cs + cs / 2 + (horiz ? 0 : off), a.row * cs + cs / 2 + (horiz ? off : 0));
      ctx.lineTo(z.col * cs + cs / 2 + (horiz ? 0 : off), z.row * cs + cs / 2 + (horiz ? off : 0));
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(a.col * cs + cs / 2, a.row * cs + cs / 2);
      ctx.lineTo(z.col * cs + cs / 2, z.row * cs + cs / 2);
      ctx.stroke();
    }
  }
  // Draw islands
  puzzle.islands.forEach((isle, i) => {
    const x = isle.col * cs + cs / 2, y = isle.row * cs + cs / 2;
    ctx.beginPath(); ctx.arc(x, y, cs * 0.35, 0, Math.PI * 2);
    const cur = countBridges(i);
    ctx.fillStyle = cur === isle.target ? '#4caf50' : selected === i ? '#ffd93d' : '#0096c7';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'white'; ctx.font = `bold ${cs * 0.35}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(isle.target), x, y + 1);
  });
}

function countBridges(idx: number): number {
  let c = 0;
  for (const b of bridges) {
    if (b.from === idx || b.to === idx) c += b.count;
  }
  return c;
}

function recalcCurrent() {
  for (let i = 0; i < puzzle.islands.length; i++) {
    puzzle.islands[i].current = countBridges(i);
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) / rect.width * canvas.width;
  const my = (e.clientY - rect.top) / rect.height * canvas.height;
  const cs = cellSize();
  let clicked = -1;
  puzzle.islands.forEach((isle, i) => {
    const dx = isle.col * cs + cs / 2 - mx, dy = isle.row * cs + cs / 2 - my;
    if (Math.sqrt(dx * dx + dy * dy) < cs * 0.4) clicked = i;
  });
  if (clicked < 0) { selected = null; status.textContent = 'Select an island'; draw(); return; }
  if (selected === null) {
    selected = clicked; playClick(); status.textContent = 'Select another island'; draw(); return;
  }
  if (selected === clicked) { selected = null; draw(); return; }
  if (!canConnect(puzzle.islands, selected, clicked)) {
    playWrong(); status.textContent = 'Islands must be in same row or column!'; selected = null; draw(); return;
  }
  bridges = addBridge(bridges, selected, clicked);
  recalcCurrent();
  playClick(); selected = null; status.textContent = 'Select an island';
  draw();
  if (isSolved(puzzle.islands)) win();
});

function win() {
  playWin(); showConfetti(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, 100, Date.now() - _startTime, true);
  setTimeout(() => {
    document.getElementById('game')!.classList.add('hidden');
    document.getElementById('result')!.classList.remove('hidden');
    createRatingUI(GAME_ID, document.getElementById('rating-container')!);
  }, 1000);
}

function startGame() {
  _startTime = Date.now(); trackGameStart(GAME_ID);
  puzzle = getPuzzle('hard'); bridges = []; selected = null;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  draw();
}

(window as any).resetPuzzle = () => { bridges = []; recalcCurrent(); selected = null; draw(); };
initMuteButton();
(window as any).startGame = startGame;

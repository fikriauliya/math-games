import { generatePuzzle, checkWord, calcScore, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'math-wordsearch';
let puzzle: Puzzle;
let foundWords: Set<string> = new Set();
let selecting = false;
let selectedCells: { r: number; c: number }[] = [];
let startTime = 0;
let timeLeft = 120;
let timer: ReturnType<typeof setInterval>;

function startGame() {
  const diff = (document.getElementById('diff') as HTMLSelectElement).value;
  puzzle = generatePuzzle(diff);
  foundWords = new Set();
  startTime = Date.now();
  timeLeft = 120;
  trackGameStart(GAME_ID, diff);

  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');

  renderGrid();
  renderWordList();
  document.getElementById('time')!.textContent = String(timeLeft);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('time')!.textContent = String(timeLeft);
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function renderGrid() {
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = puzzle.grid[r][c];
      cell.dataset.r = String(r);
      cell.dataset.c = String(c);
      cell.onpointerdown = (e) => { e.preventDefault(); selecting = true; selectedCells = [{ r, c }]; cell.classList.add('selecting'); };
      cell.onpointerenter = () => { if (selecting) { selectedCells.push({ r, c }); cell.classList.add('selecting'); } };
      cell.onpointerup = () => { selecting = false; checkSelection(); };
      grid.appendChild(cell);
    }
  }
  document.addEventListener('pointerup', () => { if (selecting) { selecting = false; checkSelection(); } });
}

function checkSelection() {
  // Build word from selected cells
  const word = selectedCells.map(({ r, c }) => puzzle.grid[r][c]).join('');
  const reversed = [...word].reverse().join('');

  const match = puzzle.words.find(w => (w === word || w === reversed) && !foundWords.has(w));
  if (match) {
    foundWords.add(match);
    playCorrect();
    selectedCells.forEach(({ r, c }) => {
      const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`) as HTMLElement;
      cell?.classList.add('found');
    });
    const li = document.querySelector(`[data-word="${match}"]`);
    if (li) li.classList.add('crossed');
    document.getElementById('found-count')!.textContent = String(foundWords.size);
    if (foundWords.size >= puzzle.words.length) endGame();
  } else {
    playClick();
  }
  document.querySelectorAll('.selecting').forEach(el => el.classList.remove('selecting'));
  selectedCells = [];
}

function renderWordList() {
  const list = document.getElementById('word-list')!;
  list.innerHTML = '';
  puzzle.words.forEach(w => {
    const li = document.createElement('li');
    li.textContent = w;
    li.dataset.word = w;
    list.appendChild(li);
  });
  document.getElementById('found-count')!.textContent = '0';
  document.getElementById('total-words')!.textContent = String(puzzle.words.length);
}

function endGame() {
  clearInterval(timer);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const score = calcScore(foundWords.size, puzzle.words.length, Math.max(0, timeLeft));
  const pct = foundWords.size / puzzle.words.length * 100;
  const grade = pct >= 100 ? 'S' : pct >= 80 ? 'A' : pct >= 50 ? 'B' : 'C';
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = pct >= 100 ? '🏆 All Found!' : '⭐ Good Try!';
  document.getElementById('r-found')!.textContent = `${foundWords.size}/${puzzle.words.length}`;
  document.getElementById('r-score')!.textContent = String(score);
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - startTime, foundWords.size >= puzzle.words.length);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (setHighScore(GAME_ID, score)) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;'; document.getElementById('r-score')!.after(el); }
  if (foundWords.size >= puzzle.words.length) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `🏆 Best: ${best}`; el.style.cssText = 'font-size:1.1rem;opacity:0.7;'; document.querySelector('.big-btn')?.before(el); }
initMuteButton();
(window as any).startGame = startGame;

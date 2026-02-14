import { generateMaze, checkAnswer, canMove, getResultText, type Maze, type Difficulty } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'math-maze';
const TOTAL_MAZES = 3;
let _analyticsStartTime = 0;
let maze: Maze;
let diff: Difficulty = 'easy';
let mazeNum = 0, solved = 0;
let blocked = false;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame(d: Difficulty) {
  diff = d;
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  mazeNum = 0; solved = 0;
  show('game-screen');
  nextMaze();
}

function nextMaze() {
  if (mazeNum >= TOTAL_MAZES) return endGame();
  maze = generateMaze(diff);
  document.getElementById('maze-num')!.textContent = String(mazeNum + 1);
  renderMaze();
}

function renderMaze() {
  const container = document.getElementById('maze-container')!;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${maze.width}, 1fr)`;

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = maze.grid[y][x];
      const el = document.createElement('div');
      el.className = 'maze-cell';
      if (cell.walls.top) el.classList.add('bt');
      if (cell.walls.right) el.classList.add('br');
      if (cell.walls.bottom) el.classList.add('bb');
      if (cell.walls.left) el.classList.add('bl');
      if (x === maze.playerX && y === maze.playerY) { el.classList.add('player'); el.textContent = '🧙'; }
      if (x === maze.exitX && y === maze.exitY) { el.classList.add('exit'); if (!(x === maze.playerX && y === maze.playerY)) el.textContent = '🚪'; }
      if (cell.question && !cell.solved) el.classList.add('has-q');
      if (cell.solved) el.classList.add('solved');
      container.appendChild(el);
    }
  }
}

function movePlayer(dx: number, dy: number) {
  if (blocked) return;
  if (!canMove(maze, dx, dy)) { playWrong(); return; }

  const nx = maze.playerX + dx;
  const ny = maze.playerY + dy;
  const targetCell = maze.grid[ny][nx];

  if (targetCell.question && !targetCell.solved) {
    blocked = true;
    showQuestion(targetCell, nx, ny);
    return;
  }

  maze.playerX = nx;
  maze.playerY = ny;
  playClick();
  renderMaze();

  if (nx === maze.exitX && ny === maze.exitY) {
    solved++;
    mazeNum++;
    playCorrect();
    setTimeout(nextMaze, 800);
  }
}

function showQuestion(cell: typeof maze.grid[0][0], nx: number, ny: number) {
  const popup = document.getElementById('question-popup')!;
  popup.style.display = 'block';
  document.getElementById('q-text')!.textContent = cell.question! + ' = ?';
  const choices = document.getElementById('q-choices')!;
  choices.innerHTML = '';
  cell.choices!.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'q-btn';
    btn.textContent = String(val);
    btn.onclick = () => answerQuestion(btn, val, cell, nx, ny);
    choices.appendChild(btn);
  });
}

function answerQuestion(btn: HTMLButtonElement, answer: number, cell: typeof maze.grid[0][0], nx: number, ny: number) {
  document.querySelectorAll<HTMLButtonElement>('.q-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, cell.answer!);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    cell.solved = true;
    playCorrect();
    setTimeout(() => {
      document.getElementById('question-popup')!.style.display = 'none';
      maze.playerX = nx;
      maze.playerY = ny;
      blocked = false;
      renderMaze();
      if (nx === maze.exitX && ny === maze.exitY) {
        solved++;
        mazeNum++;
        setTimeout(nextMaze, 800);
      }
    }, 600);
  } else {
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.q-btn').forEach(b => {
      if (Number(b.textContent) === cell.answer) b.classList.add('correct');
    });
    setTimeout(() => {
      document.getElementById('question-popup')!.style.display = 'none';
      blocked = false;
    }, 1200);
  }
}

function endGame() {
  const result = getResultText(solved, TOTAL_MAZES);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, solved, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const isNew = setHighScore(GAME_ID, solved);
  if (isNew && solved > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (solved === TOTAL_MAZES) showConfetti();
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  if (e.key === 'ArrowDown') movePlayer(0, 1);
  if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  if (e.key === 'ArrowRight') movePlayer(1, 0);
});

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${TOTAL_MAZES} mazes`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.difficulty-select')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).move = movePlayer;

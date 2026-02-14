import { genProblem, genFoodItems, getGrade, isCorrectFood, type MathProblem, type FoodItem } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'math-snake';
const GRID = 15;
const CELL = 22;
let _startTime = 0;

interface Snake { body: { x: number; y: number }[]; dx: number; dy: number; }
let snake: Snake;
let problem: MathProblem;
let foods: FoodItem[];
let score: number, correctCount: number, wrongCount: number, totalProblems: number;
let gameLoop: ReturnType<typeof setInterval> | null = null;
let gameOver: boolean;

function startGame() {
  _startTime = Date.now(); trackGameStart(GAME_ID);
  score = 0; correctCount = 0; wrongCount = 0; totalProblems = 0; gameOver = false;
  snake = { body: [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }], dx: 1, dy: 0 };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  newProblem();
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(tick, 180);
}

function newProblem() {
  problem = genProblem();
  foods = genFoodItems(problem.answer, GRID, 4);
  document.getElementById('problem')!.textContent = `${problem.text} = ?`;
  totalProblems++;
}

function tick() {
  if (gameOver) return;
  const head = { x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy };
  // Wall collision
  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) { endGame(); return; }
  // Self collision
  if (snake.body.some(s => s.x === head.x && s.y === head.y)) { endGame(); return; }
  snake.body.unshift(head);
  // Check food
  const foodIdx = foods.findIndex(f => f.x === head.x && f.y === head.y);
  if (foodIdx >= 0) {
    const food = foods[foodIdx];
    if (isCorrectFood(food.value, problem.answer)) {
      correctCount++; score += 10; playCorrect();
      newProblem();
    } else {
      wrongCount++; playWrong();
      foods.splice(foodIdx, 1);
      snake.body.pop(); // Don't grow
    }
  } else {
    snake.body.pop();
  }
  document.getElementById('score')!.textContent = String(score);
  draw();
}

function draw() {
  const canvas = document.getElementById('snake-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Grid
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
  // Foods
  foods.forEach(f => {
    ctx.fillStyle = '#ffd93d';
    ctx.fillRect(f.x * CELL + 1, f.y * CELL + 1, CELL - 2, CELL - 2);
    ctx.fillStyle = '#000'; ctx.font = '12px Nunito'; ctx.textAlign = 'center';
    ctx.fillText(String(f.value), f.x * CELL + CELL / 2, f.y * CELL + CELL / 2 + 4);
  });
  // Snake
  snake.body.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#4caf50' : '#81c784';
    ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
  });
}

function endGame() {
  gameOver = true;
  if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const total = correctCount + wrongCount;
  const { grade, message } = getGrade(correctCount, Math.max(total, 1));
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = String(correctCount);
  document.getElementById('r-wrong')!.textContent = String(wrongCount);
  document.getElementById('r-score')!.textContent = String(score);
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _startTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (setHighScore(GAME_ID, score)) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;'; document.getElementById('r-score')!.after(el); }
  if (wrongCount === 0 && correctCount > 0) showConfetti();
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && snake.dy !== 1) { snake.dx = 0; snake.dy = -1; }
  else if (e.key === 'ArrowDown' && snake.dy !== -1) { snake.dx = 0; snake.dy = 1; }
  else if (e.key === 'ArrowLeft' && snake.dx !== 1) { snake.dx = -1; snake.dy = 0; }
  else if (e.key === 'ArrowRight' && snake.dx !== -1) { snake.dx = 1; snake.dy = 0; }
});

// Touch controls
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20 && snake.dx !== -1) { snake.dx = 1; snake.dy = 0; }
    else if (dx < -20 && snake.dx !== 1) { snake.dx = -1; snake.dy = 0; }
  } else {
    if (dy > 20 && snake.dy !== -1) { snake.dx = 0; snake.dy = 1; }
    else if (dy < -20 && snake.dy !== 1) { snake.dx = 0; snake.dy = -1; }
  }
});

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `Your best: ${best}`; el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;'; document.querySelector('#start .big-btn')!.before(el); }
initMuteButton();
(window as any).startGame = startGame;

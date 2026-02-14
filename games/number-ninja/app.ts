import { CONFIG, genQuestion, calcPoints, calcAccuracy } from './logic';

interface FallingItem {
  id: number;
  el: HTMLElement;
  y: number;
  answer: number;
  speed: number;
}

const gameArea = document.getElementById('game-area')!;
const hudEl = document.getElementById('hud')!;
const inputArea = document.getElementById('input-area')!;
const answerInput = document.getElementById('answer-input') as HTMLInputElement;
const slashBtn = document.getElementById('slash-btn')!;
const scoreEl = document.getElementById('score')!;
const livesEl = document.getElementById('lives')!;
const comboEl = document.getElementById('combo-text')!;
const startScreen = document.getElementById('start-screen')!;
const gameOverScreen = document.getElementById('game-over')!;

let items: FallingItem[] = [];
let score = 0;
let lives = 0;
let combo = 0;
let maxCombo = 0;
let slashed = 0;
let missed = 0;
let difficulty = 'easy';
let gameRunning = false;
let spawnTimer: ReturnType<typeof setInterval> | null = null;
let frameId: number | null = null;
let itemId = 0;

// Add stars
for (let i = 0; i < 40; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 60 + '%';
  s.style.animationDelay = Math.random() * 2 + 's';
  gameArea.appendChild(s);
}

function spawnItem() {
  if (!gameRunning) return;
  const q = genQuestion(difficulty);
  const id = ++itemId;
  const areaW = gameArea.clientWidth || window.innerWidth;
  const x = 30 + Math.random() * (areaW - 160);
  const el = document.createElement('div');
  el.className = 'falling-item';
  el.innerHTML = `<div class="question">${q.text} = ?</div>`;
  el.style.left = x + 'px';
  el.style.top = '-60px';
  gameArea.appendChild(el);
  const item: FallingItem = { id, el, y: -60, answer: q.answer, speed: CONFIG[difficulty].speed + Math.random() * 0.2 };
  items.push(item);
}

function updateLives() {
  livesEl.textContent = '❤️'.repeat(lives);
}

function updateCombo() {
  comboEl.textContent = combo > 1 ? `🔥 ${combo}x Combo!` : '';
}

function showSlashEffect(x: number, y: number, isCorrect: boolean) {
  const ef = document.createElement('div');
  ef.className = 'slash-effect';
  ef.textContent = isCorrect ? '⚡' : '💨';
  ef.style.left = x + 'px';
  ef.style.top = y + 'px';
  ef.style.color = isCorrect ? '#ffd54f' : '#999';
  gameArea.appendChild(ef);
  setTimeout(() => ef.remove(), 600);
}

function trySlash() {
  const val = parseInt(answerInput.value);
  if (isNaN(val)) return;
  answerInput.value = '';

  let best: FallingItem | null = null;
  for (const it of items) {
    if (it.answer === val) {
      if (!best || it.y > best.y) best = it;
    }
  }
  if (best) {
    const rect = best.el.getBoundingClientRect();
    showSlashEffect(rect.left + rect.width / 2, rect.top, true);
    best.el.remove();
    items = items.filter(i => i.id !== best!.id);
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    const pts = calcPoints(combo);
    score += pts;
    slashed++;
    scoreEl.textContent = String(score);
    updateCombo();
  } else {
    combo = 0;
    updateCombo();
  }
  answerInput.focus();
}

function gameLoop() {
  if (!gameRunning) return;
  const maxY = (gameArea.clientHeight || window.innerHeight) - 120;
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    it.y += it.speed;
    it.el.style.top = it.y + 'px';
    if (it.y > maxY) {
      showSlashEffect(parseFloat(it.el.style.left) + 50, maxY, false);
      it.el.remove();
      items.splice(i, 1);
      lives--;
      missed++;
      combo = 0;
      updateLives();
      updateCombo();
      if (lives <= 0) { endGame(); return; }
    }
  }
  frameId = requestAnimationFrame(gameLoop);
}

function startGame(diff: string) {
  difficulty = diff;
  startScreen.style.display = 'none';
  gameOverScreen.classList.remove('show');
  hudEl.style.display = 'flex';
  inputArea.style.display = 'flex';
  items.forEach(i => i.el.remove());
  items = [];
  score = 0; lives = CONFIG[diff].lives; combo = 0; maxCombo = 0; slashed = 0; missed = 0;
  scoreEl.textContent = '0';
  updateLives();
  updateCombo();
  gameRunning = true;
  answerInput.value = '';
  answerInput.focus();
  spawnItem();
  spawnTimer = setInterval(spawnItem, CONFIG[diff].spawnMs);
  setTimeout(() => { if (gameRunning && spawnTimer) { clearInterval(spawnTimer); spawnTimer = setInterval(spawnItem, CONFIG[diff].spawnMs * 0.8); }}, 30000);
  setTimeout(() => { if (gameRunning && spawnTimer) { clearInterval(spawnTimer); spawnTimer = setInterval(spawnItem, CONFIG[diff].spawnMs * 0.6); }}, 60000);
  frameId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  if (spawnTimer) clearInterval(spawnTimer);
  if (frameId) cancelAnimationFrame(frameId);
  items.forEach(i => i.el.remove());
  items = [];
  hudEl.style.display = 'none';
  inputArea.style.display = 'none';
  document.getElementById('final-score')!.textContent = String(score);
  const accuracy = calcAccuracy(slashed, missed);
  document.getElementById('stats')!.innerHTML = `🗡️ Slashed: ${slashed}<br>💨 Missed: ${missed}<br>🎯 Accuracy: ${accuracy}%<br>🔥 Best Combo: ${maxCombo}x`;
  gameOverScreen.classList.add('show');
}

function showStart() {
  gameOverScreen.classList.remove('show');
  startScreen.style.display = 'flex';
}

slashBtn.addEventListener('click', trySlash);
answerInput.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') trySlash(); });

(window as any).startGame = startGame;
(window as any).showStart = showStart;

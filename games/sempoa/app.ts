import { generateNumbers, calculateAnswer, formatNumber, formatFirstNumber, checkAnswer, getDifficultyConfig, getGrade, getSpeedMs, type Difficulty } from './logic';
import { playCorrect, playWrong, playTick, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'sempoa';
const TOTAL_ROUNDS = 10;

// ── State ──────────────────────────────
let difficulty: Difficulty = 'easy';
let numberCount = 3;
let speedLabel = 'normal';
let allowDecimals = false;

let currentRound = 0;
let score = 0;
let numbers: number[] = [];
let correctAnswer = 0;
let answerStr = '0';
let isNegative = false;
let analyticsStart = 0;

// ── Elements ───────────────────────────
const startScreen = document.getElementById('start-screen')!;
const gameScreen = document.getElementById('game-screen')!;
const answerScreen = document.getElementById('answer-screen')!;
const resultScreen = document.getElementById('result-screen')!;
const finalScreen = document.getElementById('final-screen')!;

const flashNumber = document.getElementById('flash-number')!;
const progressFill = document.getElementById('progress-fill')!;
const roundInfo = document.getElementById('round-info')!;
const answerDisplay = document.getElementById('answer-display')!;
const highScoreDisplay = document.getElementById('high-score-display')!;

// ── Init ───────────────────────────────
initMuteButton();
showHighScore();
setupSettings();
buildNumpad();

function showHighScore() {
  const hs = getHighScore(GAME_ID);
  if (hs > 0) highScoreDisplay.textContent = `🏆 Best: ${hs}/${TOTAL_ROUNDS}`;
}

function setupSettings() {
  // Difficulty buttons
  setupBtnGroup('difficulty-group', (val) => {
    difficulty = val as Difficulty;
    const config = getDifficultyConfig(difficulty);
    const slider = document.getElementById('count-slider') as HTMLInputElement;
    slider.value = String(config.count);
    document.getElementById('count-display')!.textContent = String(config.count);
    numberCount = config.count;
  });

  // Speed buttons
  setupBtnGroup('speed-group', (val) => { speedLabel = val; });

  // Mode buttons
  setupBtnGroup('mode-group', (val) => { allowDecimals = val === 'decimal'; });

  // Count slider
  const slider = document.getElementById('count-slider') as HTMLInputElement;
  slider.addEventListener('input', () => {
    numberCount = parseInt(slider.value);
    document.getElementById('count-display')!.textContent = slider.value;
  });
}

function setupBtnGroup(groupId: string, onChange: (val: string) => void) {
  const group = document.getElementById(groupId)!;
  const buttons = group.querySelectorAll('.opt-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onChange((btn as HTMLElement).dataset.val!);
      playClick();
    });
  });
}

function buildNumpad() {
  const numpad = document.getElementById('numpad')!;
  const keys = ['1','2','3','4','5','6','7','8','9','+/-','0','.','⌫','','✓'];

  keys.forEach(key => {
    if (key === '') return;
    const btn = document.createElement('button');
    btn.className = 'numpad-btn';
    btn.textContent = key;

    if (key === '✓') {
      btn.className += ' submit';
      btn.addEventListener('click', submitAnswer);
    } else if (key === '⌫' || key === '+/-') {
      btn.className += ' action';
      btn.addEventListener('click', () => handleKey(key));
    } else {
      btn.addEventListener('click', () => handleKey(key));
    }

    numpad.appendChild(btn);
  });
}

function handleKey(key: string) {
  playClick();
  if (key === '⌫') {
    if (answerStr.length > 1) answerStr = answerStr.slice(0, -1);
    else answerStr = '0';
  } else if (key === '+/-') {
    isNegative = !isNegative;
  } else if (key === '.') {
    if (!answerStr.includes('.')) answerStr += '.';
  } else {
    if (answerStr === '0') answerStr = key;
    else answerStr += key;
  }
  updateAnswerDisplay();
}

function updateAnswerDisplay() {
  answerDisplay.textContent = (isNegative ? '-' : '') + answerStr;
}

// ── Screens ────────────────────────────
function hideAll() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  answerScreen.style.display = 'none';
  resultScreen.style.display = 'none';
  finalScreen.style.display = 'none';
}

function showScreen(el: HTMLElement) {
  hideAll();
  el.style.display = 'flex';
}

// ── Game Flow ──────────────────────────
(window as any).startGame = startGame;
(window as any).nextRound = nextRound;
(window as any).showStart = showStart;

function showStart() {
  showScreen(startScreen);
  showHighScore();
}

function startGame() {
  currentRound = 0;
  score = 0;
  analyticsStart = Date.now();
  trackGameStart(GAME_ID, difficulty);
  nextRound();
}

function nextRound() {
  if (currentRound >= TOTAL_ROUNDS) {
    showFinal();
    return;
  }
  currentRound++;
  numbers = generateNumbers(difficulty, numberCount, allowDecimals);
  correctAnswer = calculateAnswer(numbers);

  showScreen(gameScreen);
  roundInfo.textContent = `Round ${currentRound} / ${TOTAL_ROUNDS}`;

  flashNumbers();
}

async function flashNumbers() {
  const speedMs = getSpeedMs(speedLabel);

  for (let i = 0; i < numbers.length; i++) {
    // Update progress bar
    progressFill.style.width = `${((numbers.length - i) / numbers.length) * 100}%`;

    // Show number
    flashNumber.classList.remove('show');
    await sleep(50);
    flashNumber.textContent = i === 0 ? formatFirstNumber(numbers[i]) : formatNumber(numbers[i]);
    flashNumber.classList.add('show');
    playTick();

    await sleep(speedMs);
  }

  // Hide last number
  flashNumber.classList.remove('show');
  progressFill.style.width = '0%';

  await sleep(400);
  showAnswerInput();
}

function showAnswerInput() {
  answerStr = '0';
  isNegative = false;
  updateAnswerDisplay();
  showScreen(answerScreen);
}

function submitAnswer() {
  const userAnswer = parseFloat((isNegative ? '-' : '') + answerStr);
  const hasDecimals = numbers.some(n => !Number.isInteger(n));
  const tolerance = hasDecimals ? 0.01 : 0;
  const correct = checkAnswer(userAnswer, correctAnswer, tolerance);

  if (correct) {
    score++;
    playCorrect();
  } else {
    playWrong();
  }

  showResult(correct, userAnswer);
}

function showResult(correct: boolean, userAnswer: number) {
  showScreen(resultScreen);
  resultScreen.className = correct ? 'result-correct' : 'result-wrong';

  document.getElementById('result-icon')!.textContent = correct ? '✅' : '❌';
  document.getElementById('result-text')!.textContent = correct ? 'Benar!' : 'Salah!';

  // Show calculation detail
  const detail = numbers.map((n, i) => i === 0 ? `${n}` : formatNumber(n)).join(' ');
  document.getElementById('result-detail')!.innerHTML =
    `${detail} = <strong>${correctAnswer}</strong>` +
    (!correct ? `<br>Jawabanmu: ${userAnswer}` : '');

  if (currentRound >= TOTAL_ROUNDS) {
    document.querySelector('.next-btn')!.textContent = 'Lihat Hasil →';
  } else {
    document.querySelector('.next-btn')!.textContent = 'Lanjut →';
  }
}

function showFinal() {
  showScreen(finalScreen);
  const { grade, message } = getGrade(score, TOTAL_ROUNDS);
  const isNewRecord = setHighScore(GAME_ID, score);
  setLastPlayed(GAME_ID);

  document.getElementById('final-grade')!.textContent = grade;
  document.getElementById('final-score')!.textContent = `${score} / ${TOTAL_ROUNDS} Benar`;
  document.getElementById('final-message')!.textContent = message;
  document.getElementById('final-detail')!.textContent = isNewRecord ? '🎉 Rekor Baru!' : `🏆 Best: ${getHighScore(GAME_ID)}/${TOTAL_ROUNDS}`;

  trackGameEnd(GAME_ID, score, Date.now() - analyticsStart, true);
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);

  if (score >= TOTAL_ROUNDS) {
    showConfetti();
    playWin();
  } else if (score >= TOTAL_ROUNDS * 0.8) {
    playWin();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

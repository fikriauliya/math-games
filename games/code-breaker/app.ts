import { generateCode, evaluateGuess, isWin, getGrade, COLORS, CODE_LENGTH, MAX_GUESSES, type GuessResult } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'code-breaker';
let secret: string[] = [];
let currentGuess: string[] = [];
let history: GuessResult[] = [];
let guessNum = 0;
let gameActive = false;
let _startTime = 0;

function renderColorPicker() {
  const picker = document.getElementById('color-picker')!;
  picker.innerHTML = '';
  for (const c of COLORS) {
    const btn = document.createElement('button');
    btn.className = 'color-btn'; btn.textContent = c;
    btn.onclick = () => { if (currentGuess.length < CODE_LENGTH) { playClick(); currentGuess.push(c); renderCurrentGuess(); } };
    picker.appendChild(btn);
  }
}

function renderCurrentGuess() {
  const row = document.getElementById('current-guess')!;
  row.innerHTML = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const slot = document.createElement('div');
    slot.className = 'guess-slot' + (currentGuess[i] ? ' filled' : '');
    slot.textContent = currentGuess[i] || '';
    slot.onclick = () => { if (currentGuess[i]) { currentGuess.splice(i, 1); renderCurrentGuess(); } };
    row.appendChild(slot);
  }
}

function renderHistory() {
  const el = document.getElementById('history')!;
  el.innerHTML = '';
  for (const h of history) {
    const row = document.createElement('div'); row.className = 'history-row';
    const guess = document.createElement('div'); guess.className = 'history-guess';
    guess.textContent = h.guess.join('');
    const pegs = document.createElement('div'); pegs.className = 'history-pegs';
    pegs.textContent = h.pegs.map(p => p.type === 'black' ? '⬛' : '⬜').join('') || '—';
    row.appendChild(guess); row.appendChild(pegs);
    el.appendChild(row);
  }
  el.scrollTop = el.scrollHeight;
}

function submitGuess() {
  if (!gameActive || currentGuess.length < CODE_LENGTH) return;
  guessNum++;
  const pegs = evaluateGuess(secret, currentGuess);
  history.push({ guess: [...currentGuess], pegs });
  document.getElementById('guess-num')!.textContent = String(Math.min(guessNum + 1, MAX_GUESSES));
  renderHistory();

  if (isWin(pegs)) {
    gameActive = false; playWin(); showConfetti();
    const { grade, message } = getGrade(guessNum);
    endGame(true, grade, message);
    return;
  }
  if (guessNum >= MAX_GUESSES) {
    gameActive = false; playWrong();
    endGame(false, 'X', '💔 Code not cracked!');
    return;
  }
  playCorrect();
  currentGuess = []; renderCurrentGuess();
}

function endGame(won: boolean, grade: string, message: string) {
  setTimeout(() => {
    document.getElementById('game')!.classList.add('hidden');
    document.getElementById('result')!.classList.remove('hidden');
    document.getElementById('grade')!.textContent = grade;
    document.getElementById('result-title')!.textContent = won ? '🏆 Code Cracked!' : '💔 Game Over';
    document.getElementById('result-msg')!.textContent = message;
    document.getElementById('secret-reveal')!.textContent = `Secret: ${secret.join('')}`;
    setLastPlayed(GAME_ID);
    const score = won ? Math.max(0, (MAX_GUESSES - guessNum + 1) * 10) : 0;
    trackGameEnd(GAME_ID, score, Date.now() - _startTime, won);
    if (won && setHighScore(GAME_ID, score)) {
      const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!';
      el.style.cssText = 'font-size:1.3rem;font-weight:900;color:#ffd700;';
      document.getElementById('result-msg')!.after(el);
    }
    createRatingUI(GAME_ID, document.getElementById('rating-container')!);
  }, 500);
}

function startGame() {
  _startTime = Date.now(); trackGameStart(GAME_ID);
  secret = generateCode(); currentGuess = []; history = []; guessNum = 0; gameActive = true;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  document.getElementById('guess-num')!.textContent = '1';
  renderColorPicker(); renderCurrentGuess(); renderHistory();
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).submitGuess = submitGuess;

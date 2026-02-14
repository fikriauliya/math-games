import { pickWords, scramble, checkAnswer, getHint, getResultText, TOTAL } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'word-scramble';
let _start = 0;
let words: string[];
let round = 0;
let score = 0;
let currentWord = '';
let scrambled = '';
let hintUsed = false;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _start = Date.now();
  trackGameStart(GAME_ID);
  words = pickWords(TOTAL);
  round = 0; score = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  currentWord = words[round];
  scrambled = scramble(currentWord);
  hintUsed = false;
  document.getElementById('round-info')!.textContent = `${round + 1} / ${TOTAL}`;
  document.getElementById('score-display')!.textContent = `Score: ${score}`;
  document.getElementById('scrambled')!.textContent = scrambled;
  document.getElementById('hint-area')!.textContent = '';
  const input = document.getElementById('answer-input') as HTMLInputElement;
  input.value = '';
  input.focus();
  document.getElementById('feedback')!.textContent = '';
}

function submitAnswer() {
  const input = document.getElementById('answer-input') as HTMLInputElement;
  const guess = input.value;
  if (!guess.trim()) return;

  const correct = checkAnswer(guess, currentWord);
  const fb = document.getElementById('feedback')!;

  if (correct) {
    score++;
    fb.textContent = '✅ Correct!';
    fb.style.color = '#4caf50';
    playCorrect();
  } else {
    fb.textContent = `❌ It was: ${currentWord}`;
    fb.style.color = '#f44336';
    playWrong();
  }

  document.getElementById('score-display')!.textContent = `Score: ${score}`;
  setTimeout(() => { round++; nextRound(); }, 1500);
}

function showHint() {
  if (!hintUsed) {
    hintUsed = true;
    document.getElementById('hint-area')!.textContent = `Hint: ${getHint(currentWord)}`;
  }
}

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
  if (setHighScore(GAME_ID, score) && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL) showConfetti();
}

document.getElementById('submit-btn')!.onclick = submitAnswer;
document.getElementById('hint-btn')!.onclick = showHint;
(document.getElementById('answer-input') as HTMLInputElement).onkeydown = (e) => { if (e.key === 'Enter') submitAnswer(); };

initMuteButton();
(window as any).startGame = startGame;

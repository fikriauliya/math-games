import { TOTAL, generateRound, checkAnswer, getResultText, type LetterRound } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-letters';
let _analyticsStartTime = 0;
let currentRound: LetterRound;
let round = 0;
let score = 0;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
}

function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID'; u.rate = 0.7; u.pitch = 1.2;
    speechSynthesis.speak(u);
  } catch {}
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; score = 0;
  show('game-screen');
  renderStars();
  nextRound();
}

function renderStars() {
  const bar = document.getElementById('score-bar')!;
  bar.innerHTML = '';
  for (let i = 0; i < TOTAL; i++) {
    const s = document.createElement('span');
    s.className = 'star' + (i < score ? ' earned' : '');
    s.textContent = '⭐';
    bar.appendChild(s);
  }
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  currentRound = generateRound(round);

  document.getElementById('hint-emoji')!.textContent = currentRound.emoji;
  document.getElementById('hint-word')!.textContent = `${currentRound.letter} = ${currentRound.word}`;
  document.getElementById('question')!.textContent = `Mana huruf ${currentRound.letter}?`;
  speak(`Mana huruf ${currentRound.letter}? ${currentRound.letter} seperti ${currentRound.word}`);

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  currentRound.choices.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.innerHTML = `<span class="letter-text">${letter}</span>`;
    btn.onclick = () => pick(btn, letter);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, letter: string) {
  document.querySelectorAll<HTMLButtonElement>('.letter-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(letter, currentRound.letter);

  if (correct) {
    btn.classList.add('correct');
    score++;
    renderStars();
    playToddlerCorrect();
    speak(`Benar! ${currentRound.letter}!`);
  } else {
    btn.classList.add('wrong');
    playToddlerWrong();
    document.querySelectorAll<HTMLButtonElement>('.letter-btn').forEach(b => {
      if (b.querySelector('.letter-text')!.textContent === currentRound.letter) b.classList.add('correct');
    });
    speak(`Ini huruf ${currentRound.letter}`);
  }

  setTimeout(() => { round++; nextRound(); }, correct ? 1500 : 2500);
}

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');

  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  setHighScore(GAME_ID, score);
  if (score === TOTAL) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;

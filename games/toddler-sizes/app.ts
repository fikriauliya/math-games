import { generateRound, checkAnswer, getResultText, TOTAL, type SizeRound } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-sizes';
let _analyticsStartTime = 0;
let currentRound: SizeRound;
let round = 0;
let score = 0;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
}

function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.2;
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

  const qText = currentRound.question === 'besar'
    ? 'Mana yang BESAR?'
    : 'Mana yang KECIL?';
  document.getElementById('question')!.textContent = qText;
  speak(qText);

  const container = document.getElementById('choices')!;
  container.innerHTML = '';

  for (let i = 0; i < 2; i++) {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    const isBig = i === currentRound.bigIndex;
    btn.innerHTML = `<span class="size-emoji" style="font-size:${isBig ? 'clamp(5rem, 15vw, 8rem)' : 'clamp(2rem, 6vw, 3rem)'}">${currentRound.emoji}</span>`;
    btn.onclick = () => pick(btn, i);
    container.appendChild(btn);
  }
}

function pick(btn: HTMLButtonElement, index: number) {
  document.querySelectorAll<HTMLButtonElement>('.size-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(index, currentRound);

  if (correct) {
    btn.classList.add('correct');
    score++;
    renderStars();
    playToddlerCorrect();
    speak('Benar!');
  } else {
    btn.classList.add('wrong');
    playToddlerWrong();
    document.querySelectorAll<HTMLButtonElement>('.size-btn').forEach((b, i) => {
      if (checkAnswer(i, currentRound)) b.classList.add('correct');
    });
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

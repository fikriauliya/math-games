import { genQuestion, isCorrect, getEndResult, type GravityQuestion } from './logic';
import { playToddlerCorrect, playToddlerWrong, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-gravity';
const TOTAL_Q = 5;
let currentQ: GravityQuestion;
let qIdx = 0, correctCount = 0, _startTime = 0, answering = false;

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID'; u.rate = 0.85;
  speechSynthesis.speak(u);
}

function renderQuestion() {
  currentQ = genQuestion();
  answering = true;
  document.getElementById('qnum')!.textContent = String(qIdx + 1);
  document.getElementById('obj-left')!.textContent = currentQ.obj1.emoji;
  document.getElementById('obj-right')!.textContent = currentQ.obj2.emoji;
  document.getElementById('obj-left')!.classList.remove('falling');
  document.getElementById('obj-right')!.classList.remove('falling');
  document.getElementById('btn-left')!.textContent = `${currentQ.obj1.emoji} ${currentQ.obj1.name}`;
  document.getElementById('btn-right')!.textContent = `${currentQ.obj2.emoji} ${currentQ.obj2.name}`;
  document.getElementById('btn-left')!.className = 'choice-btn';
  document.getElementById('btn-right')!.className = 'choice-btn';
  document.getElementById('feedback')!.textContent = '';
  speak(`Mana yang jatuh duluan? ${currentQ.obj1.name} atau ${currentQ.obj2.name}?`);
}

function pick(side: 'left' | 'right') {
  if (!answering) return;
  answering = false; playClick();
  const correct = isCorrect(side, currentQ.answer);
  const btnId = side === 'left' ? 'btn-left' : 'btn-right';
  const correctBtnId = currentQ.answer === 'left' ? 'btn-left' : 'btn-right';

  // Animate falling
  const fallingId = currentQ.answer === 'left' ? 'obj-left' : 'obj-right';
  document.getElementById(fallingId)!.classList.add('falling');

  if (correct) {
    correctCount++;
    document.getElementById(btnId)!.classList.add('correct');
    document.getElementById('feedback')!.textContent = '✅ Benar! ' + currentQ.explanation;
    playToddlerCorrect();
    speak('Benar! Hebat!');
  } else {
    document.getElementById(btnId)!.classList.add('wrong');
    document.getElementById(correctBtnId)!.classList.add('correct');
    document.getElementById('feedback')!.textContent = '❌ ' + currentQ.explanation;
    playToddlerWrong();
    speak(currentQ.explanation);
  }

  qIdx++;
  if (qIdx >= TOTAL_Q) { setTimeout(endGame, 2500); return; }
  setTimeout(renderQuestion, 2500);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const result = getEndResult(correctCount, TOTAL_Q);
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-stars')!.textContent = result.stars;
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, correctCount * 20, Date.now() - _startTime, correctCount >= TOTAL_Q / 2);
  if (correctCount >= 4) { showConfetti(); speak('Hebat sekali! Kamu pintar!'); }
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
}

function startGame() {
  _startTime = Date.now(); trackGameStart(GAME_ID);
  qIdx = 0; correctCount = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  renderQuestion();
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).pick = pick;

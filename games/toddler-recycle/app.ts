import { generateRounds, checkBin, getEndResult, type TrashItem, type BinType } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-recycle';
let items: TrashItem[] = [];
let round = 0;
let correct = 0;
const total = 10;
let locked = false;
let startTime = 0;

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  speechSynthesis.speak(u);
}

(window as any).startGame = () => {
  startTime = Date.now();
  trackGameStart(GAME_ID);
  items = generateRounds(total);
  round = 0; correct = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
};

(window as any).chooseBin = (bin: BinType) => {
  if (locked || round > total) return;
  locked = true;
  const item = items[round - 1];
  const isCorrect = checkBin(item, bin);
  const binEl = document.querySelector(`.bin.${bin}`)!;
  if (isCorrect) {
    correct++;
    binEl.classList.add('correct');
    playToddlerCorrect();
    speak('Benar!');
  } else {
    binEl.classList.add('wrong');
    playToddlerWrong();
    speak('Coba lagi ya!');
  }
  setTimeout(() => {
    binEl.classList.remove('correct', 'wrong');
    nextRound();
  }, 1200);
};

function nextRound() {
  if (round >= total) return endGame();
  round++;
  locked = false;
  document.getElementById('round-info')!.textContent = `${round}/${total}`;
  document.getElementById('stars')!.textContent = '⭐'.repeat(correct);
  const item = items[round - 1];
  document.getElementById('trash-item')!.textContent = item.emoji;
  document.getElementById('trash-name')!.textContent = item.name;
  // Re-trigger animation
  const el = document.getElementById('trash-item')!;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

function endGame() {
  const res = getEndResult(correct, total);
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, correct, Date.now() - startTime, true);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('result-title')!.textContent = res.title;
  document.getElementById('big-stars')!.textContent = res.stars;
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
  speak(correct >= 8 ? 'Hebat sekali!' : 'Bagus!');
}

initMuteButton();

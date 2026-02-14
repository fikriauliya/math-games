import { shuffleColors, isCorrectOrder, swapColors, getEndResult, type RainbowColor } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-rainbow';
let colors: RainbowColor[] = [];
let moves = 0;
let selected: number | null = null;
let startTime = 0;

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  speechSynthesis.speak(u);
}

(window as any).startGame = () => {
  startTime = Date.now();
  trackGameStart(GAME_ID);
  colors = shuffleColors();
  moves = 0;
  selected = null;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  render();
};

function render() {
  document.getElementById('moves')!.textContent = `Langkah: ${moves}`;
  const list = document.getElementById('color-list')!;
  list.innerHTML = '';
  colors.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'color-item' + (selected === i ? ' selected' : '') + (c.order === i ? ' correct' : '');
    el.style.background = c.color;
    el.textContent = c.name;
    el.onclick = () => handleClick(i);
    list.appendChild(el);
  });
}

function handleClick(index: number) {
  if (selected === null) {
    selected = index;
    render();
  } else if (selected === index) {
    selected = null;
    render();
  } else {
    colors = swapColors(colors, selected, index);
    moves++;
    selected = null;
    playToddlerCorrect();
    render();
    if (isCorrectOrder(colors)) {
      setTimeout(endGame, 500);
    }
  }
}

function endGame() {
  const res = getEndResult(moves);
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, Math.max(0, 30 - moves), Date.now() - startTime, true);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('result-title')!.textContent = res.title;
  document.getElementById('big-stars')!.textContent = res.stars;
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
  speak('Pelangi indah sekali!');
}

initMuteButton();

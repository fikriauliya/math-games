import { createTrain, swapCars, isCorrectOrder, getEndResult, type TrainCar } from './logic';
import { playToddlerCorrect, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-train';
let cars: TrainCar[] = [];
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
  cars = createTrain();
  moves = 0; selected = null;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  render();
};

function render() {
  document.getElementById('moves')!.textContent = `Langkah: ${moves}`;
  const container = document.getElementById('cars')!;
  container.innerHTML = '';
  cars.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'car' + (selected === i ? ' selected' : '') + (c.number === i + 1 ? ' correct' : '');
    el.style.background = c.color;
    el.textContent = String(c.number);
    el.onclick = () => handleClick(i);
    container.appendChild(el);
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
    cars = swapCars(cars, selected, index);
    moves++;
    selected = null;
    playToddlerCorrect();
    render();
    if (isCorrectOrder(cars)) {
      setTimeout(endGame, 500);
    }
  }
}

function endGame() {
  const res = getEndResult(moves);
  playWin(); showConfetti(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, Math.max(0, 20 - moves), Date.now() - startTime, true);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('result-title')!.textContent = res.title;
  document.getElementById('big-stars')!.textContent = res.stars;
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
  speak('Kereta siap berangkat! Tut tut!');
}

initMuteButton();

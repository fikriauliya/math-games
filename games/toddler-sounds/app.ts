import { generateRound, checkAnswer, getEndResult, type SoundRound, type SoundItem } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-sounds';
let round = 0, correct = 0, locked = false, startTime = 0;
let currentRound: SoundRound;
const total = 10;

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  speechSynthesis.speak(u);
}

function playGameSound(item: SoundItem) {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = item.type;
    o.frequency.value = item.freq;
    g.gain.value = 0.3;
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + item.duration);
    o.start();
    o.stop(ctx.currentTime + item.duration);
    // Play twice for recognition
    setTimeout(() => {
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.connect(g2); g2.connect(ctx.destination);
      o2.type = item.type;
      o2.frequency.value = item.freq * 1.1;
      g2.gain.value = 0.3;
      g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + item.duration);
      o2.start();
      o2.stop(ctx.currentTime + item.duration);
    }, item.duration * 1000 + 100);
  } catch {}
}

(window as any).startGame = () => {
  startTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; correct = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
};

function nextRound() {
  if (round >= total) return endGame();
  round++; locked = false;
  document.getElementById('round-info')!.textContent = `${round}/${total}`;
  document.getElementById('stars')!.textContent = '⭐'.repeat(correct);

  currentRound = generateRound();
  document.getElementById('sound-desc')!.textContent = currentRound.target.soundDesc;

  const playBtn = document.getElementById('play-sound')!;
  playBtn.onclick = () => playGameSound(currentRound.target);
  setTimeout(() => playGameSound(currentRound.target), 300);

  const choicesEl = document.getElementById('choices')!;
  choicesEl.innerHTML = '';
  currentRound.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `${c.emoji}<span>${c.name}</span>`;
    btn.onclick = () => handleChoice(btn, c);
    choicesEl.appendChild(btn);
  });
}

function handleChoice(btn: HTMLButtonElement, selected: SoundItem) {
  if (locked) return;
  locked = true;
  if (checkAnswer(selected, currentRound.target)) {
    correct++;
    btn.classList.add('correct');
    playToddlerCorrect();
    speak('Benar!');
  } else {
    btn.classList.add('wrong');
    playToddlerWrong();
    speak('Coba lagi ya!');
  }
  setTimeout(nextRound, 1200);
}

function endGame() {
  const res = getEndResult(correct, total);
  playWin(); showConfetti(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, correct, Date.now() - startTime, true);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('result-title')!.textContent = res.title;
  document.getElementById('big-stars')!.textContent = res.stars;
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
  speak(correct >= 8 ? 'Hebat sekali!' : 'Bagus!');
}

initMuteButton();

import { generateRound, checkAnswer, getEndResult, type ShadowRound } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-shadows';
let round = 0, correct = 0, locked = false, startTime = 0;
const total = 10;

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  speechSynthesis.speak(u);
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

  const r = generateRound();
  document.getElementById('shadow-display')!.textContent = r.target.emoji;

  const choicesEl = document.getElementById('choices')!;
  choicesEl.innerHTML = '';
  r.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = c.emoji;
    btn.onclick = () => handleChoice(btn, c, r);
    choicesEl.appendChild(btn);
  });
}

function handleChoice(btn: HTMLButtonElement, selected: typeof generateRound extends () => infer R ? R extends { target: infer T } ? T : never : never, r: ShadowRound) {
  if (locked) return;
  locked = true;
  if (checkAnswer(selected, r.target)) {
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

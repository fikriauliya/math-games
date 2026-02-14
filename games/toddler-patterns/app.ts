import { generatePattern, checkAnswer, getEndResult, type PatternRound } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-patterns';
let startTime = 0;
let round = 0;
let correct = 0;
const total = 10;
let locked = false;

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
  round++;
  locked = false;
  document.getElementById('round-info')!.textContent = `${round}/${total}`;
  document.getElementById('stars')!.textContent = '⭐'.repeat(correct);

  const r = generatePattern();
  const seqEl = document.getElementById('sequence')!;
  seqEl.innerHTML = r.sequence.map(s => `<span class="seq-item">${s.emoji}</span>`).join('') + '<span class="seq-q">❓</span>';

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

function handleChoice(btn: HTMLButtonElement, selected: typeof generatePattern extends () => infer R ? R extends { answer: infer A } ? A : never : never, r: PatternRound) {
  if (locked) return;
  locked = true;
  if (checkAnswer(selected, r.answer)) {
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

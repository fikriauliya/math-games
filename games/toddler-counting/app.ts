import { generateQuestion, checkAnswer, getOptions, getResultText, TOTAL, type CountQuestion } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-counting';
let _start = 0;
let current: CountQuestion;
let score = 0;
let round = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function speak(text: string) {
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.3; speechSynthesis.speak(u); } catch {}
}

function startGame() {
  _start = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0;
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
  current = generateQuestion();
  
  const display = document.getElementById('objects-display')!;
  display.innerHTML = '';
  display.textContent = current.emoji.repeat(current.count);
  
  speak(`Ada berapa ${current.name}?`);

  const options = getOptions(current);
  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(opt);
    btn.onclick = () => pick(btn, opt);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.count);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    score++;
    renderStars();
    playToddlerCorrect();
    speak('Benar! Ada ' + current.count);
  } else {
    playToddlerWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (b.textContent === String(current.count)) b.classList.add('correct');
    });
    speak('Jawabannya ' + current.count);
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
  trackGameEnd(GAME_ID, score, Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
  if (setHighScore(GAME_ID, score) && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 REKOR BARU!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;

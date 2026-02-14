import { generateQuestion, checkSlices, calcScore, getGrade, TOTAL_ROUNDS, type Difficulty, type FractionQuestion } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'fraction-pizza';
let question: FractionQuestion;
let round = 0;
let correct = 0;
let diff: Difficulty = 'easy';
let selectedSlices: boolean[] = [];

function startGame() {
  diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  round = 0; correct = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) return endGame();
  question = generateQuestion(diff);
  selectedSlices = new Array(question.denominator).fill(false);

  document.getElementById('round-num')!.textContent = `${round + 1}/${TOTAL_ROUNDS}`;
  document.getElementById('fraction')!.textContent = question.display;
  document.getElementById('score')!.textContent = String(calcScore(correct));
  document.getElementById('instruction')!.textContent = `Tap ${question.numerator} of ${question.denominator} slices!`;

  renderPizza();
}

function renderPizza() {
  const container = document.getElementById('pizza')!;
  container.innerHTML = '';

  const size = 250;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `-${size/2 + 10} -${size/2 + 10} ${size + 20} ${size + 20}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.maxWidth = '300px';
  svg.style.maxHeight = '300px';

  const cx = 0, cy = 0, r = size / 2 - 5;
  const n = question.denominator;

  for (let i = 0; i < n; i++) {
    const startAngle = (i * 360 / n - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * 360 / n - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = 360 / n > 180 ? 1 : 0;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', selectedSlices[i] ? '#e53935' : '#ffcc80');
    path.setAttribute('stroke', '#8d6e63');
    path.setAttribute('stroke-width', '3');
    path.style.cursor = 'pointer';
    path.style.transition = 'fill 0.2s';

    path.addEventListener('click', () => {
      selectedSlices[i] = !selectedSlices[i];
      playClick();
      renderPizza();
    });

    svg.appendChild(path);
  }

  container.appendChild(svg);

  // Update selected count
  const count = selectedSlices.filter(Boolean).length;
  document.getElementById('selected-count')!.textContent = `${count}/${question.denominator} selected`;
}

function submitAnswer() {
  const count = selectedSlices.filter(Boolean).length;
  const isCorrect = checkSlices(count, question.numerator);

  if (isCorrect) {
    correct++;
    playCorrect();
    document.getElementById('pizza')!.classList.add('correct-flash');
  } else {
    playWrong();
    document.getElementById('pizza')!.classList.add('wrong-flash');
  }

  document.getElementById('score')!.textContent = String(calcScore(correct));

  setTimeout(() => {
    document.getElementById('pizza')!.classList.remove('correct-flash', 'wrong-flash');
    round++;
    nextRound();
  }, isCorrect ? 800 : 1200);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const score = calcScore(correct);
  const { grade, message } = getGrade(correct, TOTAL_ROUNDS);

  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = `${correct}/${TOTAL_ROUNDS}`;
  document.getElementById('r-score')!.textContent = String(score);

  playWin();
  setLastPlayed(GAME_ID);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (correct === TOTAL_ROUNDS) showConfetti();
}

document.getElementById('submit-btn')?.addEventListener('click', submitAnswer);

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `Your best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('#start .big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

import { generateQuestion, checkFactorSelection, isFactor, getResultText, TOTAL, type FactorQuestion } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'factor-finder';
let _analyticsStartTime = 0;
let round = 0, score = 0;
let current: FactorQuestion;
let selected = new Set<number>();

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; score = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  current = generateQuestion(round);
  selected.clear();
  document.getElementById('round-num')!.textContent = String(round + 1);
  document.getElementById('score')!.textContent = String(score);

  const grid = document.getElementById('gem-grid')!;
  grid.innerHTML = '';
  const submitBtn = document.getElementById('btn-submit')!;

  if (current.type === 'true-false') {
    document.getElementById('question-text')!.textContent = `Is ${current.tfTarget} a factor of ${current.number}?`;
    submitBtn.style.display = 'none';
    const div = document.createElement('div');
    div.className = 'tf-buttons';
    ['True', 'False'].forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'tf-btn';
      btn.textContent = label;
      btn.onclick = () => pickTF(btn, label === 'True');
      div.appendChild(btn);
    });
    grid.appendChild(div);
  } else {
    document.getElementById('question-text')!.textContent = `Find all factors of ${current.number}`;
    submitBtn.style.display = 'block';
    current.grid.forEach(n => {
      const btn = document.createElement('button');
      btn.className = 'gem-btn';
      btn.textContent = String(n);
      btn.onclick = () => toggleGem(btn, n);
      grid.appendChild(btn);
    });
  }
}

function toggleGem(btn: HTMLButtonElement, n: number) {
  playClick();
  if (selected.has(n)) { selected.delete(n); btn.classList.remove('selected'); }
  else { selected.add(n); btn.classList.add('selected'); }
}

function pickTF(btn: HTMLButtonElement, answer: boolean) {
  document.querySelectorAll<HTMLButtonElement>('.tf-btn').forEach(b => b.onclick = null);
  const correct = answer === current.tfAnswer;
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) { score++; playCorrect(); } else {
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.tf-btn').forEach(b => {
      if ((b.textContent === 'True') === current.tfAnswer) b.classList.add('correct');
    });
  }
  setTimeout(() => { round++; nextRound(); }, correct ? 800 : 1500);
}

(window as any).submitFactors = function() {
  const submitBtn = document.getElementById('btn-submit')!;
  submitBtn.style.display = 'none';
  document.querySelectorAll<HTMLButtonElement>('.gem-btn').forEach(b => b.onclick = null);

  const gridFactors = current.factors.filter(f => current.grid.includes(f));
  const result = checkFactorSelection([...selected], gridFactors);

  document.querySelectorAll<HTMLButtonElement>('.gem-btn').forEach(btn => {
    const n = Number(btn.textContent);
    const isF = gridFactors.includes(n);
    const isSel = selected.has(n);
    if (isF && isSel) btn.classList.add('correct');
    else if (!isF && isSel) btn.classList.add('wrong');
    else if (isF && !isSel) btn.classList.add('missed');
  });

  const correct = result.wrong === 0 && result.missed === 0;
  if (correct) { score++; playCorrect(); } else playWrong();
  setTimeout(() => { round++; nextRound(); }, 1500);
};

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${TOTAL}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

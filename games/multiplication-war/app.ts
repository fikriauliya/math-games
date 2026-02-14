import { generateRound, checkAnswer, getResult, TOTAL_ROUNDS, type WarRound } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'multiplication-war';
let _analyticsStartTime = 0;
let round = 0;
let p1Score = 0;
let p2Score = 0;
let currentRound: WarRound;
let currentPlayer = 1;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; p1Score = 0; p2Score = 0; currentPlayer = 1;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) return endGame();
  currentRound = generateRound();
  currentPlayer = 1;
  document.getElementById('round-num')!.textContent = String(round + 1);
  document.getElementById('p1-score')!.textContent = String(p1Score);
  document.getElementById('p2-score')!.textContent = String(p2Score);
  
  const c1 = document.getElementById('card1')!;
  const c2 = document.getElementById('card2')!;
  c1.textContent = String(currentRound.card1);
  c2.textContent = String(currentRound.card2);
  c1.style.animation = 'none'; c2.style.animation = 'none';
  requestAnimationFrame(() => { c1.style.animation = 'cardFlip 0.4s ease'; c2.style.animation = 'cardFlip 0.4s ease'; });

  document.getElementById('turn-label')!.textContent = 'First to tap the correct product wins!';
  renderChoices();
}

function renderChoices() {
  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  currentRound.choices.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(val);
    btn.onclick = () => pick(btn, val);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, currentRound.product);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    if (currentPlayer === 1) p1Score++; else p2Score++;
    playCorrect();
    document.getElementById('turn-label')!.textContent = `Player ${currentPlayer} scores!`;
    document.getElementById('p1-score')!.textContent = String(p1Score);
    document.getElementById('p2-score')!.textContent = String(p2Score);
    setTimeout(() => { round++; nextRound(); }, 1000);
  } else {
    playWrong();
    // Other player gets a chance
    if (currentPlayer === 1) {
      currentPlayer = 2;
      document.getElementById('turn-label')!.textContent = 'Wrong! Player 2\'s turn...';
      setTimeout(() => renderChoices(), 800);
    } else {
      // Both wrong, show answer and move on
      document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
        if (Number(b.textContent) === currentRound.product) b.classList.add('correct');
      });
      document.getElementById('turn-label')!.textContent = `Answer: ${currentRound.product}`;
      setTimeout(() => { round++; nextRound(); }, 1500);
    }
  }
}

function endGame() {
  const result = getResult(p1Score, p2Score);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.winner === 'Tie' ? "It's a Tie!" : `${result.winner} Wins!`;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  const totalScore = Math.max(p1Score, p2Score);
  trackGameEnd(GAME_ID, totalScore, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const isNew = setHighScore(GAME_ID, totalScore);
  if (isNew && totalScore > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (totalScore === TOTAL_ROUNDS) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${TOTAL_ROUNDS}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

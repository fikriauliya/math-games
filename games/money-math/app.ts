import { generateQuestion, checkAnswer, getResultText, TOTAL_ROUNDS, DENOM_EMOJI, type MoneyQuestion } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'money-math';
let _analyticsStartTime = 0;
let round: number, score: number, currentQ: MoneyQuestion;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; score = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) return endGame();
  currentQ = generateQuestion(round);
  document.getElementById('round-num')!.textContent = `Soal ${round + 1} / ${TOTAL_ROUNDS}`;
  document.getElementById('score-display')!.textContent = `Skor: ${score}`;

  const moneyDisplay = document.getElementById('money-display')!;
  if (currentQ.type === 'total') {
    moneyDisplay.innerHTML = currentQ.items.map(d => `<span class="money-item">${DENOM_EMOJI[d]} Rp${d.toLocaleString('id-ID')}</span>`).join('');
  } else {
    moneyDisplay.innerHTML = `<span class="money-item">💰</span>`;
  }
  document.getElementById('question-text')!.textContent = currentQ.display;

  const choicesEl = document.getElementById('choices')!;
  choicesEl.innerHTML = '';
  currentQ.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `Rp${c.toLocaleString('id-ID')}`;
    btn.onclick = () => pick(btn, c);
    choicesEl.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, currentQ.answer);
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) { score++; playCorrect(); }
  else {
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (b.textContent === `Rp${currentQ.answer.toLocaleString('id-ID')}`) b.classList.add('correct');
    });
  }
  setTimeout(() => { round++; nextRound(); }, correct ? 1000 : 1800);
}

function endGame() {
  const result = getResultText(score, TOTAL_ROUNDS);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 REKOR BARU!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL_ROUNDS) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Terbaik: ${best}/${TOTAL_ROUNDS}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

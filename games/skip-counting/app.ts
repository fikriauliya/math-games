import { generateRound, checkAnswer, getResultText, TOTAL_ROUNDS, type SkipRound } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'skip-counting';
let _analyticsStartTime = 0;
let round: number, score: number, currentRound: SkipRound, answerIdx: number;

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
  currentRound = generateRound(round);
  answerIdx = 0;
  document.getElementById('round-num')!.textContent = `Round ${round + 1} / ${TOTAL_ROUNDS}`;
  document.getElementById('score-display')!.textContent = `Score: ${score}`;
  document.getElementById('step-info')!.textContent = `Count by ${currentRound.step}s`;
  renderSequence();
  renderChoices();
}

function renderSequence() {
  const el = document.getElementById('sequence')!;
  el.innerHTML = '';
  currentRound.sequence.forEach((n, i) => {
    const stone = document.createElement('div');
    stone.className = 'stone' + (n === null ? ' blank' : '');
    stone.textContent = n === null ? '?' : String(n);
    stone.id = `stone-${i}`;
    el.appendChild(stone);
  });
}

function renderChoices() {
  const el = document.getElementById('choices')!;
  el.innerHTML = '';
  currentRound.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(c);
    btn.onclick = () => pick(c);
    el.appendChild(btn);
  });
}

function pick(value: number) {
  if (answerIdx >= currentRound.answers.length) return;
  const expected = currentRound.answers[answerIdx];
  const correct = checkAnswer(value, expected);

  // Find the blank stone for this answer
  let blankCount = 0;
  for (let i = 0; i < currentRound.sequence.length; i++) {
    if (currentRound.sequence[i] === null) {
      if (blankCount === answerIdx) {
        const stone = document.getElementById(`stone-${i}`)!;
        stone.textContent = String(correct ? expected : expected);
        stone.classList.remove('blank');
        stone.classList.add(correct ? 'filled' : 'wrong-fill');
        break;
      }
      blankCount++;
    }
  }

  if (correct) { score++; playCorrect(); } else { playWrong(); }
  answerIdx++;

  if (answerIdx >= currentRound.answers.length) {
    setTimeout(() => { round++; nextRound(); }, 1200);
  }
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
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL_ROUNDS) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${TOTAL_ROUNDS}`;
  el.style.cssText = 'color:rgba(0,0,0,0.5);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

import { genQuestion, checkAnswer, getWinner, getResultEmoji, TOTAL_QUESTIONS, type Question } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'math-duel';
let question: Question;
let qIdx = 0;
let p1Score = 0;
let p2Score = 0;
let answered = false;

function startGame() {
  qIdx = 0; p1Score = 0; p2Score = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextQ();
}

function nextQ() {
  if (qIdx >= TOTAL_QUESTIONS) return endGame();
  question = genQuestion();
  answered = false;

  document.getElementById('q-num')!.textContent = `${qIdx + 1}/${TOTAL_QUESTIONS}`;
  document.getElementById('p1-score')!.textContent = String(p1Score);
  document.getElementById('p2-score')!.textContent = String(p2Score);

  // P1 side (top, rotated 180deg)
  renderChoices('p1-question', 'p1-choices', 1);
  // P2 side (bottom, normal)
  renderChoices('p2-question', 'p2-choices', 2);
}

function renderChoices(qId: string, choicesId: string, player: number) {
  document.getElementById(qId)!.textContent = question.text + ' = ?';
  const div = document.getElementById(choicesId)!;
  div.innerHTML = '';
  question.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'duel-btn';
    btn.textContent = String(c);
    btn.onclick = () => answer(c, btn, player);
    div.appendChild(btn);
  });
}

function answer(val: number, btn: HTMLButtonElement, player: number) {
  if (answered) return;
  answered = true;
  const isCorrect = checkAnswer(val, question.answer);

  // Disable all buttons
  document.querySelectorAll<HTMLButtonElement>('.duel-btn').forEach(b => b.onclick = null);

  if (isCorrect) {
    btn.classList.add('correct');
    if (player === 1) p1Score++;
    else p2Score++;
    playCorrect();

    // Flash the scorer's side
    const side = player === 1 ? 'p1-side' : 'p2-side';
    document.getElementById(side)!.classList.add('scored');
    setTimeout(() => document.getElementById(side)!.classList.remove('scored'), 500);
  } else {
    btn.classList.add('wrong');
    playWrong();
  }

  // Show correct answer on both sides
  document.querySelectorAll<HTMLButtonElement>('.duel-btn').forEach(b => {
    if (parseInt(b.textContent!) === question.answer) b.classList.add('correct');
  });

  document.getElementById('p1-score')!.textContent = String(p1Score);
  document.getElementById('p2-score')!.textContent = String(p2Score);

  setTimeout(() => { qIdx++; nextQ(); }, 1200);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');

  const winner = getWinner(p1Score, p2Score);
  const emoji = getResultEmoji(p1Score, p2Score);

  document.getElementById('result-emoji')!.textContent = emoji;
  document.getElementById('result-title')!.textContent = winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`;
  document.getElementById('result-p1')!.textContent = String(p1Score);
  document.getElementById('result-p2')!.textContent = String(p2Score);

  playWin();
  setLastPlayed(GAME_ID);
  const maxScore = Math.max(p1Score, p2Score);
  setHighScore(GAME_ID, maxScore);
  if (p1Score === TOTAL_QUESTIONS || p2Score === TOTAL_QUESTIONS) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;

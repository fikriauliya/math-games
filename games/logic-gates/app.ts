import { generatePuzzle, checkAnswer, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'logic-gates';
let _startTime = 0;
let puzzle: Puzzle;
let score = 0;
let round = 0;
const TOTAL_ROUNDS = 10;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0;
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) {
    endGame(); return;
  }
  round++;
  puzzle = generatePuzzle();
  show('game-screen');
  document.getElementById('question')!.textContent = puzzle.description;
  document.getElementById('score-label')!.textContent = `Score: ${score}/${TOTAL_ROUNDS} | Round ${round}/${TOTAL_ROUNDS}`;
}

function answer(val: boolean) {
  if (checkAnswer(puzzle, val)) {
    score++;
    playCorrect();
  } else {
    playWrong();
  }
  document.getElementById('score-label')!.textContent = `Score: ${score}/${TOTAL_ROUNDS} | Round ${round}/${TOTAL_ROUNDS}`;
  setTimeout(nextRound, 600);
}

function endGame() {
  const elapsed = Date.now() - _startTime;
  const best = getHighScore(GAME_ID);
  if (!best || score > best) setHighScore(GAME_ID, score);
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, elapsed, score === TOTAL_ROUNDS);
  if (score === TOTAL_ROUNDS) { playWin(); showConfetti(); }
  document.getElementById('result-emoji')!.textContent = score >= 8 ? '🧠' : score >= 5 ? '⚡' : '🔌';
  document.getElementById('result-title')!.textContent = `${score} / ${TOTAL_ROUNDS}`;
  document.getElementById('result-sub')!.textContent = score === TOTAL_ROUNDS ? 'Perfect logic!' : 'Keep practicing!';
  show('result-screen');
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
}

(window as any).startGame = startGame;
(window as any).answer = answer;
initMuteButton();

import { getPuzzle, getPuzzleCount, checkSolution, getSegments, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'match-stick';
let _startTime = 0;
let puzzle: Puzzle;
let score = 0;
let round = 0;
const TOTAL = 5;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0;
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) { endGame(); return; }
  puzzle = getPuzzle(round);
  round++;
  show('game-screen');
  renderEquation(puzzle.broken);
  document.getElementById('hint-text')!.textContent = puzzle.hint;
  document.getElementById('answer-input')!.setAttribute('value', '');
  (document.getElementById('answer-input') as HTMLInputElement).value = '';
  document.getElementById('round-label')!.textContent = `Round ${round}/${TOTAL} | Score: ${score}`;
}

function renderEquation(eq: string) {
  const container = document.getElementById('equation')!;
  container.innerHTML = '';
  for (const ch of eq) {
    if (ch === '+' || ch === '-' || ch === '=') {
      const span = document.createElement('span');
      span.className = 'op';
      span.textContent = ch;
      container.appendChild(span);
    } else {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 60 100');
      svg.setAttribute('class', 'digit');
      const segs = getSegments(ch);
      const segPaths = [
        'M10,5 L50,5 L45,10 L15,10 Z',      // top
        'M52,8 L52,45 L47,40 L47,13 Z',       // topRight
        'M52,55 L52,92 L47,87 L47,60 Z',      // bottomRight
        'M10,95 L50,95 L45,90 L15,90 Z',      // bottom
        'M8,55 L8,92 L13,87 L13,60 Z',        // bottomLeft
        'M8,8 L8,45 L13,40 L13,13 Z',         // topLeft
        'M10,50 L50,50 L45,55 L15,55 Z',      // middle (also 45)
      ];
      segs.forEach((on, i) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', segPaths[i]);
        path.setAttribute('fill', on ? '#ff6f00' : 'rgba(255,255,255,0.1)');
        svg.appendChild(path);
      });
      container.appendChild(svg);
    }
  }
}

function submitAnswer() {
  const input = (document.getElementById('answer-input') as HTMLInputElement).value.trim();
  playClick();
  if (checkSolution(puzzle, input)) {
    score++;
    playCorrect();
  } else {
    playWrong();
  }
  setTimeout(nextRound, 800);
}

function endGame() {
  const elapsed = Date.now() - _startTime;
  const best = getHighScore(GAME_ID);
  if (!best || score > best) setHighScore(GAME_ID, score);
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, elapsed, score === TOTAL);
  if (score === TOTAL) { playWin(); showConfetti(); }
  document.getElementById('result-emoji')!.textContent = score === TOTAL ? '🔥' : '🔶';
  document.getElementById('result-title')!.textContent = `${score} / ${TOTAL}`;
  document.getElementById('result-sub')!.textContent = score === TOTAL ? 'Perfect matchstick master!' : 'Keep trying!';
  show('result-screen');
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).submitAnswer = submitAnswer;

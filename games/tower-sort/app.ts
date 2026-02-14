import { initState, moveDisc, isWon, getResultText, DISC_COLORS, type TowerState, type Difficulty } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'tower-sort';
let _analyticsStartTime = 0;
let state: TowerState;
let selectedPeg: number | null = null;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  const diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  state = initState(diff);
  selectedPeg = null;
  show('game-screen');
  render();
}

function render() {
  document.getElementById('move-count')!.textContent = `Moves: ${state.moves}`;
  document.getElementById('min-moves')!.textContent = `Min: ${state.minMoves}`;

  for (let p = 0; p < 3; p++) {
    const pegEl = document.getElementById(`peg-${p}`)!;
    const discsEl = pegEl.querySelector('.peg-discs')!;
    discsEl.innerHTML = '';
    pegEl.classList.toggle('selected', p === selectedPeg);

    state.pegs[p].forEach(disc => {
      const d = document.createElement('div');
      d.className = 'disc';
      const widthPct = 30 + (disc / state.numDiscs) * 70;
      d.style.width = widthPct + '%';
      d.style.background = DISC_COLORS[disc - 1] || '#888';
      discsEl.appendChild(d);
    });
  }
}

function pegClick(pegIdx: number) {
  if (selectedPeg === null) {
    if (state.pegs[pegIdx].length === 0) return;
    selectedPeg = pegIdx;
    playClick();
  } else {
    if (selectedPeg === pegIdx) {
      selectedPeg = null;
    } else {
      const newState = moveDisc(state, selectedPeg, pegIdx);
      if (newState) {
        state = newState;
        playCorrect();
        if (isWon(state)) { endGame(); return; }
      } else {
        playWrong();
      }
      selectedPeg = null;
    }
  }
  render();
}

function endGame() {
  const result = getResultText(state.moves, state.minMoves);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  // Use inverted score (fewer moves = higher score)
  const score = Math.max(0, state.minMoves * 3 - state.moves);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (state.moves === state.minMoves) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).pegClick = pegClick;

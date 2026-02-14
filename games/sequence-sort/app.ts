import { createGameSync, placeItem, getRemainingItems, getModeLabel, type GameState } from './logic';
import { playCorrect, playWrong, playClick, playWin, initMuteButton } from '../../lib/sounds';
import { setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'sequence-sort';
let state: GameState;

function startGame() {
  state = createGameSync(10);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  renderRound();
}

function renderRound() {
  if (state.completed) return onWin();
  const round = state.rounds[state.currentRound];
  document.getElementById('round-num')!.textContent = `Round ${state.currentRound + 1}/${state.totalRounds}`;
  document.getElementById('mode-label')!.textContent = getModeLabel(round.mode);
  document.getElementById('score')!.textContent = String(state.score);

  // Render placed slots
  const slotsEl = document.getElementById('slots')!;
  slotsEl.innerHTML = '';
  for (let i = 0; i < round.correctOrder.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    if (i < state.placed.length) {
      slot.textContent = state.placed[i];
      slot.classList.add('filled');
    } else if (i === state.placed.length) {
      slot.textContent = '?';
      slot.classList.add('next');
    }
    slotsEl.appendChild(slot);
  }

  // Render remaining items
  const itemsEl = document.getElementById('items')!;
  itemsEl.innerHTML = '';
  const remaining = getRemainingItems(state);
  for (const item of remaining) {
    const btn = document.createElement('button');
    btn.className = 'item-btn';
    btn.textContent = item;
    btn.onclick = () => {
      const { state: newState, correct } = placeItem(state, item);
      if (correct) {
        playCorrect();
        state = newState;
        renderRound();
      } else {
        playWrong();
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 400);
      }
    };
    itemsEl.appendChild(btn);
  }
}

function onWin() {
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);
  const isNew = setHighScore(GAME_ID, state.score);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('r-score')!.textContent = String(state.score);
  document.getElementById('r-total')!.textContent = String(state.rounds.reduce((s, r) => s + r.correctOrder.length, 0));
  document.getElementById('r-record')!.textContent = isNew ? '🏆 NEW RECORD!' : '';
}

(window as any).startGame = startGame;
initMuteButton();

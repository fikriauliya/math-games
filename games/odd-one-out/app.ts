import { createGameSync, selectItem, type GameState } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'odd-one-out';
let state: GameState;

function startGame() {
  state = createGameSync(12);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  renderRound();
}

function renderRound() {
  if (state.completed) return onWin();
  const round = state.rounds[state.currentRound];
  document.getElementById('round-num')!.textContent = `${state.currentRound + 1}/${state.totalRounds}`;
  document.getElementById('score')!.textContent = String(state.score);
  document.getElementById('hint')!.textContent = round.hint;

  const grid = document.getElementById('cards')!;
  grid.innerHTML = '';
  round.items.forEach((item, i) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.textContent = item;
    card.onclick = () => {
      const { state: newState, correct } = selectItem(state, i);
      if (correct) {
        playCorrect();
        card.classList.add('correct');
      } else {
        playWrong();
        card.classList.add('wrong');
        // Highlight the correct one
        grid.children[round.oddIndex]?.classList.add('correct');
      }
      state = newState;
      setTimeout(() => renderRound(), 800);
    };
    grid.appendChild(card);
  });
}

function onWin() {
  const perfect = state.score === state.totalRounds;
  if (perfect) showConfetti();
  playWin();
  setLastPlayed(GAME_ID);
  const isNew = setHighScore(GAME_ID, state.score);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('r-score')!.textContent = `${state.score}/${state.totalRounds}`;
  document.getElementById('r-record')!.textContent = isNew ? '🏆 NEW RECORD!' : '';
  document.getElementById('r-msg')!.textContent = perfect ? '🎉 PERFECT!' : state.score >= 9 ? '⭐ Great job!' : '💪 Keep trying!';
}

(window as any).startGame = startGame;
initMuteButton();

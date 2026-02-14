import { createGameState, addToSequence, checkInput, getResultText, type Color, type GameState } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'simon-says';
let _analyticsStartTime = 0;
let state: GameState;
let inputEnabled = false;

// Tone frequencies for each color
const TONES: Record<Color, number> = { red: 329, blue: 440, green: 554, yellow: 659 };

function playTone(color: Color) {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = TONES[color];
    g.gain.value = 0.3;
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    o.start(); o.stop(ctx.currentTime + 0.3);
  } catch {}
}

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  state = createGameState();
  show('game-screen');
  nextRound();
}

function nextRound() {
  state.sequence = addToSequence(state.sequence);
  state.playerIndex = 0;
  state.score = state.sequence.length;
  document.getElementById('round-num')!.textContent = String(state.sequence.length);
  document.getElementById('status-label')!.textContent = 'Watch...';
  setButtonsEnabled(false);
  playSequence();
}

function setButtonsEnabled(enabled: boolean) {
  inputEnabled = enabled;
  document.querySelectorAll<HTMLButtonElement>('.simon-btn').forEach(b => b.disabled = !enabled);
}

function flashButton(color: Color, duration = 400) {
  const btn = document.querySelector(`.simon-btn.${color}`) as HTMLElement;
  btn.classList.add('active');
  playTone(color);
  setTimeout(() => btn.classList.remove('active'), duration);
}

function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= state.sequence.length) {
      clearInterval(interval);
      document.getElementById('status-label')!.textContent = 'Your turn!';
      setButtonsEnabled(true);
      return;
    }
    flashButton(state.sequence[i]);
    i++;
  }, 600);
}

function handlePress(color: Color) {
  if (!inputEnabled) return;
  flashButton(color, 200);
  
  const result = checkInput(state, color);
  if (!result.correct) {
    inputEnabled = false;
    playWrong();
    document.getElementById('status-label')!.textContent = 'Wrong!';
    setTimeout(endGame, 1000);
    return;
  }

  state.playerIndex++;
  playCorrect();

  if (result.roundComplete) {
    setButtonsEnabled(false);
    document.getElementById('status-label')!.textContent = 'Correct! ✨';
    setTimeout(nextRound, 1000);
  }
}

function endGame() {
  const streak = state.sequence.length - 1;
  const result = getResultText(streak);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, streak, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const isNew = setHighScore(GAME_ID, streak);
  if (isNew && streak > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (streak >= 10) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best streak: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).handlePress = handlePress;

import { MOVES, MAX_LEVEL, generateSequence, checkMove, getResultText } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-dance';
let _start = 0;
let level = 0;
let sequence: number[] = [];
let playerStep = 0;
let showingSequence = false;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function speak(text: string) {
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.3; speechSynthesis.speak(u); } catch {}
}

function startGame() {
  _start = Date.now();
  trackGameStart(GAME_ID);
  level = 0;
  show('game-screen');
  nextLevel();
}

function nextLevel() {
  if (level >= MAX_LEVEL) return endGame();
  sequence = generateSequence(level);
  playerStep = 0;
  document.getElementById('level-info')!.textContent = `Level ${level + 1}`;
  document.getElementById('instruction')!.textContent = 'Perhatikan gerakannya!';
  setButtonsEnabled(false);
  showSequence();
}

function showSequence() {
  showingSequence = true;
  const display = document.getElementById('dance-display')!;
  let i = 0;

  function showNext() {
    if (i >= sequence.length) {
      display.textContent = '🎵';
      document.getElementById('instruction')!.textContent = 'Giliranmu! Ikuti gerakannya!';
      speak('Giliranmu!');
      setButtonsEnabled(true);
      showingSequence = false;
      return;
    }
    const move = MOVES[sequence[i]];
    display.textContent = move.emoji;
    display.style.animation = 'none';
    requestAnimationFrame(() => display.style.animation = 'pop 0.5s ease');
    speak(move.name);
    playClick();
    i++;
    setTimeout(showNext, 1200);
  }

  setTimeout(showNext, 500);
}

function setButtonsEnabled(enabled: boolean) {
  document.querySelectorAll<HTMLButtonElement>('.move-btn').forEach(b => {
    b.disabled = !enabled;
    b.style.opacity = enabled ? '1' : '0.5';
  });
}

function tapMove(moveIndex: number) {
  if (showingSequence) return;
  const correct = checkMove(moveIndex, sequence[playerStep]);
  const display = document.getElementById('dance-display')!;

  if (correct) {
    display.textContent = MOVES[moveIndex].emoji;
    playToddlerCorrect();
    playerStep++;
    if (playerStep >= sequence.length) {
      speak('Hebat!');
      level++;
      setTimeout(nextLevel, 1000);
    }
  } else {
    playToddlerWrong();
    display.textContent = '😅';
    speak('Coba lagi nanti ya!');
    // Show correct move
    setTimeout(() => {
      display.textContent = MOVES[sequence[playerStep]].emoji;
    }, 500);
    setTimeout(() => endGame(), 2000);
  }
}

function endGame() {
  const result = getResultText(level, MAX_LEVEL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, level, Date.now() - _start, level >= MAX_LEVEL);
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
  if (setHighScore(GAME_ID, level) && level > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 REKOR BARU!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (level >= MAX_LEVEL) showConfetti();
}

// Create move buttons
const btnContainer = document.getElementById('move-buttons')!;
MOVES.forEach((move, i) => {
  const btn = document.createElement('button');
  btn.className = 'move-btn';
  btn.innerHTML = `<span class="move-emoji">${move.emoji}</span>`;
  btn.onclick = () => tapMove(i);
  btnContainer.appendChild(btn);
});

initMuteButton();
(window as any).startGame = startGame;

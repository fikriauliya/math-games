import { createBoard, checkMatch, isComplete, getResultText, THEMES, type Card } from './logic';
import { playClick, playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'memory-cards';
let _start = 0, cards: Card[], flips = 0, flipped: number[] = [], locked = false, timer: any, seconds = 0, theme = 'animals';

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function selectTheme(t: string) { theme = t; startGame(); }

function startGame() {
  _start = Date.now(); trackGameStart(GAME_ID);
  cards = createBoard(theme); flips = 0; flipped = []; locked = false; seconds = 0;
  clearInterval(timer);
  timer = setInterval(() => { seconds++; document.getElementById('timer')!.textContent = `⏱ ${seconds}s`; }, 1000);
  show('game-screen');
  document.getElementById('flip-count')!.textContent = `Flips: 0`;
  render();
}

function render() {
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  cards.forEach((card, i) => {
    const el = document.createElement('button');
    el.className = 'card' + (card.flipped || card.matched ? ' flipped' : '') + (card.matched ? ' matched' : '');
    el.innerHTML = card.flipped || card.matched ? `<span class="card-face">${card.emoji}</span>` : '<span class="card-back">?</span>';
    if (!card.matched && !card.flipped) el.onclick = () => flipCard(i);
    grid.appendChild(el);
  });
}

function flipCard(index: number) {
  if (locked || cards[index].flipped || cards[index].matched) return;
  cards[index].flipped = true;
  flipped.push(index);
  flips++;
  document.getElementById('flip-count')!.textContent = `Flips: ${flips}`;
  playClick();
  render();

  if (flipped.length === 2) {
    locked = true;
    const [a, b] = flipped;
    if (checkMatch(cards[a], cards[b])) {
      cards[a].matched = cards[b].matched = true;
      playCorrect();
      flipped = []; locked = false;
      render();
      if (isComplete(cards)) { clearInterval(timer); endGame(); }
    } else {
      playWrong();
      setTimeout(() => {
        cards[a].flipped = cards[b].flipped = false;
        flipped = []; locked = false;
        render();
      }, 800);
    }
  }
}

function endGame() {
  const r = getResultText(flips, seconds);
  document.getElementById('result-emoji')!.textContent = r.emoji;
  document.getElementById('result-title')!.textContent = r.title;
  document.getElementById('result-sub')!.textContent = r.sub;
  show('result-screen'); playWin(); showConfetti(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, Math.max(0, 200 - flips), Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const score = Math.max(0, 200 - flips);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;'; document.getElementById('result-title')!.after(el); }
}

initMuteButton();
(window as any).startGame = startGame;
(window as any).selectTheme = selectTheme;

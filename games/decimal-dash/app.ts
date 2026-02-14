import { generateRound, checkPlacement, checkCompare, getResultText, TOTAL_ROUNDS, type Round, type PlaceRound, type CompareRound } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'decimal-dash';
let _analyticsStartTime = 0;
let round: number;
let score: number;
let currentRound: Round;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
}

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
  document.getElementById('round-num')!.textContent = `Round ${round + 1} / ${TOTAL_ROUNDS}`;
  document.getElementById('score-display')!.textContent = `Score: ${score}`;

  const area = document.getElementById('play-area')!;
  area.innerHTML = '';

  if (currentRound.type === 'compare') {
    renderCompare(currentRound, area);
  } else {
    renderPlace(currentRound, area);
  }
}

function renderCompare(r: CompareRound, area: HTMLElement) {
  area.innerHTML = `
    <div class="compare-prompt">Which is bigger?</div>
    <div class="compare-row">
      <button class="compare-btn" id="btn-a">${r.a}</button>
      <span class="vs-text">VS</span>
      <button class="compare-btn" id="btn-b">${r.b}</button>
    </div>
    <button class="compare-eq-btn" id="btn-eq">= Equal</button>
  `;
  document.getElementById('btn-a')!.onclick = () => answer('a', r);
  document.getElementById('btn-b')!.onclick = () => answer('b', r);
  document.getElementById('btn-eq')!.onclick = () => answer('equal', r);
}

function answer(choice: 'a' | 'b' | 'equal', r: CompareRound) {
  const correct = checkCompare(choice, r.answer);
  if (correct) { score++; playCorrect(); } else { playWrong(); }
  const feedback = document.createElement('div');
  feedback.className = correct ? 'feedback correct' : 'feedback wrong';
  feedback.textContent = correct ? '✓ Correct!' : `✗ Answer: ${r.answer === 'a' ? r.a : r.answer === 'b' ? r.b : 'Equal'}`;
  document.getElementById('play-area')!.appendChild(feedback);
  setTimeout(() => { round++; nextRound(); }, 1200);
}

function renderPlace(r: PlaceRound, area: HTMLElement) {
  area.innerHTML = `
    <div class="place-prompt">Place <strong>${r.target}</strong> on the number line!</div>
    <div class="number-line-wrap">
      <div class="number-line" id="number-line">
        <div class="nl-label nl-min">${r.min}</div>
        <div class="nl-label nl-max">${r.max}</div>
        <div class="nl-marker" id="nl-marker" style="left:50%">🚀</div>
        <div class="nl-target" id="nl-target" style="display:none"></div>
      </div>
    </div>
    <button class="btn-confirm" id="btn-confirm">Lock In! 🔒</button>
  `;
  const line = document.getElementById('number-line')!;
  const marker = document.getElementById('nl-marker')!;
  let placed = 0.5;

  const updateMarker = (e: MouseEvent | TouchEvent) => {
    const rect = line.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    placed = pct;
    marker.style.left = (pct * 100) + '%';
  };

  line.addEventListener('mousedown', (e) => { updateMarker(e); line.onmousemove = updateMarker as any; });
  document.addEventListener('mouseup', () => { line.onmousemove = null; });
  line.addEventListener('touchstart', (e) => { updateMarker(e); }, { passive: true });
  line.addEventListener('touchmove', (e) => { updateMarker(e); }, { passive: true });

  document.getElementById('btn-confirm')!.onclick = () => {
    const result = checkPlacement(placed, r.target);
    if (result.correct) { score++; playCorrect(); } else { playWrong(); }
    // Show target position
    const target = document.getElementById('nl-target')!;
    target.style.display = 'block';
    target.style.left = (r.target * 100) + '%';
    const feedback = document.createElement('div');
    feedback.className = result.correct ? 'feedback correct' : 'feedback wrong';
    feedback.textContent = result.correct ? `✓ ${result.accuracy}% accuracy!` : `✗ ${result.accuracy}% accuracy`;
    area.appendChild(feedback);
    setTimeout(() => { round++; nextRound(); }, 1500);
  };
}

function endGame() {
  const result = getResultText(score, TOTAL_ROUNDS);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
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
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;

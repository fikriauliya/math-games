import { generateRecipe, checkRecipeAnswer, calcScore, getGrade, type Recipe } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'ratio-recipe';
let recipe: Recipe;
let round = 0, totalCorrect = 0, totalQ = 0, score = 0;
let diff = 'medium';
let startTime = 0;
const ROUNDS = 5;

function startGame() {
  diff = (document.getElementById('diff') as HTMLSelectElement).value;
  round = totalCorrect = totalQ = score = 0;
  startTime = Date.now();
  trackGameStart(GAME_ID, diff);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
}

function nextRound() {
  if (round >= ROUNDS) return endGame();
  round++;
  recipe = generateRecipe(diff);
  document.getElementById('recipe-name')!.textContent = recipe.name;
  document.getElementById('serves-info')!.textContent = `Recipe serves ${recipe.servesOriginal}. Make it for ${recipe.servesTarget}!`;
  document.getElementById('round')!.textContent = `${round}/${ROUNDS}`;

  const container = document.getElementById('ingredients')!;
  container.innerHTML = '';
  recipe.ingredients.forEach((ing, i) => {
    const row = document.createElement('div');
    row.className = 'ingredient-row';
    row.innerHTML = `
      <span class="ing-original">${ing.amount} ${ing.unit} ${ing.name}</span>
      <span class="arrow">→</span>
      <input type="number" class="ing-input" data-index="${i}" step="0.5" min="0" placeholder="?" inputmode="decimal">
      <span class="ing-unit">${ing.unit}</span>
    `;
    container.appendChild(row);
  });
}

function submitAnswers() {
  const inputs = document.querySelectorAll<HTMLInputElement>('.ing-input');
  const userAnswers = Array.from(inputs).map(i => parseFloat(i.value) || 0);
  const result = checkRecipeAnswer(userAnswers, recipe.answers);

  inputs.forEach((input, i) => {
    const correct = Math.abs(userAnswers[i] - recipe.answers[i]) < 0.01;
    input.style.borderColor = correct ? '#6bcb77' : '#ff6b6b';
    if (!correct) {
      const hint = document.createElement('span');
      hint.className = 'hint';
      hint.textContent = ` = ${recipe.answers[i]}`;
      input.parentElement!.appendChild(hint);
    }
  });

  totalCorrect += result.correct;
  totalQ += result.total;
  score += calcScore(result.correct, result.total, round);
  document.getElementById('score')!.textContent = String(score);

  result.correct === result.total ? playCorrect() : playWrong();
  setTimeout(nextRound, 1500);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const { grade, message } = getGrade(totalCorrect, totalQ);
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = `${totalCorrect}/${totalQ}`;
  document.getElementById('r-score')!.textContent = String(score);
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - startTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (setHighScore(GAME_ID, score)) {
    const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (totalCorrect === totalQ) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `🏆 Best: ${best}`; el.style.cssText = 'font-size:1.1rem;opacity:0.7;'; document.querySelector('.big-btn')?.before(el); }
initMuteButton();
(window as any).startGame = startGame;
(window as any).submitAnswers = submitAnswers;

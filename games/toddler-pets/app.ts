import { createPet, applyAction, getPetMood, getMoodText, ACTIONS, type PetState, type PetAction } from './logic';
import { playToddlerCorrect, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { trackGameStart, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-pets';
let pet: PetState;

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  speechSynthesis.speak(u);
}

function init() {
  trackGameStart(GAME_ID);
  setLastPlayed(GAME_ID);
  pet = createPet();
  render();

  const actionsEl = document.getElementById('actions')!;
  ACTIONS.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.textContent = `${a.emoji} ${a.label}`;
    btn.onclick = () => doAction(a.action, a.label);
    actionsEl.appendChild(btn);
  });

  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
}

function doAction(action: PetAction, label: string) {
  pet = applyAction(pet, action);
  playToddlerCorrect();
  speak(label);

  const petEl = document.getElementById('pet-emoji')!;
  const anim = action === 'feed' ? 'bounce' : action === 'wash' ? 'shake' : 'spin';
  petEl.classList.remove('bounce', 'shake', 'spin');
  void petEl.offsetWidth;
  petEl.classList.add(anim);
  setTimeout(() => petEl.classList.remove(anim), 600);

  render();
}

function render() {
  document.getElementById('pet-emoji')!.textContent = pet.emoji;
  document.getElementById('pet-name')!.textContent = pet.name;
  document.getElementById('pet-mood')!.textContent = getPetMood(pet);
  document.getElementById('mood-text')!.textContent = getMoodText(pet);
  (document.getElementById('bar-hunger')! as HTMLElement).style.width = pet.hunger + '%';
  (document.getElementById('bar-clean')! as HTMLElement).style.width = pet.clean + '%';
  (document.getElementById('bar-happy')! as HTMLElement).style.width = pet.happy + '%';
}

initMuteButton();
init();

const PREFIX = 'mathgames-';

export function getHighScore(gameId: string): number {
  return parseInt(localStorage.getItem(`${PREFIX}${gameId}-highscore`) || '0') || 0;
}

export function setHighScore(gameId: string, score: number): boolean {
  const prev = getHighScore(gameId);
  if (score > prev) {
    localStorage.setItem(`${PREFIX}${gameId}-highscore`, String(score));
    return true;
  }
  return false;
}

export function getLastPlayed(gameId: string): string | null {
  return localStorage.getItem(`${PREFIX}${gameId}-lastplayed`);
}

export function setLastPlayed(gameId: string): void {
  localStorage.setItem(`${PREFIX}${gameId}-lastplayed`, new Date().toISOString());
}

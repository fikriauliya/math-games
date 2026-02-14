import { Effect } from 'effect';

export interface Block {
  size: number;
  color: string;
  label: string;
}

export const BLOCK_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4'];

export const createBlocksEffect = (count: number): Effect.Effect<Block[]> =>
  Effect.sync(() => {
    const blocks: Block[] = [];
    for (let i = 0; i < count; i++) {
      blocks.push({
        size: count - i,
        color: BLOCK_COLORS[i % BLOCK_COLORS.length],
        label: `${count - i}`,
      });
    }
    return blocks.sort(() => Math.random() - 0.5);
  });

export function createBlocks(count: number): Block[] {
  return Effect.runSync(createBlocksEffect(count));
}

export function swapBlocks(blocks: Block[], a: number, b: number): Block[] {
  const result = [...blocks];
  [result[a], result[b]] = [result[b], result[a]];
  return result;
}

export function isCorrectOrder(blocks: Block[]): boolean {
  for (let i = 0; i < blocks.length - 1; i++) {
    if (blocks[i].size < blocks[i + 1].size) return false;
  }
  return true;
}

export function getEndResult(moves: number): { title: string; stars: string } {
  if (moves <= 8) return { title: '🎉 Hebat Sekali!', stars: '⭐⭐⭐' };
  if (moves <= 15) return { title: '⭐ Bagus!', stars: '⭐⭐' };
  return { title: '💪 Selesai!', stars: '⭐' };
}

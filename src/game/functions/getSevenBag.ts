import { BlockType } from '../types';

/**
 * The random generator uses the **7 bag** mechanism to determine the sequence of blocks during the
 * game.
 *
 * @returns Array of all possible block types in a random order
 */
export default function getSevenBag(): BlockType[] {
  const values: BlockType[] = Object.values(BlockType);
  return values.sort(() => Math.random() - 0.5);
}

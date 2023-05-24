// Import
import { BlockType } from '../types';

// Get random block function
const getRandomBlock = (): BlockType => {
  const values: BlockType[] = Object.values(BlockType);
  return values[Math.floor(Math.random() * values.length)];
};

// Export
export default getRandomBlock;

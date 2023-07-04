// Import
import { BlockType } from '../types';

// Get seven-bag blocks function
const getSevenBag = (): BlockType[] => {
  const values: BlockType[] = Object.values(BlockType);
  return values.sort(() => Math.random() - 0.5);
};

// Export
export default getSevenBag;

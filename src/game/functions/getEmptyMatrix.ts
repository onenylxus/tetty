// Import
import { BoardMatrix, EmptyType } from '../types';

// Get empty matrix function
const getEmptyMatrix = (): BoardMatrix => {
  const width = 10;
  const height = 20; // 24 with buffer
  return [...Array(height).keys()].map(() => Array(width).fill(EmptyType.Empty));
};

// Export
export default getEmptyMatrix;

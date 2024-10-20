// Import
import { BoardMatrix, NonBlockType, Shape } from '../types';

// Collision detection function
const collides = (
  matrix: BoardMatrix,
  dropShape: Shape,
  dropRow: number,
  dropColumn: number
): boolean => {
  let result = false;
  dropShape.forEach((row, j) => {
    row.forEach((cell, i) => {
      const u: number = dropColumn + i;
      const v: number = dropRow + j;
      if (
        cell &&
        (v >= matrix.length ||
          u < 0 ||
          u >= matrix[0].length ||
          matrix[v][u] !== NonBlockType.Empty)
      ) {
        result = true;
      }
    });
  });
  return result;
};

// Export
export default collides;

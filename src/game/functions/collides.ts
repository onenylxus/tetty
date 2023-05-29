// Import
import { BoardMatrix, Shape, EmptyType } from '../types';

// Collision detection function
const collides = (matrix: BoardMatrix, dropShape: Shape, dropRow: number, dropColumn: number): boolean => {
  dropShape.forEach((row, j) => {
    row.forEach((cell, i) => {
      const u: number = dropColumn + i;
      const v: number = dropRow + j;
      if (cell && (v >= matrix.length || u < 0 || u >= matrix[0].length || matrix[v][u] !== EmptyType.Empty)) {
        return true;
      }
    });
  });
  return false;
};

// Export
export default collides;

// Import
import { BoardMatrix, CellType, Shape } from '../types';

// Add shape to matrix function
const addShape = (matrix: BoardMatrix, dropBlock: CellType, dropShape: Shape, dropRow: number, dropColumn: number): void => {
  dropShape.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (cell) {
        matrix[dropRow + j][dropColumn + i] = dropBlock;
      }
    });
  });
};

// Export
export default addShape;

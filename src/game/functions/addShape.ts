// Import
import { BlockType, BoardMatrix, Shape } from '../types';

// Add shape to matrix function
const addShape = (matrix: BoardMatrix, dropBlock: BlockType, dropShape: Shape, dropRow: number, dropColumn: number): void => {
  dropShape.filter((row) => row.some((cell) => cell)).forEach((row, j) => {
    row.forEach((cell, i) => {
      if (cell) {
        matrix[dropRow + j][dropColumn + i] = dropBlock;
      }
    });
  });
};

// Export
export default addShape;

import { BoardMatrix, CellType, Shape } from '../types';

/**
 * After a block is committed, add it to the matrix.
 *
 * @param matrix - Current matrix of the board
 * @param dropBlock - Block type
 * @param dropShape - Block shape
 * @param dropRow - Row index of the block
 * @param dropColumn - Column index of the block
 */
export default function addShape(
  matrix: BoardMatrix,
  dropBlock: CellType,
  dropShape: Shape,
  dropRow: number,
  dropColumn: number
): void {
  dropShape.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (cell) {
        matrix[dropRow + j][dropColumn + i] = dropBlock;
      }
    });
  });
}

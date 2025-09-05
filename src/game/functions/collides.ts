import { BoardMatrix, NonBlockType, Shape } from '../types';

/**
 * Checks if a block collides with existing cells in the matrix.
 *
 * @param matrix - Current matrix of the board
 * @param dropShape - Block shape
 * @param dropRow - Row index of the block
 * @param dropColumn - Column index of the block
 * @returns Collision boolean state
 */
export default function collides(
  matrix: BoardMatrix,
  dropShape: Shape,
  dropRow: number,
  dropColumn: number
): boolean {
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
}

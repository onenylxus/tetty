import { BoardMatrix, NonBlockType } from '../types';
import Dimensions from '../constants/dimensions';

/**
 * Returns an empty matrix of width and height from constants. In line clears, an empty matrix with
 * smaller height concatenates with the board matrix after removing the cleared lines.
 *
 * @param height - Custom height value to override
 * @returns Board matrix with empty cells
 */
export default function getEmptyMatrix(height: number = Dimensions.Height): BoardMatrix {
  return [...Array(height).keys()].map(() => Array(Dimensions.Width).fill(NonBlockType.Empty));
}

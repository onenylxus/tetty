// Import
import { BoardMatrix, NonBlockType } from '../types';
import Dimensions from '../constants/dimensions';

// Get empty matrix function
const getEmptyMatrix = (height: number = Dimensions.Height): BoardMatrix => {
  return [...Array(height).keys()].map(() => Array(Dimensions.Width).fill(NonBlockType.Empty));
};

// Export
export default getEmptyMatrix;

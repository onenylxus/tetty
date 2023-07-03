// Import
import { BoardMatrix, EmptyType } from '../types';
import Dimensions from '../constants/dimensions';

// Get empty matrix function
const getEmptyMatrix = (height: number = Dimensions.Height): BoardMatrix => {
  const width = 10;
  return [...Array(height).keys()].map(() => Array(Dimensions.Width).fill(EmptyType.Empty));
};

// Export
export default getEmptyMatrix;

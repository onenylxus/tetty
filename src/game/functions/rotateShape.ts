// Import
import { Shape } from '../types';

// Rotate shape function
const rotateShape = (shape: Shape): Shape => {
  const rows: number = shape.length;
  const columns: number = shape[0].length;
  const rotatedShape: Shape = Array(rows).fill(0).map(() => Array(columns).fill(false));

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      rotatedShape[i][rows - 1 - j] = shape[j][i];
    }
  }

  return rotatedShape;
};

// Export
export default rotateShape;

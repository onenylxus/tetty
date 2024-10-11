// Import
import { Rotation, Shape } from '../types';

// Rotate shape function
const rotateShape = (shape: Shape, rotation: Rotation = Rotation.Right): Shape => {
  const rows: number = shape.length;
  const columns: number = shape[0].length;
  const rotatedShape: Shape = Array(rows)
    .fill(0)
    .map(() => Array(columns).fill(false));

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      switch (rotation) {
        case Rotation.Left:
          rotatedShape[columns - 1 - i][j] = shape[j][i];
          break;
        case Rotation.Right:
          rotatedShape[i][rows - 1 - j] = shape[j][i];
          break;
        case Rotation.Double:
          rotatedShape[rows - 1 - j][columns - 1 - i] = shape[j][i];
          break;
      }
    }
  }

  return rotatedShape;
};

// Export
export default rotateShape;

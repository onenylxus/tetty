// Import
import { Dispatch, useReducer } from 'react';
import { BlockType, BoardAction, BoardMatrix, BoardState, Orientation, Rotation, SRSRotation, Shape } from '../types';
import Dimensions from '../constants/dimensions';
import Shapes from '../constants/shapes';
import SRSOffsets from '../constants/srsOffsets';
import collides from '../functions/collides';
import getEmptyMatrix from '../functions/getEmptyMatrix';
import rotateShape from '../functions/rotateShape';

// Initialize argument
const initState: BoardState = {
  matrix: [],
  dropRow: 0,
  dropColumn: 0,
  dropBlock: BlockType.I,
  dropShape: Shapes.I,
  dropOrientation: Orientation.Zero,
  isHardDrop: false,
  isHold: false,
};

// Initialize function
const initFn = (emptyState: BoardState): BoardState => {
  return { ...emptyState, matrix: getEmptyMatrix() };
};

// Board reducer
const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  const newState: BoardState = { ...state };
  let firstBlock: BlockType;
  let srsRotation: SRSRotation;
  let srsOffsets: number[][];
  let newRow: number;
  let newColumn: number;
  let newShape: Shape;
  let newOrientation: Orientation;

  switch (action.type) {
    case 'start':
      firstBlock = action.next as BlockType;
      return {
        matrix: getEmptyMatrix(),
        dropRow: 0,
        dropColumn: firstBlock === BlockType.O ? 4 : 3,
        dropBlock: firstBlock,
        dropShape: Shapes[firstBlock],
        dropOrientation: Orientation.Zero,
        isHardDrop: false,
        isHold: false,
      };

    case 'drop':
      newState.dropRow++;
      break;

    case 'commit':
      return {
        matrix: [...getEmptyMatrix(Dimensions.Height - (action.matrix as BoardMatrix).length), ...action.matrix as BoardMatrix],
        dropRow: 0,
        dropColumn: action.next === BlockType.O ? 4 : 3,
        dropBlock: action.next as BlockType,
        dropShape: Shapes[action.next as BlockType],
        dropOrientation: Orientation.Zero,
        isHardDrop: false,
        isHold: false,
      };

    case 'move':
      if (newState.isHardDrop) {
        return newState;
      }

      if (action.hold) {
        newState.dropRow = 0;
        newState.dropColumn = action.next === BlockType.O ? 4 : 3;
        newState.dropBlock = action.next as BlockType;
        newState.dropShape = Shapes[action.next as BlockType];
        newState.dropOrientation = Orientation.Zero;
        newState.isHold = true;
      } else if (action.hardDrop) {
        while (!collides(newState.matrix, newState.dropShape, newState.dropRow + 1, newState.dropColumn)) {
          newState.dropRow++;
          newState.isHardDrop = true;
        }
      } else if (action.rotate) {
        newShape = rotateShape(newState.dropShape, action.rotate);
        newOrientation = (newState.dropOrientation + action.rotate) % 4;
        srsRotation = action.rotate !== Rotation.Double ? (newState.dropOrientation * 2 + (action.rotate === Rotation.Left ? 1 : 0) + 7) % 8 : 0;
        srsOffsets = SRSOffsets[newState.dropBlock][srsRotation];

        for (let i = 0; i < srsOffsets.length; i++) {
          if (action.rotate === Rotation.Double && i > 0) {
            break;
          }

          newRow = newState.dropRow + srsOffsets[i][0];
          newColumn = newState.dropColumn + srsOffsets[i][1];
          if (!collides(newState.matrix, newShape, newRow, newColumn)) {
            newState.dropRow = newRow;
            newState.dropColumn = newColumn;
            newState.dropShape = newShape;
            newState.dropOrientation = newOrientation;
            break;
          }
        }
      } else {
        newColumn = newState.dropColumn + (action.moveLeft ? -1 : (action.moveRight ? 1 : 0));
        if (!collides(newState.matrix, newState.dropShape, newState.dropRow, newColumn)) {
          newState.dropColumn = newColumn;
        }
      }
      break;

    default:
      throw new Error(`Invalid action type '${action.type}'`);
  }

  return newState;
};

// Use board hook
const useBoard = (): [BoardState, Dispatch<BoardAction>] => {
  const [boardState, dispatchBoardState] = useReducer(boardReducer, initState, initFn);
  return [boardState, dispatchBoardState];
};

// Export
export default useBoard;

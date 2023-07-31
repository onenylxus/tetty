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
};

// Initialize function
const initFn = (emptyState: BoardState): BoardState => {
  return { ...emptyState, matrix: getEmptyMatrix() };
};

// Board reducer
const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
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
      };

    case 'drop':
      return {
        ...state,
        dropRow: state.dropRow + 1,
      };

    case 'commit':
      return {
        matrix: [...getEmptyMatrix(Dimensions.Height - (action.matrix as BoardMatrix).length), ...action.matrix as BoardMatrix],
        dropRow: 0,
        dropColumn: action.next === BlockType.O ? 4 : 3,
        dropBlock: action.next as BlockType,
        dropShape: Shapes[action.next as BlockType],
        dropOrientation: Orientation.Zero,
      };

    case 'move':
      if (action.hardDrop) {
        while (!collides(state.matrix, state.dropShape, state.dropRow + 1, state.dropColumn)) {
          state.dropRow++;
        }
      }
      else if (action.rotate) {
        newShape = rotateShape(state.dropShape, action.rotate);
        newOrientation = (state.dropOrientation + action.rotate) % 4;
        srsRotation = action.rotate !== Rotation.Double ? (state.dropOrientation * 2 + (action.rotate === Rotation.Left ? 1 : 0) + 7) % 8 : 0;
        srsOffsets = SRSOffsets[state.dropBlock][srsRotation];

        for (let i = 0; i < srsOffsets.length; i++) {
          if (action.rotate === Rotation.Double && i > 0) {
            break;
          }

          newRow = state.dropRow + srsOffsets[i][0];
          newColumn = state.dropColumn + srsOffsets[i][1];
          if (!collides(state.matrix, newShape, newRow, newColumn)) {
            console.log([...srsOffsets[i]]);
            return {
              ...state,
              dropRow: newRow,
              dropColumn: newColumn,
              dropShape: newShape,
              dropOrientation: newOrientation,
            };
          }
        }
      } else {
        newColumn = state.dropColumn + (action.moveLeft ? -1 : (action.moveRight ? 1 : 0));
        if (!collides(state.matrix, state.dropShape, state.dropRow, newColumn)) {
          return {
            ...state,
            dropColumn: newColumn,
          };
        }
      }
      return { ...state };

    default:
      throw new Error(`Invalid action type '${action.type}'`);
  }
};

// Use board hook
const useBoard = (): [BoardState, Dispatch<BoardAction>] => {
  const [boardState, dispatchBoardState] = useReducer(boardReducer, initState, initFn);
  return [boardState, dispatchBoardState];
};

// Export
export default useBoard;

// Import
import { Dispatch, useReducer } from 'react';
import { BlockType, BoardAction, BoardMatrix, BoardState, Shape } from '../types';
import Dimensions from '../constants/dimensions';
import Shapes from '../constants/shapes';
import collides from '../functions/collides';
import getEmptyMatrix from '../functions/getEmptyMatrix';
import getRandomBlock from '../functions/getRandomBlock';
import rotateShape from '../functions/rotateShape';

// Initialize argument
const initState: BoardState = {
  matrix: [],
  dropRow: 0,
  dropColumn: 0,
  dropBlock: BlockType.I,
  dropShape: Shapes.I,
};

// Initialize function
const initFn = (emptyState: BoardState): BoardState => {
  return { ...emptyState, matrix: getEmptyMatrix() };
};

// Board reducer
const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  const newState: BoardState = { ...state };
  let firstBlock: BlockType;
  let newShape: Shape;
  let columnOffset: number;

  switch (action.type) {
    case 'start':
      firstBlock = getRandomBlock();
      return {
        matrix: getEmptyMatrix(),
        dropRow: 0,
        dropColumn: 3,
        dropBlock: firstBlock,
        dropShape: Shapes[firstBlock],
      };

    case 'drop':
      newState.dropRow++;
      break;

    case 'commit':
      return {
        matrix: [...getEmptyMatrix(Dimensions.Height - (action.matrix as BoardMatrix).length), ...action.matrix as BoardMatrix],
        dropRow: 0,
        dropColumn: 3,
        dropBlock: action.next as BlockType,
        dropShape: Shapes[action.next as BlockType],
      };

    case 'move':
      if (action.hardDrop) {
        while (!collides(newState.matrix, newState.dropShape, newState.dropRow + 1, newState.dropColumn)) {
          newState.dropRow++;
        }
      }
      else {
        newShape = action.rotate ? rotateShape(newState.dropShape) : newState.dropShape;
        columnOffset = action.moveLeft ? -1 : (action.moveRight ? 1 : 0);
        if (!collides(newState.matrix, newShape, newState.dropRow, newState.dropColumn + columnOffset)) {
          newState.dropColumn += columnOffset;
          newState.dropShape = newShape;
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

// Import
import { Dispatch, useReducer } from 'react';
import { BlockType, BoardAction, BoardState } from '../types';
import Shapes from '../constants/shapes';
import getEmptyMatrix from '../functions/getEmptyMatrix';
import getRandomBlock from '../functions/getRandomBlock';

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
      break;

    case 'move':
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

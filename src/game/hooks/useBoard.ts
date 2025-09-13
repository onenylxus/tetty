import {
  BlockType,
  BoardAction,
  BoardMatrix,
  BoardState,
  Matrix,
  Orientation,
  Rotation,
  Shape,
  SRSRotation
} from '../types';
import { Dispatch, useReducer } from 'react';
import Dimensions from '../constants/dimensions';
import Shapes from '../constants/shapes';
import SRSOffsets from '../constants/srsOffsets';
import collides from '../functions/collides';
import getEmptyMatrix from '../functions/getEmptyMatrix';
import rotateShape from '../functions/rotateShape';

// Initialize arguments
const initState: BoardState = {
  matrix: [],
  dropRow: 0,
  dropColumn: 0,
  dropBlock: BlockType.I,
  dropShape: Shapes.I,
  dropOrientation: Orientation.Zero,
  isHardDrop: false,
  isHold: false,
  hardDropRows: 0
};

/**
 * Initializes the board with an empty matrix.
 *
 * @param emptyState - Initial board state
 * @returns Board state after initialization
 */
function initFn(emptyState: BoardState): BoardState {
  return { ...emptyState, matrix: getEmptyMatrix() };
}

/**
 * Board reducer manages board state and accepts board actions from the player.
 *
 * @param state - Initial board state
 * @param action - Board action from the player
 * @returns Final board state
 */
function boardReducer(state: BoardState, action: BoardAction): BoardState {
  const newState: BoardState = { ...state };
  let firstBlock: BlockType;
  let srsRotation: SRSRotation;
  let srsOffsets: Matrix<number>;
  let newRow: number;
  let newColumn: number;
  let newShape: Shape;
  let newOrientation: Orientation;

  switch (action.type) {
    case 'reset':
      newState.matrix = getEmptyMatrix();
      break;

    case 'start':
      firstBlock = action.next as BlockType;
      return {
        matrix: getEmptyMatrix(),
        dropRow: Dimensions.Buffer,
        dropColumn: firstBlock === BlockType.O ? 4 : 3,
        dropBlock: firstBlock,
        dropShape: Shapes[firstBlock],
        dropOrientation: Orientation.Zero,
        isHardDrop: false,
        isHold: false,
        hardDropRows: 0
      };

    case 'drop':
      newState.dropRow++;
      break;

    case 'commit':
      newState.matrix = [
        ...getEmptyMatrix(Dimensions.Height - (action.matrix as BoardMatrix).length),
        ...(action.matrix as BoardMatrix)
      ];
      newState.dropRow = Dimensions.Buffer;
      newState.dropColumn = action.next === BlockType.O ? 4 : 3;
      newState.dropBlock = action.next!;
      newState.dropShape = Shapes[action.next!];
      newState.dropOrientation = Orientation.Zero;
      newState.isHardDrop = false;
      newState.isHold = false;
      newState.hardDropRows = 0;

      while (
        newState.dropRow > 0 &&
        collides(newState.matrix, newState.dropShape, newState.dropRow, newState.dropColumn)
      ) {
        newState.dropRow--;
      }
      break;

    case 'move':
      if (newState.isHardDrop) {
        return newState;
      }

      if (action.hold) {
        newState.dropRow = Dimensions.Buffer;
        newState.dropColumn = action.next === BlockType.O ? 4 : 3;
        newState.dropBlock = action.next!;
        newState.dropShape = Shapes[action.next!];
        newState.dropOrientation = Orientation.Zero;
        newState.isHold = true;
      } else if (action.hardDrop) {
        while (
          !collides(newState.matrix, newState.dropShape, newState.dropRow + 1, newState.dropColumn)
        ) {
          newState.dropRow++;
          newState.hardDropRows++;
          newState.isHardDrop = true;
        }
      } else if (action.rotate) {
        newShape = rotateShape(newState.dropShape, action.rotate);
        newOrientation = (newState.dropOrientation + action.rotate) % 4;
        srsRotation =
          action.rotate !== Rotation.Double
            ? (newState.dropOrientation * 2 + (action.rotate === Rotation.Left ? 1 : 0) + 7) % 8
            : SRSRotation.None;
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
        newColumn = newState.dropColumn + (action.moveLeft ? -1 : action.moveRight ? 1 : 0);
        if (!collides(newState.matrix, newState.dropShape, newState.dropRow, newColumn)) {
          newState.dropColumn = newColumn;
        }
      }
      break;

    default:
      throw new Error(`Invalid action type '${action.type}'`);
  }

  return newState;
}

/**
 * React hook for managing the board state.
 *
 * @returns Getter and setter of the board state.
 */
export default function useBoard(): [BoardState, Dispatch<BoardAction>] {
  const [boardState, dispatchBoardState] = useReducer(boardReducer, initState, initFn);
  return [boardState, dispatchBoardState];
}

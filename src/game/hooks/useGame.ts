// Import
import { useCallback, useState } from 'react';
import { BoardMatrix } from '../types';
import useBoard from './useBoard';
import useInterval from './useInterval';

// Use game hook
const useGame = (): [BoardMatrix, () => void, boolean] => {
  const [active, setActive] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(-1);

  const [{ matrix, dropRow, dropColumn, dropBlock, dropShape }, dispatchBoardState] = useBoard();

  const start = useCallback(() => {
    setActive(true);
    setTickSpeed(800);
    dispatchBoardState({ type: 'start' });
  }, [dispatchBoardState]);

  const update = useCallback(() => {
    dispatchBoardState({ type: 'drop' });
  }, [dispatchBoardState]);

  useInterval(() => {
    if (active) {
      update();
    }
  }, tickSpeed);

  const matrixDisplay: BoardMatrix = structuredClone(matrix);
  if (active) {
    dropShape.filter((row) => row.some((cell) => cell)).forEach((row, j) => {
      row.forEach((cell, i) => {
        if (cell) {
          matrixDisplay[dropRow + j][dropColumn + i] = dropBlock;
        }
      });
    });
  }

  return [matrixDisplay, start, active];
};

// Export
export default useGame;

// Import
import { useCallback, useState } from 'react';
import { BoardMatrix } from '../types';
import useBoard from './useBoard';
import useInterval from './useInterval';
import addShape from '../functions/addShape';
import collides from '../functions/collides';

// Use game hook
const useGame = (): [BoardMatrix, () => void, boolean] => {
  const [active, setActive] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(-1);
  const [isSliding, setIsSliding] = useState(false);

  const [{ matrix, dropRow, dropColumn, dropBlock, dropShape }, dispatchBoardState] = useBoard();

  const start = useCallback(() => {
    setActive(true);
    setTickSpeed(800);
    dispatchBoardState({ type: 'start' });
  }, [dispatchBoardState]);

  const commit = useCallback(() => {
    if (!collides(matrix, dropShape, dropRow + 1, dropColumn)) {
      setTickSpeed(800);
      setIsSliding(false);
      return;
    }

    const matrixCommit: BoardMatrix = structuredClone(matrix);
    addShape(matrixCommit, dropBlock, dropShape, dropRow, dropColumn);

    setTickSpeed(800);
    setIsSliding(false);
    dispatchBoardState({ type: 'commit', matrix: matrixCommit });
  }, [dispatchBoardState, dropBlock, dropColumn, dropRow, dropShape, matrix]);

  const update = useCallback(() => {
    if (isSliding) {
      commit();
    } else if (collides(matrix, dropShape, dropRow + 1, dropColumn)) {
      setTickSpeed(100);
      setIsSliding(true);
    } else {
      dispatchBoardState({ type: 'drop' });
    }
  }, [commit, dispatchBoardState, dropColumn, dropRow, dropShape, matrix, isSliding]);

  useInterval(() => {
    if (active) {
      update();
    }
  }, tickSpeed);

  const matrixDisplay: BoardMatrix = structuredClone(matrix);
  if (active) {
    addShape(matrixDisplay, dropBlock, dropShape, dropRow, dropColumn);
  }

  return [matrixDisplay, start, active];
};

// Export
export default useGame;

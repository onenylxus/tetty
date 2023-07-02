// Import
import { useCallback, useEffect, useState } from 'react';
import { BlockType, BoardMatrix } from '../types';
import useBoard from './useBoard';
import useInterval from './useInterval';
import addShape from '../functions/addShape';
import collides from '../functions/collides';
import getRandomBlock from '../functions/getRandomBlock';

// Use game hook
const useGame = (): [BoardMatrix, () => void, boolean] => {
  const [active, setActive] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(-1);
  const [isSliding, setIsSliding] = useState(false);
  const [nextQueue, setNextQueue] = useState<BlockType[]>([]);

  const [{ matrix, dropRow, dropColumn, dropBlock, dropShape }, dispatchBoardState] = useBoard();

  const start = useCallback(() => {
    setActive(true);
    setTickSpeed(800);
    setNextQueue([0, 0, 0, 0, 0].map(() => getRandomBlock()));
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

    const newNextQueue: BlockType[] = structuredClone(nextQueue);
    const nextBlock: BlockType = newNextQueue.pop() as BlockType;
    newNextQueue.unshift(getRandomBlock());

    setTickSpeed(800);
    setIsSliding(false);
    setNextQueue(newNextQueue);
    dispatchBoardState({ type: 'commit', matrix: matrixCommit, next: nextBlock });
  }, [dispatchBoardState, dropBlock, dropColumn, dropRow, dropShape, matrix, nextQueue]);

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

  useEffect(() => {
    if (!active) {
      return;
    }

    let moveLeft = false;
    let moveRight = false;
    let moveIntervalId: number | undefined;

    const updateMoveInterval = () => {
      clearInterval(moveIntervalId);
      dispatchBoardState({ type: 'move', moveLeft, moveRight });
      moveIntervalId = setInterval(() => {
        dispatchBoardState({ type: 'move', moveLeft, moveRight });
      }, 100);
    };

    const onkeydown = (event: KeyboardEvent): void => {
      if (event.repeat) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        moveLeft = true;
        updateMoveInterval();
      }
      if (event.key === 'ArrowRight') {
        moveRight = true;
        updateMoveInterval();
      }
      if (event.key === 'ArrowUp') {
        dispatchBoardState({ type: 'move', rotate: true });
      }
      if (event.key === 'ArrowDown') {
        setTickSpeed(50);
      }
    };

    const onkeyup = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft') {
        moveLeft = false;
        updateMoveInterval();
      }
      if (event.key === 'ArrowRight') {
        moveRight = false;
        updateMoveInterval();
      }
      if (event.key === 'ArrowDown') {
        setTickSpeed(800);
      }
    };

    document.addEventListener('keydown', onkeydown);
    document.addEventListener('keyup', onkeyup);

    return () => {
      document.removeEventListener('keydown', onkeydown);
      document.removeEventListener('keyup', onkeyup);
    };
  }, [active]);

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

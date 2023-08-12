// Import
import { useCallback, useEffect, useState } from 'react';
import { BlockType, BoardMatrix, EmptyType, Rotation } from '../types';
import useBoard from './useBoard';
import useInterval from './useInterval';
import Dimensions from '../constants/dimensions';
import Shapes from '../constants/shapes';
import addShape from '../functions/addShape';
import collides from '../functions/collides';
import getSevenBag from '../functions/getSevenBag';

// Use game hook
const useGame = (): [BoardMatrix, BlockType[], () => void, boolean] => {
  const [active, setActive] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(-1);
  const [isHardDrop, setIsHardDrop] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [nextQueue, setNextQueue] = useState<BlockType[]>([]);

  const [{ matrix, dropRow, dropColumn, dropBlock, dropShape }, dispatchBoardState] = useBoard();

  // Start function
  const start = useCallback(() => {
    setActive(true);
    setTickSpeed(800);

    const firstBag: BlockType[] = getSevenBag();
    const firstBlock: BlockType = firstBag.pop() as BlockType;
    setNextQueue(firstBag);
    dispatchBoardState({ type: 'start', next: firstBlock });
  }, [dispatchBoardState]);

  // Commit function
  const commit = useCallback(() => {
    // Leave sliding state except hard drop action performed
    if (!isHardDrop && !collides(matrix, dropShape, dropRow + 1, dropColumn)) {
      setTickSpeed(800);
      setIsSliding(false);
      return;
    }

    // Add shape to matrix
    const matrixCommit: BoardMatrix = structuredClone(matrix);
    addShape(matrixCommit, dropBlock, dropShape, dropRow, dropColumn);

    // Clear rows if full
    for (let j = Dimensions.Height - 1; j >= 0; j--) {
      if (matrixCommit[j].every((cell) => cell !== EmptyType.Empty)) {
        matrixCommit.splice(j, 1);
      }
    }

    // Update next queue
    const newNextQueue: BlockType[] = structuredClone(nextQueue);
    const nextBlock: BlockType = newNextQueue.pop() as BlockType;
    if (newNextQueue.length < 7) {
      newNextQueue.unshift(...getSevenBag());
    }

    // Detect top out
    if (collides(matrixCommit, Shapes[nextBlock], 0, 3)) {
      setActive(false);
      setTickSpeed(-1);
    } else {
      setTickSpeed(800);
    }

    setIsHardDrop(false);
    setIsSliding(false);
    setNextQueue(newNextQueue);
    dispatchBoardState({ type: 'commit', matrix: matrixCommit, next: nextBlock });
  }, [dispatchBoardState, dropBlock, dropColumn, dropRow, dropShape, isHardDrop, matrix, nextQueue]);

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

    // Update move interval function
    const updateMoveInterval = () => {
      clearInterval(moveIntervalId);
      dispatchBoardState({ type: 'move', moveLeft, moveRight });
      moveIntervalId = setInterval(() => {
        dispatchBoardState({ type: 'move', moveLeft, moveRight });
      }, 100);
    };

    // Key down event
    const onkeydown = (event: KeyboardEvent): void => {
      if (event.repeat) {
        return;
      }
      if (event.code === 'ArrowLeft') {
        moveLeft = true;
        updateMoveInterval();
      }
      if (event.code === 'ArrowRight') {
        moveRight = true;
        updateMoveInterval();
      }
      if (event.code === 'ControlLeft' || event.code === 'KeyZ') {
        dispatchBoardState({ type: 'move', rotate: Rotation.Left });
      }
      if (event.code === 'ArrowUp' || event.code === 'KeyX') {
        dispatchBoardState({ type: 'move', rotate: Rotation.Right });
      }
      if (event.code === 'KeyA') {
        dispatchBoardState({ type: 'move', rotate: Rotation.Double });
      }
      if (event.code === 'ArrowDown') {
        setTickSpeed(50);
      }
      if (event.code === 'Space') {
        dispatchBoardState({ type: 'move', hardDrop: true });
        setTickSpeed(0);
        setIsHardDrop(true);
      }
    };

    // Key up event
    const onkeyup = (event: KeyboardEvent): void => {
      if (event.code === 'ArrowLeft') {
        moveLeft = false;
        updateMoveInterval();
      }
      if (event.code === 'ArrowRight') {
        moveRight = false;
        updateMoveInterval();
      }
      if (event.code === 'ArrowDown') {
        setTickSpeed(800);
      }
    };

    document.addEventListener('keydown', onkeydown);
    document.addEventListener('keyup', onkeyup);

    return () => {
      document.removeEventListener('keydown', onkeydown);
      document.removeEventListener('keyup', onkeyup);
    };
  }, [active, dispatchBoardState]);

  // Update
  useInterval(() => {
    if (active) {
      update();
    }
  }, tickSpeed);

  // Display current matrix with dropping block
  const matrixDisplay: BoardMatrix = structuredClone(matrix);
  if (active) {
    addShape(matrixDisplay, dropBlock, dropShape, dropRow, dropColumn);
  }

  // Display current next queue
  const nextQueueDisplay: BlockType[] = structuredClone(nextQueue).reverse().slice(0, 5);

  return [matrixDisplay, nextQueueDisplay, start, active];
};

// Export
export default useGame;

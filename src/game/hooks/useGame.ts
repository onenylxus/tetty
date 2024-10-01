// Import
import { useCallback, useEffect, useState } from 'react';
import { BlockType, BoardMatrix, DisplayBlockType, NonBlockType, Rotation } from '../types';
import Dimensions from '../constants/dimensions';
import Shapes from '../constants/shapes';
import addShape from '../functions/addShape';
import collides from '../functions/collides';
import getEmptyQueue from '../functions/getEmptyQueue';
import getSevenBag from '../functions/getSevenBag';
import useBoard from './useBoard';
import useInterval from './useInterval';

// Game hook output
interface UseGameOutput {
  ready: () => void;
  standby: boolean;
  active: boolean;
  timer: number;
  matrix: BoardMatrix;
  hold: DisplayBlockType;
  next: DisplayBlockType[];
  lines: number;
}

// Use game hook
const useGame = (): UseGameOutput => {
  const [standby, setStandby] = useState(false);
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [tickSpeed, setTickSpeed] = useState(-1);
  const [isSliding, setIsSliding] = useState(false);
  const [holdBlock, setHoldBlock] = useState<DisplayBlockType>(undefined);
  const [nextQueue, setNextQueue] = useState<DisplayBlockType[]>(getEmptyQueue());
  const [lines, setLines] = useState(0);

  const [{ matrix, dropRow, dropColumn, dropBlock, dropShape, isHardDrop, isHold }, dispatchBoardState] = useBoard();

  // Ready function
  const ready = useCallback(() => {
    setStandby(true);
    setActive(false);
    setTimer(5);
    setLines(0);
    setHoldBlock(undefined);
    setNextQueue(getEmptyQueue());
    setTickSpeed(800);
    dispatchBoardState({ type: 'reset' });
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
    let clearedLines: number = 0;
    for (let j = Dimensions.Height - 1; j >= 0; j--) {
      if (matrixCommit[j].every((cell) => cell !== NonBlockType.Empty)) {
        clearedLines++;
        matrixCommit.splice(j, 1);
      }
    }
    setLines(lines + clearedLines);

    // Update next queue
    const newNextQueue: DisplayBlockType[] = structuredClone(nextQueue);
    const nextBlock: BlockType = newNextQueue.pop() as BlockType;
    if (newNextQueue.length < 7) {
      newNextQueue.unshift(...getSevenBag());
    }

    // Detect top out
    if (collides(matrixCommit, Shapes[nextBlock], 0, 3)) {
      setStandby(false);
      setActive(false);
      setTickSpeed(-1);
    } else {
      setTickSpeed(800);
    }

    setIsSliding(false);
    setNextQueue(newNextQueue);
    dispatchBoardState({ type: 'commit', matrix: matrixCommit, next: nextBlock });
  }, [dispatchBoardState, dropBlock, dropColumn, dropRow, dropShape, isHardDrop, lines, matrix, nextQueue]);

  // Update function
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
    if (timer > 0) {
      setTimeout(() => setTimer(Math.max(timer - 1, 0)), 1000);
    } else if (standby) {
      setActive(true);

      const firstBag: BlockType[] = getSevenBag();
      const firstBlock: BlockType = firstBag.pop() as BlockType;
      setNextQueue(firstBag);
      dispatchBoardState({ type: 'start', next: firstBlock });
    }
  }, [standby, timer, dispatchBoardState]);

  // Check keyboard controls
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
      }
      if (event.code === 'ShiftLeft') {
        if (!isHold) {
          if (holdBlock) {
            dispatchBoardState({ type: 'move', hold: true, next: holdBlock });
          } else {
            // Get hold block from queue if empty
            const newNextQueue: DisplayBlockType[] = structuredClone(nextQueue);
            const newHold: BlockType = newNextQueue.pop() as BlockType;
            if (newNextQueue.length < 7) {
              newNextQueue.unshift(...getSevenBag());
            }

            setNextQueue(newNextQueue);
            dispatchBoardState({ type: 'move', hold: true, next: newHold });
          }

          setHoldBlock(dropBlock);
        }
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
      clearInterval(moveIntervalId);
      document.removeEventListener('keydown', onkeydown);
      document.removeEventListener('keyup', onkeyup);
    };
  }, [active, dispatchBoardState, dropBlock, holdBlock, isHold, nextQueue]);

  // Update
  useInterval(() => {
    if (active) {
      update();
    }
  }, tickSpeed);

  // Set up display results
  const matrixDisplay: BoardMatrix = structuredClone(matrix);
  if (active) {
    // Add ghost block
    let ghostRow = dropRow;
    while (!collides(matrix, dropShape, ghostRow + 1, dropColumn)) {
      ghostRow++;
    }
    addShape(matrixDisplay, NonBlockType.Ghost, dropShape, ghostRow, dropColumn);

    // Add dropping block
    addShape(matrixDisplay, dropBlock, dropShape, dropRow, dropColumn);
  }

  const holdBlockDisplay: DisplayBlockType = holdBlock;
  const nextQueueDisplay: DisplayBlockType[] = structuredClone(nextQueue).reverse().slice(0, 5);

  return {
    ready,
    standby,
    active,
    timer,
    matrix: matrixDisplay,
    hold: holdBlockDisplay,
    next: nextQueueDisplay,
    lines,
  };
};

// Export
export default useGame;

// Import
import { useCallback, useEffect, useState } from 'react';
import { BlockType, BoardMatrix, NonBlockType, Rotation } from '../types';
import Dimensions from '../constants/dimensions';
import Shapes from '../constants/shapes';
import addShape from '../functions/addShape';
import collides from '../functions/collides';
import getSevenBag from '../functions/getSevenBag';
import useBoard from './useBoard';
import useInterval from './useInterval';

// Use game hook
const useGame = (): [() => void, boolean, BoardMatrix, BlockType | undefined, BlockType[], number] => {
  const [active, setActive] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(-1);
  const [isSliding, setIsSliding] = useState(false);
  const [holdBlock, setHoldBlock] = useState<BlockType | undefined>();
  const [nextQueue, setNextQueue] = useState<BlockType[]>([]);
  const [lines, setLines] = useState(0);

  const [{ matrix, dropRow, dropColumn, dropBlock, dropShape, isHardDrop, isHold }, dispatchBoardState] = useBoard();

  // Start function
  const start = useCallback(() => {
    setActive(true);
    setLines(0);
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
    let clearedLines: number = 0;
    for (let j = Dimensions.Height - 1; j >= 0; j--) {
      if (matrixCommit[j].every((cell) => cell !== NonBlockType.Empty)) {
        clearedLines++;
        matrixCommit.splice(j, 1);
      }
    }
    setLines(lines + clearedLines);

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

    setIsSliding(false);
    setNextQueue(newNextQueue);
    dispatchBoardState({ type: 'commit', matrix: matrixCommit, next: nextBlock });
  }, [dispatchBoardState, dropBlock, dropColumn, dropRow, dropShape, isHardDrop, lines, matrix, nextQueue]);

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
      }
      if (event.code === 'ShiftLeft') {
        if (!isHold) {
          if (holdBlock) {
            dispatchBoardState({ type: 'move', hold: true, next: holdBlock });
          } else {
            // Get hold block from queue if empty
            const newNextQueue: BlockType[] = structuredClone(nextQueue);
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

  // Display current matrix
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

  const nextQueueDisplay: BlockType[] = structuredClone(nextQueue).reverse().slice(0, 5);
  const holdBlockDisplay: BlockType | undefined = holdBlock;

  return [start, active, matrixDisplay, holdBlockDisplay, nextQueueDisplay, lines];
};

// Export
export default useGame;

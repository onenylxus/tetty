import { BlockType, BoardMatrix, DisplayBlockType, NonBlockType, Rotation } from '../types';
import { useCallback, useEffect, useRef, useState } from 'react';
import Dimensions from '../constants/dimensions';
import Scores from '../constants/scores';
import Shapes from '../constants/shapes';
import addShape from '../functions/addShape';
import collides from '../functions/collides';
import getEmptyQueue from '../functions/getEmptyQueue';
import getSevenBag from '../functions/getSevenBag';
import useBoard from './useBoard';
import useInterval from './useInterval';
import getGravity from '../functions/getGravity';

// Game hook return
interface UseGameOutput {
  standby: boolean;
  active: boolean;
  timer: number;
  matrix: BoardMatrix;
  hold: DisplayBlockType;
  next: DisplayBlockType[];
  level: number;
  lines: number;
  score: number;
  cleared: number;
  combo: number;
  backToBack: boolean;
  ready: () => void;
}

/**
 * React hook to manage game states from start to finish.
 *
 * @returns Game states
 */
export default function useGame(): Readonly<UseGameOutput> {
  // Activations
  const [standby, setStandby] = useState(false);
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(0);

  // Board variables
  const [tickSpeed, setTickSpeed] = useState(-1);
  const [isSliding, setIsSliding] = useState(false);
  const [holdBlock, setHoldBlock] = useState<DisplayBlockType>(undefined);
  const [nextQueue, setNextQueue] = useState<DisplayBlockType[]>(getEmptyQueue());
  const [
    { matrix, dropRow, dropColumn, dropBlock, dropShape, isHardDrop, isHold, hardDropRows },
    dispatchBoardState
  ] = useBoard();

  // Game statistics
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [score, setScore] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [lastCleared, setLastCleared] = useState(0);
  const [combo, setCombo] = useState(-1);
  const [backToBack, setBackToBack] = useState(false);

  // References
  const softDropState = useRef(false);

  // Ready function
  const ready = useCallback(() => {
    dispatchBoardState({ type: 'reset' });
    setStandby(true);
    setActive(false);
    setTimer(5);
    setTickSpeed(getGravity(1));
    setIsSliding(false);
    setHoldBlock(undefined);
    setNextQueue(getEmptyQueue());
    setLevel(1);
    setLines(0);
    setScore(0);
    setCleared(0);
    setLastCleared(0);
    setCombo(-1);
    setBackToBack(false);
  }, [dispatchBoardState]);

  // Commit function
  const commit = useCallback(() => {
    // Leave sliding state except hard drop action performed
    if (!isHardDrop && !collides(matrix, dropShape, dropRow + 1, dropColumn)) {
      setTickSpeed(getGravity(level));
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
    const newLines = lines + clearedLines;
    const newLevel = Math.min(Math.floor(newLines / 10) + 1, 20);
    const newBackToBack = clearedLines === 4 && lastCleared === 4;

    // Calculate score
    let addScore = 0;
    switch (clearedLines) {
      case 1:
        addScore += Scores.Single;
        break;
      case 2:
        addScore += Scores.Double;
        break;
      case 3:
        addScore += Scores.Triple;
        break;
      case 4:
        addScore += Scores.Tetty;
        break;
    }
    addScore *= newBackToBack ? Scores.BackToBackMult : 1;
    addScore += hardDropRows * Scores.HardDrop;
    addScore *= level;

    // Update statistics
    setLevel(newLevel);
    setLines(newLines);
    setScore(score + addScore);
    setCleared(clearedLines);
    setCombo(clearedLines > 0 ? combo + 1 : -1);
    setBackToBack(newBackToBack);
    setLastCleared(clearedLines > 0 ? clearedLines : lastCleared);

    // Update next queue
    const newNextQueue: DisplayBlockType[] = structuredClone(nextQueue);
    const nextBlock: BlockType = newNextQueue.pop() as BlockType;
    if (newNextQueue.length < 7) {
      newNextQueue.unshift(...getSevenBag());
    }

    // Reset and commit
    setIsSliding(false);
    setNextQueue(newNextQueue);
    dispatchBoardState({ type: 'commit', matrix: matrixCommit, next: nextBlock });

    // Detect top out
    if (collides(matrixCommit, Shapes[nextBlock], 0, nextBlock === BlockType.O ? 4 : 3)) {
      setStandby(false);
      setActive(false);
      setTickSpeed(-1);
    } else {
      setTickSpeed(getGravity(newLevel));
    }
  }, [
    combo,
    dispatchBoardState,
    dropBlock,
    dropColumn,
    dropRow,
    dropShape,
    isHardDrop,
    lastCleared,
    level,
    lines,
    matrix,
    nextQueue
  ]);

  // Update function
  const update = useCallback(() => {
    if (isSliding) {
      commit();
    } else if (collides(matrix, dropShape, dropRow + 1, dropColumn)) {
      setTickSpeed(Math.max(getGravity(level), 100));
      setIsSliding(true);
    } else {
      if (softDropState.current) {
        setScore(score + Scores.SoftDrop * level);
      }
      dispatchBoardState({ type: 'drop' });
    }
  }, [commit, dispatchBoardState, dropColumn, dropRow, dropShape, isSliding, level, matrix, score]);

  // Set countdown timer and start game
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
      moveIntervalId = setInterval(
        () => {
          dispatchBoardState({ type: 'move', moveLeft, moveRight });
        },
        Math.min(getGravity(level) / 10, 50)
      );
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
        softDropState.current = true;
        setTickSpeed(Math.min(getGravity(level) / 10, 50));
      }
      if (event.code === 'Space') {
        dispatchBoardState({ type: 'move', hardDrop: true });
        setTickSpeed(0);
        setIsSliding(true);
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
        softDropState.current = false;
        setTickSpeed(getGravity(level));
      }
    };

    document.addEventListener('keydown', onkeydown);
    document.addEventListener('keyup', onkeyup);

    return () => {
      clearInterval(moveIntervalId);
      document.removeEventListener('keydown', onkeydown);
      document.removeEventListener('keyup', onkeyup);
    };
  }, [active, dispatchBoardState, dropBlock, holdBlock, isHold, level, nextQueue]);

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
    standby,
    active,
    timer,
    matrix: matrixDisplay.filter((_, j) => j >= Dimensions.Buffer),
    hold: holdBlockDisplay,
    next: nextQueueDisplay,
    level,
    lines,
    score,
    cleared,
    combo,
    backToBack,
    ready
  };
}

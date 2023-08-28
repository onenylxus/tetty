// Import
import { BlockType, BoardMatrix } from '../types';
import Cell from './Cell';
import MiniShape from './MiniShape';

// Board props
interface Props {
  matrix: BoardMatrix;
  hold: BlockType | undefined;
  nextQueue: BlockType[];
}

// Board component
const Board = ({ matrix, hold, nextQueue }: Props) => {
  // Fill queue to 5 elements
  const nextQueueDisplay: (BlockType | undefined)[] = structuredClone(nextQueue);
  while (nextQueueDisplay.length < 5) {
    nextQueueDisplay.push(undefined);
  }

  // Return
  return (
    <div className="board">
      <div className="left-column">
        <div className="hold-text">HOLD</div>
        <div className="hold-block">
          <MiniShape className="hold-shape" block={hold} />
        </div>
      </div>
      <div className="matrix">
        {matrix.map((row, j) => (
          <div className="row" key={`${j}`}>
            {row.map((cell, i) => (
              <Cell cellType={cell} key={`${j}-${i}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="right-column">
        <div className="next-text">NEXT</div>
        <div className="next-queue">
          {nextQueueDisplay.map((next, k) => (
            <div className="next-block" key={`${k}`}>
              <MiniShape className="next-shape" block={next} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

// Export
export default Board;

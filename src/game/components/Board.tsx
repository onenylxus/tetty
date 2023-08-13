// Import
import { BlockType, BoardMatrix, NonBlockType } from '../types';
import Cell from './Cell';
import Shapes from '../constants/shapes';

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

  // Generate small shape function
  const generateSmallShape = (className: string, block: BlockType | undefined) => {
    return (
      <div className={className}>
        {block ? (
          Shapes[block as BlockType].filter((row) => row.some((cell) => cell)).map((row, j) => (
            <div className="row" key={`${j}`}>
              {row.map((cell, i) => (
                <Cell cellType={cell ? block : NonBlockType.Empty} next={true} key={`${j}-${i}`} />
              ))}
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  // Return
  return (
    <div className="board">
      <div className="hold-block">
        {generateSmallShape("hold-shape", hold)}
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
      <div className="next-queue">
        {nextQueueDisplay.map((block, k) => (
          <div className="next-block" key={`${k}`}>
            {generateSmallShape("next-shape", block)}
          </div>
        ))}
      </div>
    </div>
  );

};

// Export
export default Board;

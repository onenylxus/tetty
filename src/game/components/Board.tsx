// Import
import { BoardMatrix, CellType, EmptyType } from '../types';
import Cell from './Cell';
import Shapes from '../constants/shapes';

// Board props
interface Props {
  matrix: BoardMatrix;
  nextQueue: CellType[];
}

// Board component
const Board = ({ matrix, nextQueue }: Props) => {
  // Fill queue to 5 elements
  const nextQueueDisplay: CellType[] = structuredClone(nextQueue);
  while (nextQueueDisplay.length < 5) {
    nextQueueDisplay.push(EmptyType.Empty);
  }

  // Return
  return (
    <div className="board">
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
            <div className="next-shape">
              {block !== EmptyType.Empty ? (
                Shapes[block].filter((row) => row.some((cell) => cell)).map((row, j) => (
                  <div className="row" key={`${j}`}>
                    {row.map((cell, i) => (
                      <Cell cellType={cell ? block : EmptyType.Empty} next={true} key={`${j}-${i}`} />
                    ))}
                  </div>
                ))
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

// Export
export default Board;

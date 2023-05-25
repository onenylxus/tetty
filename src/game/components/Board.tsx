// Import
import { BoardMatrix } from '../types';
import Cell from './Cell';

// Board props
interface Props {
  matrix: BoardMatrix;
}

// Board component
const Board = ({ matrix }: Props) => {
  // Return
  return (
    <div className="board">
      {matrix.map((row, j) => (
        <div className="row" key={`${j}`}>
          {row.map((cell, i) => (
            <Cell cellType={cell} key={`${j}-${i}`} />
          ))}
        </div>
      ))}
    </div>
  );

};

// Export
export default Board;

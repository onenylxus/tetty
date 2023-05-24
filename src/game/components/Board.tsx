// Import
import { BoardMatrix } from '../types';
import Cell from './Cell';

// Board props
interface Props {
  board: BoardMatrix;
}

// Board component
const Board = ({ board }: Props) => {
  // Return
  return (
    <div className="board">
      {board.map((row, j) => (
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

// Import
import { BoardMatrix, DisplayBlockType } from '../types';
import Cell from './Cell';
import MiniShape from './MiniShape';
import Timer from './Timer';

// Board props
interface Props {
  timer: number;
  matrix: BoardMatrix;
  hold: DisplayBlockType;
  next: DisplayBlockType[];
  lines: number;
}

// Board component
const Board = ({ timer, matrix, hold, next, lines }: Props) => {
  // Return
  return (
    <div className="board">
      <div className="left-column">
        <div className="hold-text">HOLD</div>
        <div className="hold-block">
          <MiniShape className="hold-shape" block={hold} />
        </div>
        <div className="lines">
          <div className="lines-text">LINES</div>
          <div className="lines-value">{lines}</div>
        </div>
      </div>
      <div className="center-column">
        <div className="matrix">
          {matrix.map((row, j) => (
            <div className="row" key={`${j}`}>
              {row.map((cell, i) => (
                <Cell cellType={cell} key={`${j}-${i}`} />
              ))}
            </div>
          ))}
          {timer > 0 && <Timer value={timer} />}
        </div>
        <div className="player-tag">
          <div className="player-name">PLAYER</div>
        </div>
      </div>
      <div className="right-column">
        <div className="next-text">NEXT</div>
        <div className="next-queue">
          {next.map((block, k) => (
            <div className="next-block" key={`${k}`}>
              <MiniShape className="next-shape" block={block} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

// Export
export default Board;

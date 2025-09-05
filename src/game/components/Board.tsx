import { BoardMatrix, DisplayBlockType } from '../types';
import Cell from './Cell';
import MiniShape from './MiniShape';
import Timer from './Timer';

// Left column props
interface LeftColumnProps {
  hold: DisplayBlockType;
  lines: number;
  message: string;
}

// Center column props
interface CenterColumnProps {
  timer: number;
  matrix: BoardMatrix;
}

// Right column props
interface RightColumnProps {
  next: DisplayBlockType[];
}

// Board props
interface BoardProps {
  timer: number;
  matrix: BoardMatrix;
  hold: DisplayBlockType;
  next: DisplayBlockType[];
  lines: number;
  message: string;
}

/**
 * Left column component consists of hold space at top left and statistics placed at bottom left.
 */
function LeftColumn({ hold, lines, message }: LeftColumnProps) {
  // Process message
  const [title, ...subtitle] = message.split(';');

  return (
    <div className="left-column">
      <div className="hold-text">HOLD</div>
      <div className="hold-block">
        <MiniShape className="hold-shape" block={hold} />
      </div>
      <div className="message">
        {subtitle.map((item) => (
          <div className="message-subtitle">{item}</div>
        ))}
        <div className="message-title">{title}</div>
      </div>
      <div className="lines">
        <div className="lines-text">LINES</div>
        <div className="lines-value">{lines}</div>
      </div>
    </div>
  );
}

/**
 * Center column component consists of the board and player tag below the board. A countdown timer
 * is displayed on top of the board when necessary.
 */
function CenterColumn({ timer, matrix }: CenterColumnProps) {
  return (
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
  );
}

/**
 * Right column component consists of next queue at top right and statistics placed at bottom right.
 */
function RightColumn({ next }: RightColumnProps) {
  return (
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
  );
}

/**
 * The board component is the main controllable component of a game.
 */
function Board({ timer, matrix, hold, next, lines, message }: BoardProps) {
  return (
    <div className="board">
      {LeftColumn({ hold, lines, message })}
      {CenterColumn({ timer, matrix })}
      {RightColumn({ next })}
    </div>
  );
}

export default Board;

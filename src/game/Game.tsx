// Import
import { BoardType, EmptyType } from './types';
import Board from './components/Board';
import './game.css';

// Game component
const Game = () => {
  // Create board matrix
  const width = 10;
  const height = 20; // 24 with buffer
  const board: BoardType = [...Array(height).keys()].map(() => Array(width).fill(EmptyType.Empty));

  // Return
  return (
    <div className="game">
      <Board board={board} />
    </div>
  );
};

// Export
export default Game;

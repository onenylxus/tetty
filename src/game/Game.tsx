// Import
import Board from './components/Board';
import getEmptyMatrix from './functions/getEmptyMatrix';
import './game.css';

// Game component
const Game = () => {
  // Return
  return (
    <div className="game">
      <Board board={getEmptyMatrix()} />
    </div>
  );
};

// Export
export default Game;

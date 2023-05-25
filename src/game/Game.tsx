// Import
import Board from './components/Board';
import useGame from './hooks/useGame';
import './game.css';

// Game component
const Game = () => {
  // Game hook
  const [matrix, start, active] = useGame();

  // Return
  return (
    <div className="game">
      <Board matrix={matrix} />
      <div className="controls">
        {active ? null : (<button onClick={start}>Start</button>)}
      </div>
    </div>
  );
};

// Export
export default Game;

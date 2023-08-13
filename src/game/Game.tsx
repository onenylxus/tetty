// Import
import Board from './components/Board';
import useGame from './hooks/useGame';
import './game.css';

// Game component
const Game = () => {
  // Game hook
  const [start, active, matrix, hold, nextQueue] = useGame();

  // Return
  return (
    <div className="game">
      <Board matrix={matrix} hold={hold} nextQueue={nextQueue} />
      <div className="controls">
        {active ? null : (<button onClick={start}>Start</button>)}
      </div>
    </div>
  );
};

// Export
export default Game;

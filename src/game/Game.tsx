// Import
import Board from './components/Board';
import useGame from './hooks/useGame';
import './game.css';

// Game component
const Game = () => {
  // Game hook
  const { ready, standby, timer, matrix, hold, next, lines } = useGame();

  // Return
  return (
    <div className="game">
      <Board timer={timer} matrix={matrix} hold={hold} next={next} lines={lines} />
      <div className="controls">
        {!standby && (<button onClick={ready}>Start</button>)}
      </div>
    </div>
  );
};

// Export
export default Game;

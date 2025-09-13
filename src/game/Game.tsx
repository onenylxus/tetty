import Board from './components/Board';
import getMessage from './functions/getMessage';
import useGame from './hooks/useGame';
import './game.css';

/**
 * Game component consists of player boards and external controls.
 */
export default function Game() {
  const { ready, standby, timer, matrix, hold, next, level, lines, score, cleared, combo, backToBack } =
    useGame();

  return (
    <div className="game">
      <Board
        timer={timer}
        matrix={matrix}
        hold={hold}
        next={next}
        level={level}
        lines={lines}
        score={score}
        message={getMessage(cleared, combo, backToBack)}
      />
      <div className="controls">{!standby && <button onClick={ready}>Start</button>}</div>
    </div>
  );
}

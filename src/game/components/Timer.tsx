// Timer props
interface TimerProps {
  value: number;
}

/**
 * Timer component indicates the countdown to the player at the start of a game.
 */
const Timer = ({ value }: TimerProps) => {
  return (
    <div className="timer">
      <div className="timer-text">{value}</div>
    </div>
  );
};

export default Timer;

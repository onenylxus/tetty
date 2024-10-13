// Timer props
interface TimerProps {
  value: number;
}

// Timer component
const Timer = ({ value }: TimerProps) => {
  // Return
  return (
    <div className="timer">
      <div className="timer-text">{value}</div>
    </div>
  );
};

// Export
export default Timer;

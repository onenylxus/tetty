// Timer props
interface Props {
  value: number;
}

// Timer component
const Timer = ({ value }: Props) => {
  // Return
  return (
    <div className="timer">
      <div className="timer-text">{value}</div>
    </div>
  );
};

// Export
export default Timer;

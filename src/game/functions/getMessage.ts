// Get message function
const getMessage = (cleared: number, combo: number): string => {
  if (cleared === 0) {
    return '';
  }

  let clearedMessage = '';
  switch (cleared) {
    case 1:
      clearedMessage = 'Single';
      break;
    case 2:
      clearedMessage = 'Double';
      break;
    case 3:
      clearedMessage = 'Triple';
      break;
    case 4:
      clearedMessage = 'Tetty';
      break;
    default:
      break;
  }

  const comboMessage = combo > 0 ? `Combo ${combo}` : '';

  return `${clearedMessage};${comboMessage}`;
};

// Export
export default getMessage;

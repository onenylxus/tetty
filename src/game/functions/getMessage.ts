/**
 * Returns a concatenated message that can be further processed to display to player.
 *
 * Message is joined with semicolon, so it is recommended to use `message.split(';')` before using.
 *
 * @param cleared - Number of lines cleared in one commit
 * @param combo - Current combo count
 * @param backToBack - Back-to-back state
 * @returns Concatenated message
 */
export default function getMessage(cleared: number, combo: number, backToBack: boolean): string {
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
  const backToBackMessage = backToBack ? 'Back-to-Back' : '';

  return `${clearedMessage};${comboMessage};${backToBackMessage}`;
}

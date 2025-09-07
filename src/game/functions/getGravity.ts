/**
 * Returns the time interval for gravity based on the current level.
 *
 * @param level - Current level
 * @returns Time interval in milliseconds
 */
export default function getGravity(level: number): number {
  return (0.8 - (level - 1) * 0.007) ** (level - 1) * 1000;
}

import { DisplayBlockType } from '../types';

/**
 * Returns an empty next queue.
 *
 * @returns Empty queue of length 5
 */
export default function getEmptyQueue(): DisplayBlockType[] {
  return new Array(5).fill(undefined);
}

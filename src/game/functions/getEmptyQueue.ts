// Import
import { DisplayBlockType } from '../types';

// Get empty queue function
const getEmptyQueue = (): DisplayBlockType[] => {
  return (new Array(5)).fill(undefined);
};

// Export
export default getEmptyQueue;

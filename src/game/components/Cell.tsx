// Import
import { CellType } from '../types';

// Cell props
interface Props {
  cellType: CellType;
  next?: boolean;
}

// Cell component
const Cell = ({ cellType, next = false }: Props) => {
  // Return
  return (
    <div className={`cell ${cellType} ${next ? 'next' : ''}`} />
  );

};

// Export
export default Cell;

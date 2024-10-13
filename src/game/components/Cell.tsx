// Import
import { CellType } from '../types';

// Cell props
interface CellProps {
  cellType: CellType;
  mini?: boolean;
}

// Cell component
const Cell = ({ cellType, mini }: CellProps) => {
  // Return
  return <div className={`cell ${cellType} ${mini && 'mini'}`} />;
};

// Export
export default Cell;

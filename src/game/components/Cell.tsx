// Import
import { CellType } from '../types';

// Cell props
interface Props {
  cellType: CellType;
  mini?: boolean;
}

// Cell component
const Cell = ({ cellType, mini }: Props) => {
  // Return
  return <div className={`cell ${cellType} ${mini && 'mini'}`} />;
};

// Export
export default Cell;

// Import
import { CellType } from '../types';

// Cell props
interface Props {
  cellType: CellType;
}

// Cell component
const Cell = ({ cellType }: Props) => {
  // Return
  return (
    <div className={`cell ${cellType}`} />
  );

};

// Export
export default Cell;

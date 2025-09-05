import { CellType } from '../types';

// Cell props
interface CellProps {
  cellType: CellType;
  mini?: boolean;
}

/**
 * Cell component displays a square with specific type and size on screen.
 */
function Cell({ cellType, mini }: CellProps) {
  return <div className={`cell ${cellType} ${mini && 'mini'}`} />;
}

export default Cell;

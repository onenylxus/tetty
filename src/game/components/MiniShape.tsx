// Import
import { BlockType, NonBlockType } from '../types';
import Shapes from '../constants/shapes';
import Cell from './Cell';

// Mini shape props
interface Props {
  className: string;
  block: BlockType | undefined;
}

// Mini shape component
const MiniShape = ({ className, block }: Props) => {
  // Return
  return (
    <div className={className}>
      {block ? (
        Shapes[block as BlockType].filter((row) => row.some((cell) => cell)).map((row, j) => (
          <div className="row" key={`${j}`}>
            {row.map((cell, i) => (
              <Cell cellType={cell ? block : NonBlockType.Empty} mini key={`${j}-${i}`} />
            ))}
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

// Export
export default MiniShape;

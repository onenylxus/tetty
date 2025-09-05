import { BlockType, DisplayBlockType, NonBlockType } from '../types';
import Cell from './Cell';
import Shapes from '../constants/shapes';

// Mini shape props
interface MiniShapeProps {
  className: string;
  block: DisplayBlockType;
}

/**
 * Blocks in hold space and next queue are smaller than that in the board. Mini shape component
 * displays blocks in a smaller size.
 */
function MiniShape({ className, block }: MiniShapeProps) {
  return (
    <div className={className}>
      {block ? (
        Shapes[block as BlockType]
          .filter((row) => row.some((cell) => cell))
          .map((row, j) => (
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
}

export default MiniShape;

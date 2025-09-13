/**
 * Matrix generic type is a two-dimensional array.
 */
export type Matrix<T> = T[][];

/**
 * There are 7 types of blocks (`I`, `J`, `L`, `O`, `S`, `T` and `Z`).
 */
export enum BlockType {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z'
}

/**
 * Next queue and hold space can contain any block type or be empty.
 */
export type DisplayBlockType = BlockType | undefined;

/**
 * In the board, there are also different types that do not lie within the block category.
 */
export enum NonBlockType {
  Empty = 'Empty',
  Ghost = 'Ghost'
}

/**
 * A cell can be either a block type or a non-block type.
 */
export type CellType = BlockType | NonBlockType;

/**
 * Shape type defines the structure of a block.
 */
export type Shape = Matrix<boolean>;

/**
 * A board contains a matrix of cells.
 */
export type BoardMatrix = Matrix<CellType>;

/**
 * Player can perform the following actions to a block:
 *
 * - `Right`: clockwise rotation
 * - `Left`: counterclockwise rotation
 * - `Double`: double rotation
 */
export enum Rotation {
  Right = 1,
  Double,
  Left
}

/**
 * A block has 4 types of orientations (`Zero`, `Right`, `Double` and `Left`).
 */
export enum Orientation {
  Zero,
  Right,
  Double,
  Left
}

/**
 * In **Super Rotation System (SRS)**, it is important to monitor initial and final orientations in
 * order to apply the correct offset.
 */
export enum SRSRotation {
  ZeroToRight,
  RightToZero,
  RightToDouble,
  DoubleToRight,
  DoubleToLeft,
  LeftToDouble,
  LeftToZero,
  ZeroToLeft,
  None
}

/**
 * In **Super Rotation System (SRS)**, after knowing the orientations (as **SRSRotation**), if the
 * block collides with another block after the rotation, apply the next offset from the offset
 * array until the collision is resolved.
 */
export type SRSOffset = {
  [key in SRSRotation]: Matrix<number>;
};

/**
 * State of the board.
 */
export interface BoardState {
  matrix: BoardMatrix;
  dropRow: number;
  dropColumn: number;
  dropBlock: BlockType;
  dropShape: Shape;
  dropOrientation: Orientation;
  isHardDrop: boolean;
  isHold: boolean;
  hardDropRows: number;
}

/**
 * Board action is a collection of all possible player actions within a game.
 */
export interface BoardAction {
  type: 'reset' | 'start' | 'drop' | 'commit' | 'move';
  moveLeft?: boolean;
  moveRight?: boolean;
  rotate?: Rotation;
  hardDrop?: boolean;
  hold?: boolean;
  matrix?: BoardMatrix;
  next?: BlockType;
}

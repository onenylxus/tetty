// Matrix type
export type Matrix<T> = T[][];

// Block type
export enum BlockType {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z'
}

// Display block type
export type DisplayBlockType = BlockType | undefined;

// Non-block type
export enum NonBlockType {
  Empty = 'Empty',
  Ghost = 'Ghost'
}

// Cell type
export type CellType = BlockType | NonBlockType;

// Shape type
export type Shape = Matrix<Boolean>;

// Rotation
export enum Rotation {
  Right = 1,
  Double,
  Left
}

// Orientation
export enum Orientation {
  Zero,
  Right,
  Double,
  Left
}

// Super Rotation System (SRS) rotation
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

// Super Rotation System (SRS) offsets type
export type SRSOffset = {
  [key in SRSRotation]: Matrix<number>;
};

// Board matrix type
export type BoardMatrix = Matrix<CellType>;

// Board state type
export type BoardState = {
  matrix: BoardMatrix;
  dropRow: number;
  dropColumn: number;
  dropBlock: BlockType;
  dropShape: Shape;
  dropOrientation: Orientation;
  isHardDrop: boolean;
  isHold: boolean;
};

// Board action type
export type BoardAction = {
  type: 'reset' | 'start' | 'drop' | 'commit' | 'move';
  moveLeft?: boolean;
  moveRight?: boolean;
  rotate?: Rotation;
  hardDrop?: boolean;
  hold?: boolean;
  matrix?: BoardMatrix;
  next?: BlockType;
};

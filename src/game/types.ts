// Block type
export enum BlockType {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

// Empty type
export enum EmptyType {
  Empty = 'E',
}

// Cell type
export type CellType = BlockType | EmptyType;

// Shape type
export type Shape = boolean[][];

// Rotation
export enum Rotation {
  Right = 1,
  Double,
  Left,
}

// Orientation
export enum Orientation {
  Zero,
  Right,
  Double,
  Left,
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
}

// Super Rotation System (SRS) offsets type
export type SRSOffset = {
  [key in SRSRotation]: number[][];
}

// Board matrix type
export type BoardMatrix = CellType[][];

// Board state type
export type BoardState = {
  matrix: BoardMatrix;
  dropRow: number;
  dropColumn: number;
  dropBlock: BlockType;
  dropShape: Shape;
  dropOrientation: Orientation;
};

// Board action type
export type BoardAction = {
  type: 'start' | 'drop' | 'commit' | 'move';
  moveLeft?: boolean;
  moveRight?: boolean;
  rotate?: Rotation;
  hardDrop?: boolean;
  matrix?: BoardMatrix;
  next?: BlockType;
};

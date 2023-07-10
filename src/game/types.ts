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

// Rotation type
export enum Rotation {
  Left = 'l',
  Right = 'r',
  Double = 'd',
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

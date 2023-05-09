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

// Board type
export type BoardType = CellType[][];

// Shape type
export type Shape = boolean[][];

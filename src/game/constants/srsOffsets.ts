// Import
import { SRSOffset, SRSRotation } from '../types';

// Regular offset constants
const ROffsetA: number[][] = [
  [0, 0],
  [0, -1],
  [-1, -1],
  [2, 0],
  [2, -1],
];
const ROffsetB: number[][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [-2, 0],
  [-2, 1],
];
const ROffsetC: number[][] = [
  [0, 0],
  [0, 1],
  [-1, 1],
  [2, 0],
  [2, 1],
];
const ROffsetD: number[][] = [
  [0, 0],
  [0, -1],
  [1, -1],
  [-2, 0],
  [-2, -1],
];

// I-block offset constants
const IOffsetA: number[][] = [
  [0, 0],
  [0, -2],
  [0, 1],
  [1, -2],
  [-2, 1],
];
const IOffsetB: number[][] = [
  [0, 0],
  [0, 2],
  [0, -1],
  [-1, 2],
  [2, -1],
];
const IOffsetC: number[][] = [
  [0, 0],
  [0, -1],
  [0, 2],
  [-2, -1],
  [1, 2],
];
const IOffsetD: number[][] = [
  [0, 0],
  [0, 1],
  [0, -2],
  [2, 1],
  [-1, -2],
];

// O-block offset constants
const OOffset: number[][] = [
  [0, 0],
];

// Regular offsets
const ROffsets: SRSOffset = {
  [SRSRotation.ZeroToRight]: ROffsetA,
  [SRSRotation.RightToZero]: ROffsetB,
  [SRSRotation.RightToDouble]: ROffsetB,
  [SRSRotation.DoubleToRight]: ROffsetA,
  [SRSRotation.DoubleToLeft]: ROffsetC,
  [SRSRotation.LeftToDouble]: ROffsetD,
  [SRSRotation.LeftToZero]: ROffsetD,
  [SRSRotation.ZeroToLeft]: ROffsetC,
};

// I-block offsets
const IOffsets: SRSOffset = {
  [SRSRotation.ZeroToRight]: IOffsetA,
  [SRSRotation.RightToZero]: IOffsetB,
  [SRSRotation.RightToDouble]: IOffsetC,
  [SRSRotation.DoubleToRight]: IOffsetD,
  [SRSRotation.DoubleToLeft]: IOffsetB,
  [SRSRotation.LeftToDouble]: IOffsetA,
  [SRSRotation.LeftToZero]: IOffsetD,
  [SRSRotation.ZeroToLeft]: IOffsetC,
};

// O-block offsets
const OOffsets: SRSOffset = {
  [SRSRotation.ZeroToRight]: OOffset,
  [SRSRotation.RightToZero]: OOffset,
  [SRSRotation.RightToDouble]: OOffset,
  [SRSRotation.DoubleToRight]: OOffset,
  [SRSRotation.DoubleToLeft]: OOffset,
  [SRSRotation.LeftToDouble]: OOffset,
  [SRSRotation.LeftToZero]: OOffset,
  [SRSRotation.ZeroToLeft]: OOffset,
};

// Export
export default {
  I: IOffsets,
  J: ROffsets,
  L: ROffsets,
  O: OOffsets,
  S: ROffsets,
  T: ROffsets,
  Z: ROffsets,
};

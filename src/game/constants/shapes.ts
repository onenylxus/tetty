// Import
import { Shape } from '../types';

// Conventions
const T = true;
const F = false;

// I-block shape
const IShape: Shape = [
  [F, F, F, F],
  [T, T, T, T],
  [F, F, F, F],
  [F, F, F, F]
];

// J-block shape
const JShape: Shape = [
  [T, F, F],
  [T, T, T],
  [F, F, F]
];

// L-block shape
const LShape: Shape = [
  [F, F, T],
  [T, T, T],
  [F, F, F]
];

// O-block shape
const OShape: Shape = [
  [T, T],
  [T, T]
];

// S-block shape
const SShape: Shape = [
  [F, T, T],
  [T, T, F],
  [F, F, F]
];

// T-block shape
const TShape: Shape = [
  [F, T, F],
  [T, T, T],
  [F, F, F]
];

// Z-block shape
const ZShape: Shape = [
  [T, T, F],
  [F, T, T],
  [F, F, F]
];

// Export
export default {
  I: IShape,
  J: JShape,
  L: LShape,
  O: OShape,
  S: SShape,
  T: TShape,
  Z: ZShape
};

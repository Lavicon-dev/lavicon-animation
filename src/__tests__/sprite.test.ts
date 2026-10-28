import { describe, expect, it } from 'vitest';
import { spriteBackgroundPosition } from '../lib/sprite';

describe('spriteBackgroundPosition', () => {
  const cols = 10;
  const size = 196;

  it('première frame : origine de la grille', () => {
    expect(spriteBackgroundPosition(0, cols, size)).toBe('-0px -0px');
  });

  it('dernière colonne de la première ligne', () => {
    expect(spriteBackgroundPosition(cols - 1, cols, size)).toBe(`-${9 * size}px -0px`);
  });

  it('passage à la ligne suivante', () => {
    expect(spriteBackgroundPosition(cols, cols, size)).toBe(`-0px -${size}px`);
  });

  it('dernière frame de la grille par défaut (150 frames)', () => {
    expect(spriteBackgroundPosition(149, cols, size)).toBe(`-${9 * size}px -${14 * size}px`);
  });

  it('dernière ligne partielle (145 frames)', () => {
    expect(spriteBackgroundPosition(144, cols, size)).toBe(`-${4 * size}px -${14 * size}px`);
  });

  it('une seule colonne : une frame par ligne', () => {
    expect(spriteBackgroundPosition(3, 1, size)).toBe(`-0px -${3 * size}px`);
  });
});

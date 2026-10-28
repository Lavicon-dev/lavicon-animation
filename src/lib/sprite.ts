/**
 * Position CSS (background-position) d'une frame dans une spritesheet en
 * grille : les frames se lisent de gauche à droite puis de haut en bas.
 */
export function spriteBackgroundPosition(frame: number, cols: number, frameSize: number): string {
  const col = frame % cols;
  const row = Math.floor(frame / cols);
  return `-${col * frameSize}px -${row * frameSize}px`;
}

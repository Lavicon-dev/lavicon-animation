import { act } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * requestAnimationFrame piloté à la main : jsdom n'avance pas tout seul, et
 * animateSprite calcule son avancement à partir du timestamp reçu. Chaque
 * step(ms) avance l'horloge de ms puis exécute les callbacks en attente.
 */
export function installRaf() {
  let now = 1000;
  let nextId = 0;
  const queue = new Map<number, FrameRequestCallback>();

  const raf = vi.fn((cb: FrameRequestCallback) => {
    const id = ++nextId;
    queue.set(id, cb);
    return id;
  });
  const caf = vi.fn((id: number) => {
    queue.delete(id);
  });
  vi.stubGlobal('requestAnimationFrame', raf);
  vi.stubGlobal('cancelAnimationFrame', caf);

  const step = (ms = 1000 / 60) => {
    now += ms;
    const callbacks = Array.from(queue.values());
    queue.clear();
    act(() => {
      for (const cb of callbacks) cb(now);
    });
  };

  return {
    raf,
    caf,
    step,
    steps(count: number, ms?: number) {
      for (let i = 0; i < count; i++) step(ms);
    },
    /** Boucles du composant encore ordonnancées (hors celles de framer-motion). */
    pendingSprite() {
      return Array.from(queue.values()).filter((cb) => cb.name === 'animateSprite').length;
    },
  };
}

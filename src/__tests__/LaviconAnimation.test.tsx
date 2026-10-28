import React, { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import LaviconAnimation, { LaviconAnimation as NamedExport } from '../index';
import { installRaf } from './raf';

const FRAME = 196;
const COLS = 10;
// 30 fps par défaut : un pas de 34 ms avance d'une frame
const STEP = 34;

let raf: ReturnType<typeof installRaf>;

beforeEach(() => {
  raf = installRaf();
});

function getRoot() {
  return screen.getByRole('img');
}

function getSprite() {
  return getRoot().firstElementChild!.firstElementChild as HTMLElement;
}

/** Frame affichée, relue depuis background-position. */
function currentFrame(cols = COLS, frameSize = FRAME) {
  const [x, y] = getSprite().style.backgroundPosition.split(' ').map((v) => Math.abs(parseFloat(v)));
  return (y / frameSize) * cols + x / frameSize;
}

describe('rendu et props par défaut', () => {
  it('export par défaut et export nommé désignent le même composant', () => {
    expect(NamedExport).toBe(LaviconAnimation);
  });

  it('rend un img accessible, carré de 96 px, sur la spritesheet donnée', () => {
    render(<LaviconAnimation url="/sprite.png" />);
    const root = getRoot();
    expect(root).toHaveAttribute('aria-label', 'Animation sprite');
    expect(root.style.width).toBe('96px');
    expect(root.style.height).toBe('96px');
    expect(root.style.cursor).toBe('default');

    const sprite = getSprite();
    expect(sprite.style.backgroundImage).toMatch(/^url\("?\/sprite\.png"?\)$/);
    expect(sprite.style.width).toBe(`${FRAME}px`);
    expect(sprite.style.backgroundSize).toMatch(new RegExp(`^${COLS * FRAME}px( auto)?$`));
    expect(sprite.style.transform).toBe(`scale(${96 / FRAME})`);
    expect(currentFrame()).toBe(0);
  });

  it('applique size, frameSize, cols, alt, className et initialFrame', () => {
    render(
      <LaviconAnimation url="/s.png" size={48} frameSize={100} cols={5} alt="Logo" className="mon-icone" initialFrame={7} />,
    );
    const root = getRoot();
    expect(root).toHaveAttribute('aria-label', 'Logo');
    expect(root).toHaveClass('mon-icone');
    expect(root.style.width).toBe('48px');
    expect(getSprite().style.backgroundSize).toMatch(/^500px( auto)?$/);
    expect(currentFrame(5, 100)).toBe(7);
  });

  it('curseur pointeur en mode click ou avec cursorPointer', () => {
    const { unmount } = render(<LaviconAnimation url="/s.png" triggerMode="click" />);
    expect(getRoot().style.cursor).toBe('pointer');
    unmount();
    render(<LaviconAnimation url="/s.png" cursorPointer />);
    expect(getRoot().style.cursor).toBe('pointer');
  });

  it("aucune animation n'est lancée au montage en mode hover", () => {
    render(<LaviconAnimation url="/s.png" />);
    raf.steps(10, STEP);
    expect(currentFrame()).toBe(0);
    expect(raf.pendingSprite()).toBe(0);
  });

  it('un chargement raté de la spritesheet ne casse pas le rendu (aucun onError exposé)', () => {
    // La spritesheet est une background-image : pas d'événement d'erreur, le
    // composant reste rendu, vide. Comportement actuel documenté.
    render(<LaviconAnimation url="/introuvable.png" />);
    expect(getRoot()).toBeInTheDocument();
    expect(getSprite().style.backgroundImage).toContain('/introuvable.png');
  });
});

describe('mode hover', () => {
  it('avance au survol, une frame par intervalle', () => {
    render(<LaviconAnimation url="/s.png" />);
    fireEvent.mouseEnter(getRoot());
    raf.step(STEP); // première frame : prise de référence du temps
    raf.steps(5, STEP);
    expect(currentFrame()).toBe(5);
  });

  it("ne dépasse pas la dernière frame tant que le survol dure", () => {
    render(<LaviconAnimation url="/s.png" totalFrames={4} />);
    fireEvent.mouseEnter(getRoot());
    raf.steps(20, STEP);
    expect(currentFrame()).toBe(3);
  });

  it('revient à la frame initiale quand le survol cesse', () => {
    render(<LaviconAnimation url="/s.png" />);
    fireEvent.mouseEnter(getRoot());
    raf.steps(11, STEP);
    expect(currentFrame()).toBe(10);
    fireEvent.mouseLeave(getRoot());
    raf.steps(40, STEP);
    expect(currentFrame()).toBe(0);
  });

  // Défaut connu, non corrigé ici : animateSprite lit currentFrame par
  // fermeture, figé à la valeur du rendu de sortie de survol. La condition
  // « backward && currentFrame > initialFrame » reste vraie et la boucle rAF
  // tourne indéfiniment après le retour à la frame initiale. Passer ce test
  // en it() le jour où la fermeture est corrigée.
  it.fails('arrête sa boucle rAF une fois revenu à la frame initiale', () => {
    render(<LaviconAnimation url="/s.png" />);
    fireEvent.mouseEnter(getRoot());
    raf.steps(11, STEP);
    fireEvent.mouseLeave(getRoot());
    raf.steps(200, STEP);
    expect(currentFrame()).toBe(0);
    expect(raf.pendingSprite()).toBe(0);
  });
});

describe('mode click', () => {
  it("joue jusqu'à la fin, revient au début puis s'arrête", () => {
    render(<LaviconAnimation url="/s.png" triggerMode="click" totalFrames={5} />);
    fireEvent.click(getRoot());
    raf.step(STEP);
    raf.steps(2, STEP);
    expect(currentFrame()).toBe(2);
    raf.steps(20, STEP);
    expect(currentFrame()).toBe(0);
    expect(raf.pendingSprite()).toBe(0);
  });

  it('ignore un second clic pendant la lecture et appelle onClick à chaque clic', () => {
    let clicks = 0;
    render(<LaviconAnimation url="/s.png" triggerMode="click" totalFrames={10} onClick={() => clicks++} />);
    fireEvent.click(getRoot());
    raf.steps(4, STEP);
    const frame = currentFrame();
    fireEvent.click(getRoot());
    raf.step(STEP);
    expect(currentFrame()).toBe(frame + 1);
    expect(clicks).toBe(2);
  });

  it('peut être rejouée une fois revenue au début', () => {
    render(<LaviconAnimation url="/s.png" triggerMode="click" totalFrames={3} />);
    fireEvent.click(getRoot());
    raf.steps(20, STEP);
    expect(currentFrame()).toBe(0);
    fireEvent.click(getRoot());
    raf.steps(3, STEP);
    expect(currentFrame()).toBe(2);
  });

  it("le survol seul ne lance rien en mode click", () => {
    render(<LaviconAnimation url="/s.png" triggerMode="click" />);
    fireEvent.mouseEnter(getRoot());
    raf.steps(10, STEP);
    expect(currentFrame()).toBe(0);
  });
});

describe('mode auto', () => {
  it('démarre seul avec autoPlay et reste sur la dernière frame sans loop', () => {
    render(<LaviconAnimation url="/s.png" triggerMode="auto" autoPlay totalFrames={4} />);
    raf.steps(3, STEP);
    expect(currentFrame()).toBe(2);
    raf.steps(10, STEP);
    expect(currentFrame()).toBe(3);
  });

  it('reboucle sur la frame initiale avec loop', () => {
    render(<LaviconAnimation url="/s.png" triggerMode="auto" autoPlay loop totalFrames={4} />);
    raf.step(STEP);
    raf.steps(3, STEP);
    expect(currentFrame()).toBe(0);
    raf.step(STEP);
    expect(currentFrame()).toBe(1);
  });

  it('sans autoPlay, le mode auto ne démarre pas', () => {
    render(<LaviconAnimation url="/s.png" triggerMode="auto" />);
    raf.steps(10, STEP);
    expect(currentFrame()).toBe(0);
  });
});

describe('cadence', () => {
  it('fps plafonné à 120 : jamais plus de 3 frames par callback', () => {
    render(<LaviconAnimation url="/s.png" triggerMode="auto" autoPlay fps={240} />);
    raf.step(STEP);
    raf.step(1000); // gros saut d'horloge (onglet en arrière-plan)
    expect(currentFrame()).toBe(3);
  });

  it('fps = 0 : animation figée, sans erreur (comportement actuel)', () => {
    render(<LaviconAnimation url="/s.png" triggerMode="auto" autoPlay fps={0} />);
    raf.steps(10, STEP);
    expect(currentFrame()).toBe(0);
  });

  it('totalFrames = 1 : reste sur la frame unique', () => {
    render(<LaviconAnimation url="/s.png" triggerMode="auto" autoPlay totalFrames={1} />);
    raf.steps(10, STEP);
    expect(currentFrame()).toBe(0);
  });
});

describe('nettoyage', () => {
  it.each([
    ['hover', { triggerMode: 'hover' as const }, (el: HTMLElement) => fireEvent.mouseEnter(el)],
    ['click', { triggerMode: 'click' as const }, (el: HTMLElement) => fireEvent.click(el)],
    ['auto', { triggerMode: 'auto' as const, autoPlay: true, loop: true }, () => {}],
  ])("aucun rAF du composant ne survit au démontage (%s)", (_mode, props, start) => {
    const { unmount } = render(<LaviconAnimation url="/s.png" {...props} />);
    start(getRoot());
    raf.steps(3, STEP);
    expect(raf.pendingSprite()).toBe(1);
    unmount();
    expect(raf.pendingSprite()).toBe(0);
    const calls = raf.raf.mock.calls.filter(([cb]) => cb.name === 'animateSprite').length;
    raf.steps(10, STEP);
    expect(raf.raf.mock.calls.filter(([cb]) => cb.name === 'animateSprite').length).toBe(calls);
  });

  it('StrictMode (montage, démontage, remontage) : une seule boucle, rien après démontage', () => {
    const { unmount } = render(
      <StrictMode>
        <LaviconAnimation url="/s.png" triggerMode="auto" autoPlay loop />
      </StrictMode>,
    );
    raf.step(STEP);
    raf.steps(3, STEP);
    expect(raf.pendingSprite()).toBe(1);
    expect(currentFrame()).toBe(3);
    unmount();
    expect(raf.pendingSprite()).toBe(0);
  });
});

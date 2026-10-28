# lavicon-animation

A React component for easily creating sprite sheet animations from Lavicon.dev animations.

## Installation

```bash
npm install lavicon-animation
# or
yarn add lavicon-animation
```

## Required Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom framer-motion
```

## Compatibility

Tested on 2026-10-28. "Unit tests" is the Vitest suite run against each
combination; "Packed tarball" is a clean consumer project installing the
`npm pack` output (no peer warning, CommonJS `require`, ESM `import`,
server rendering with `react-dom/server`, and a strict TypeScript check of
the public types).

| React | framer-motion | Unit tests | Packed tarball |
|-------|---------------|------------|----------------|
| 18.3  | 10.18         | passed     | passed         |
| 18.3  | 11.18         | passed     | passed         |
| 18.3  | 12.43         | passed     | passed         |
| 18.3  | 14.7          | passed     | not run        |
| 19.3  | 12.43         | passed     | passed         |
| 19.3  | 13.5          | passed     | not run        |
| 19.3  | 14.7          | passed     | passed         |

React 16 and 17 are not supported. React 19 with framer-motion 10 is not
supported by framer-motion 10 itself (its peer range stops at React 18).

### `framer-motion` or `motion`?

framer-motion was renamed `motion`, but the `framer-motion` package is still
published, at the same version as `motion`, and is not deprecated. This
package keeps `framer-motion` as its peer dependency: switching would break
the install of every existing integrator for no functional gain. Projects that
only install `motion` still work, because `motion` depends on `framer-motion`
(checked with `motion@14`, framer-motion is then resolved once). A move to
`motion` will be considered for a 2.0.0, or if `framer-motion` gets
deprecated on npm.

## Usage

```jsx
import { LaviconAnimation } from 'lavicon-animation';

const MyComponent = () => {
  return (
    
      Sprite Animation Example
      
    
  );
};

export default MyComponent;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | (required) | URL of the spritesheet (from the public folder) |
| `size` | `number` | 96 | Size of the displayed icon (square) |
| `frameSize` | `number` | 196 | Size of each frame in the spritesheet |
| `fps` | `number` | 30 | Frames per second for the animation |
| `cols` | `number` | 10 | Number of columns in the spritesheet |
| `totalFrames` | `number` | 150 | Total number of frames in the spritesheet |
| `triggerMode` | `"hover" \| "click" \| "auto"` | "hover" | Trigger mode for the animation |
| `loop` | `boolean` | false | Loop the animation in auto or click mode |
| `initialFrame` | `number` | 0 | Initial frame |
| `className` | `string` | "" | Additional CSS classes |
| `alt` | `string` | "Animation sprite" | Alt text for accessibility |
| `onClick` | `() => void` | undefined | Additional onClick callback |
| `autoPlay` | `boolean` | false | Start the animation automatically |
| `renderingQuality` | `"auto" \| "crisp-edges" \| "pixelated"` | "crisp-edges" | Rendering quality |
| `cursorPointer` | `boolean` | false | Enable/disable cursor pointer |

## Usage Examples

### Hover Animation

```jsx
<LaviconAnimation 
  url="/icons/spritesheet.png"
  triggerMode="hover"
  size={64}
  cols={8}
  totalFrames={24}
/>
```

### Click Animation

```jsx
<LaviconAnimation 
  url="/icons/spritesheet.png"
  triggerMode="click"
  size={128}
  cols={10}
  totalFrames={50}
  loop={false}
/>
```

### Auto-playing Loop Animation

```jsx
<LaviconAnimation 
  url="/icons/spritesheet.png"
  triggerMode="auto"
  autoPlay={true}
  loop={true}
  size={48}
  cols={12}
  totalFrames={36}
/>
```

## License

MIT
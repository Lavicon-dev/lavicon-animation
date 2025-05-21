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
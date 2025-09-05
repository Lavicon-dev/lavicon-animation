# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **lavicon-animation**, a React component library that provides spritesheet animation functionality for icons. It's a TypeScript-based NPM package designed to work with spritesheets generated from lavicon.dev.

## Development Commands

### Build and Development
```bash
npm run build          # Build the library using Rollup
npm run prepublishOnly  # Build before publishing (runs automatically)
```

### Testing
Currently no test framework is configured. The `npm run test` command exists but is not implemented.

## Architecture

### Package Structure
- **Entry point**: `src/index.ts` - exports main component and types
- **Core component**: `src/components/LaviconAnimation.tsx` - main animation component
- **Build output**: `dist/` directory with CommonJS, ESM, and TypeScript declarations

### Build System
- **Bundler**: Rollup with TypeScript compilation
- **Output formats**: CommonJS (`dist/index.js`), ES Module (`dist/index.esm.js`), TypeScript declarations (`dist/index.d.ts`)
- **Configuration**: `rollup.config.cjs` with Terser minification
- **Peer dependencies**: React >=16.8.0, React DOM >=16.8.0, Framer Motion >=4.0.0

### Component Architecture
The main `LaviconAnimation` component provides:
- Spritesheet animation with configurable grid layout (cols, totalFrames)
- Multiple trigger modes: hover, click, auto
- Animation controls: FPS, looping, initial frame positioning
- Framer Motion integration for UI micro-interactions
- Custom animation loop using `requestAnimationFrame`
- Accessibility support with ARIA labels

### TypeScript Configuration
- **Target**: ES5 for broad compatibility
- **Module**: ESNext with Node resolution
- **Strict mode**: Enabled
- **JSX**: React JSX transform
- **Output**: `dist/` with type declarations

## Key Props Interface
- **Required**: `url` (spritesheet path)
- **Optional**: `size`, `frameSize`, `fps`, `cols`, `totalFrames`, `triggerMode`, `loop`, `initialFrame`, `displaySize`, `alt`
- **Types**: `LaviconAnimationProps`, `TriggerMode` exported from package

## Development Notes

### Animation Implementation
- Frame-based animation system with configurable FPS
- Spritesheet positioning using CSS transforms
- Performance optimized with `requestAnimationFrame`
- Framer Motion for scale and opacity transitions

### Missing Development Tools
- No test framework configured
- No linting configuration (ESLint/Prettier)
- No development environment (Storybook, demo app)
- No CI/CD configuration
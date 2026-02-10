# CLAUDE.md

## Project Overview

**mediocre-hass-media-player-cards** — Custom Home Assistant Lovelace cards for media player entities. Provides four card types: Standard, Massive, Multi, and Chip Group. Built with Preact + TypeScript, distributed as a single UMD JS bundle via HACS.

## Tech Stack

- **UI**: Preact 10.x (React-compatible, JSX import source: `preact`)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: @emotion/react (CSS-in-JS, object style, `css` prop)
- **Build**: Vite 7.x (UMD output)
- **Package Manager**: Yarn 1.x
- **Testing**: Jest 30.x with ts-jest + jsdom
- **Linting**: ESLint 9.x (TypeScript strict + React/Emotion plugins)
- **Formatting**: Prettier (double quotes, trailing commas ES5, 80 col)
- **Runtime Validation**: arktype

## Commands

```bash
yarn dev            # Dev build (unminified)
yarn dev:watch      # Dev build with watch
yarn build          # Production build (minified)
yarn lint           # ESLint check
yarn lint:fix       # ESLint auto-fix
yarn format         # Prettier format
yarn test           # Run Jest tests
yarn test:watch     # Jest watch mode
yarn test:coverage  # Jest with coverage
yarn tsc            # TypeScript type check
```

## Project Structure

```
src/
├── cards/          # Card entry points (web component wrappers + editors)
├── components/     # Preact components (35+), organized by feature
├── hooks/          # Custom Preact hooks (usePlayerActions, useArtworkColors, etc.)
├── utils/          # Pure utility functions (28+)
├── types/          # TypeScript types + arktype schemas
├── constants/      # Theme and animation constants
└── wrappers/       # CardWrapper / CardEditorWrapper base classes
docs/               # User-facing documentation per feature
```

## Architecture Patterns

- **Web Component Wrappers**: Cards extend `CardWrapper` which bridges Lovelace lifecycle to Preact rendering
- **Context Providers**: `CardContext`, `PlayerContext`, `HassContext` — shared state via Preact context
- **Named exports only** — no default exports
- **Functional components + hooks** — no class components
- **Container queries** for responsive layout (not media queries, since cards can be placed anywhere)
- **Emotion object style** — `css` prop with a `styles` object at top of file
- **Service calls** via `getHass().callService(...)`
- **Path aliases**: `@components`, `@hooks`, `@types`, `@utils`, `@wrappers`, `@constants`

## Code Style

- Follow existing patterns; keep components small and composable
- Reuse existing utils and types before creating new ones
- Tests live alongside source files as `*.test.ts` / `*.test.tsx`
- Prefer minimal changes; don't over-engineer

## Git Workflow

- Main branch: `main`
- Feature branches merged via PR
- CI runs: tests, tsc, prettier check, lint, build

# AI Agent Project Context README

This README is intended for AI agents (such as GitHub Copilot or other automated coding assistants) to provide essential context before starting any new task in this repository.

## Project Overview

- **Repository Name:** mediocre-hass-media-player-cards
- **Owner:** antontanderup
- **Main Purpose:**
  - This project provides custom Home Assistant Lovelace cards for media player entities, including advanced group and massive player cards.
  - The codebase is written in TypeScript/Preact (with React-like syntax) and is structured for modularity and reusability.

## Key Directories & Files

- `src/` — Main source code
  - `cards/` — Card components (main entry points for Lovelace cards)
  - `components/` — Shared Preact components (UI, context, utilities)
  - `constants/`, `hooks/`, `types/`, `utils/`, `wrappers/` — Supporting code
- `docs/` — Additional documentation for search, styling, and usage
- `package.json` — Project dependencies and scripts
- `vite.config.ts` — Build configuration
- `tsconfig*.json` — TypeScript configuration

## Development Scripts & Tooling

- **Package Manager:** Yarn
- **Build Tool:** Vite
- **Linting:** ESLint (`yarn lint`, `yarn lint:fix`)
- **Formatting:** Prettier (`yarn format`)
- **Testing:** Jest (`yarn test`, `yarn test:watch`, `yarn test:coverage`)
- **Type Checking:** TypeScript (`yarn tsc`)

**Common scripts:**

- `yarn dev` — Build in development mode
- `yarn dev:watch` — Build in development mode and watch for changes
- `yarn build` — Production build
- `yarn lint` — Lint all source files
- `yarn lint:fix` — Lint and auto-fix issues
- `yarn format` — Format codebase with Prettier
- `yarn test` — Run all tests
- `yarn test:watch` — Run tests in watch mode
- `yarn test:coverage` — Run tests with coverage report
- `yarn tsc` — Run TypeScript type checking

- **Language:** TypeScript (Preact; React-compatible syntax)
- **Linting:** ESLint (`eslint.config.ts`)
- **Testing:** Jest (`jest.config.json`)
- **Formatting:** Follow existing code style and structure

## Task Guidance for AI Agents

- **Respect modular structure:** Place new features/components in the most appropriate subdirectory.
- **Reuse existing utilities and types** where possible.
- **Update or create tests** for new or changed logic.
- **Update documentation** in `docs/` if user-facing behavior changes.
- **Do not leak secrets or credentials.**
- **Follow Home Assistant and Lovelace card conventions.**

## How to Start

1. **Analyze the user request** and determine which files or components are relevant.
2. **Search for existing implementations** before creating new code.
3. **Apply changes in a minimal, non-breaking way.**
4. **Validate with linting and tests.**
5. **Document any new features or changes.**

## Common Component Patterns

The following patterns are consistently used throughout the codebase and should be followed when creating or updating components:

1. **Export Style:**

   - Components should always be named exported, not default exported.

2. **Functional Components with Hooks:**

   - All components are functional and use Preact hooks (`useContext`, `useState`, `useCallback`, `useMemo`, etc.) for state and side effects.

3. **Context Usage:**

   - Shared state and configuration are accessed via context providers (e.g., `CardContext`, `PlayerContext`).

4. **CSS-in-JS Styling:**

   - Styling is handled using `@emotion/react`'s `css` function, with a `styles` object at the top of each file. Styles are applied using the `css` prop.

5. **Modular, Composable UI:**

   - Components are small, focused, and composed together to build complex UIs.

6. **Utility and Type Imports:**

   - Utilities (e.g., `getHass`, `getVolumeIcon`) and types (e.g., `MediocreMediaPlayerCardConfig`) are imported from `@utils` and `@types`.

7. **Service Calls via Utility Functions:**

   - Interactions with Home Assistant (e.g., calling services) are abstracted through utility functions like `getHass().callService(...)`.

8. **Conditional Rendering:**

   - UI elements are conditionally rendered based on props, context, or state.

9. **Prop-Driven and Configurable:**

   - Components accept props and/or read from config/context, making them highly configurable and reusable.

10. **Responsiveness (Container Queries Only):**

- Components should use container queries (not regular media queries) for responsive design, as cards can be placed anywhere within the UI.

- The main branch is `main`. Feature branches should be merged via pull request.
- For any ambiguity, prefer to ask for clarification or follow best practices for TypeScript/Preact and Home Assistant custom cards.

---

_This file is for AI agent consumption. Human contributors may refer to `README.md` for user-facing documentation._

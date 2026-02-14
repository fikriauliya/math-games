# CLAUDE.md

## Project Overview
Math & Logic Games for Kids — a collection of browser-based educational games for the Auliya family. Deployed at https://game.levifikri.com.

## Tech Stack
- **Runtime/Bundler:** Bun (HTML imports, TypeScript support)
- **Language:** TypeScript (strict mode)
- **Logic Layer:** Effect.ts (Effect.gen, Either, Brand, Schema, pipe)
- **Styling:** Plain CSS (no framework), responsive with media queries
- **Deployment:** Netlify via GitHub Actions (auto-deploy on push to `master`)
- **Testing:** bun:test

## Project Structure
```
├── index.html              # Homepage — game listing
├── style.css               # Homepage styles
├── netlify.toml            # Build config + headers + redirects
├── games/
│   ├── tug-of-war/         # 2-player math battle
│   ├── speed-math/         # Math racer (1P)
│   ├── bubble-pop/         # Pop matching bubbles (1P)
│   ├── memory-math/        # Card matching (1-2P)
│   ├── number-ninja/       # Falling math problems (1P)
│   ├── toddler-animals/    # Animal sounds quiz (ages 2-4)
│   ├── toddler-colors/     # Colors, shapes, counting (ages 2-4)
│   └── toddler-numbers/    # Counting 1-5 (ages 2-4)
│
│   Each game has:
│   ├── index.html          # HTML entry point
│   ├── app.ts              # DOM layer (imports from logic.ts)
│   ├── logic.ts            # Pure functions (Effect.ts, no DOM)
│   ├── logic.test.ts       # Unit tests (bun:test)
│   └── style.css           # Game-specific styles
```

## Commands
```bash
# Install dependencies
bun install

# Run tests
bun test

# Build for production
bun build ./index.html ./games/*/index.html --outdir=dist --minify

# Dev server
bun ./index.html
```

## Architecture Principles
- **logic.ts** must be pure — no DOM, no side effects. All randomness wrapped in Effect.
- **app.ts** is the DOM glue — imports from logic.ts, handles UI.
- Games expose `startGame()` via `(window as any).startGame = startGame` for HTML onclick handlers.
- Back links from games point to `/` (homepage), not `/games/`.

## CI/CD
- Push to `master` → GitHub Actions runs tests → builds → deploys to Netlify
- Netlify site: `tug-of-war-math-levi` (ID: `e99a6e3a-9257-4a21-8994-d4285aa1e736`)
- Custom domain: `game.levifikri.com`
- **Never manually deploy** — let CI handle it.

## Testing
- 60 tests across 8 games, 507 assertions
- Tests cover: question generation, answer validation, scoring, shuffling, game state
- All logic tests are DOM-free (test logic.ts directly)

## Style Guidelines
- Mobile-first responsive design
- Breakpoints: 480px (phone), 768px (tablet)
- Touch targets: minimum 44px
- Use `clamp()` for font scaling, `100dvh` for full height
- Safe areas for notched phones: `env(safe-area-inset-*)`
- Toddler games use Bahasa Indonesia

## Effect.ts Patterns Used
- `Effect.gen` + `Effect.sync` for random number generation
- `Either` for answer validation (Right = correct, Left = wrong)
- `Brand` for typed values (Score, RopeOffset)
- `Schema` for config validation
- Plain wrapper functions exported alongside Effect versions for app.ts compatibility

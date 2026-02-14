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

## Game Design Principles

### Target Audience
- **Math Games (ages 6-12):** Yusuf (10yo) and friends. Quiz/action format, competitive.
- **Toddler Games (ages 2-4):** Fatih (2yo). Sensory, no-fail, exploratory.

### Core Loop: Why Kids Come Back
Every game must have:
1. **Moment-to-moment juice** — sound on every tap, visual feedback on every action, streak animations
2. **Session progression** — difficulty should scale within a session (start easy, get harder on correct answers)
3. **Personal best** — localStorage high scores, "NEW RECORD!" celebration, shown on start screen
4. **Confetti on perfect** — reward excellence with canvas particle explosion

### Sound Design (via `lib/sounds.ts`)
- Every game has sound effects via Web Audio API (synthesized, no files)
- Every game has a mute toggle (🔊/🔇) top-right, persisted in localStorage
- Correct: rising two-tone beep. Wrong: gentle bonk. Combo: escalating pitch. Win: ascending fanfare.
- **Toddler games: BOTH correct and wrong sounds must be pleasant** — different pitch, both happy

### UX Rules
- **Onboarding:** New players should understand the game in 3 seconds. Add animated tutorial on first play if needed.
- **Touch targets:** Minimum 44px, toddler games 30-40% of screen per button
- **No accidental exits:** Add pause button and quit confirmation
- **"One more round" flow:** After results, show gap to beat record, minimize friction to replay
- **Toddler games:** Max 2 choices (not 4), auto-advance on wrong, immediate spoken audio feedback (SpeechSynthesis)

### Visual Identity
Each game has its own themed look — unique background gradient, accent colors, and subtle CSS effects:
- **Tug of War:** Stadium green field
- **Math Racer:** Dark asphalt + neon accents, speed lines
- **Bubble Pop:** Deep ocean blue gradient, floating bubble particles
- **Memory Math:** Mystical purple + gold glow
- **Number Ninja:** Dark dojo, red/white accents
- **Tap Warna:** Rainbow pastel playroom
- **Suara Hewan:** Farm sunrise, earthy tones, grass silhouette
- **Hitung Yuk:** Chalkboard green, chalk-white text

When adding new games:
- Pick a unique theme that matches the gameplay
- Use CSS-only background effects (::before/::after, opacity 0.1-0.3)
- Toddler games stay bright/friendly (no dark themes)
- Add matching accent color to homepage game card

### Homepage
- Each game card has a themed accent (gradient or border)
- Show high score ("🏆 Best: X") and last played time per game
- Age labels visible: "Ages 6-10" / "Ages 2-4"

### Shared Libraries (`lib/`)
- `lib/sounds.ts` — Web Audio sound effects + mute toggle
- `lib/storage.ts` — High scores + last played (localStorage)
- `lib/confetti.ts` — Canvas particle confetti for celebrations

### Adding a New Game Checklist
1. Create `games/<game-name>/` with `index.html`, `app.ts`, `logic.ts`, `logic.test.ts`, `style.css`
2. `logic.ts`: Pure functions with Effect.ts, no DOM
3. `app.ts`: Import from `logic.ts` + `lib/sounds.ts` + `lib/storage.ts` + `lib/confetti.ts`
4. Add sound effects (correct/wrong/win), mute button (`initMuteButton()`), high scores, confetti on perfect
5. Give it a unique visual theme (background gradient + accent colors + CSS effects)
6. Add responsive breakpoints (480px, 768px), touch targets 44px+, `100dvh`
7. Add game card to homepage `index.html` with themed accent
8. Write 5+ tests in `logic.test.ts`
9. Expose `startGame()` via `(window as any).startGame = startGame`
10. Back link → `/` (not `/games/`)

## Effect.ts Patterns Used
- `Effect.gen` + `Effect.sync` for random number generation
- `Either` for answer validation (Right = correct, Left = wrong)
- `Brand` for typed values (Score, RopeOffset)
- `Schema` for config validation
- Plain wrapper functions exported alongside Effect versions for app.ts compatibility

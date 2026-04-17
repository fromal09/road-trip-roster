# Road Trip Roster

A daily sports trivia game where players follow an animated career journey across a US map and guess the mystery athlete. Think Wordle-meets-geography-meets-sports-history.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom design system below)
- **Map**: react-simple-maps v3 + d3-geo (geoAlbersUsa projection)
- **Deployment**: Vercel
- **GitHub**: github.com/fromal09/road-trip-roster

## Local Dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Architecture

```
app/
  page.tsx         # Main game page — full game loop, state machine
  layout.tsx       # Root layout (fonts, metadata)
  globals.css      # Tailwind + Google Fonts + custom keyframes
  api/daily/       # Daily puzzle API (for future server usage)

components/
  GameMap.tsx      # react-simple-maps map + animated journey + ghost paths
  GuessInput.tsx   # Autocomplete player search with keyboard nav
  PlayerReveal.tsx # Card shown after guess/failure
  StopList.tsx     # Sidebar showing route stops
  DailyComplete.tsx # End-of-session results + share

lib/
  types.ts         # TypeScript interfaces
  players.ts       # Player database (expand here!)
  daily.ts         # Daily puzzle logic, scoring, vehicle helpers
```

## Key Concepts

### Game State Machine (page.tsx)
```
landing → animating → guessing → revealed → (next player or complete)
```

### Map Architecture
- `ComposableMap` renders the geography layer
- `MapLayers` (child of ComposableMap) uses `useMap()` hook to access d3-geo projection
- All city markers and animated paths are computed using `projection([lng, lat])`
- Ghost paths rendered for wrong guesses (fetched from player DB by name)

### Animation System (GameMap.tsx)
- Each journey leg is an `AnimatedLeg` component
- Uses `stroke-dasharray` / `stroke-dashoffset` CSS technique for path reveal
- Vehicle emoji uses CSS `transform: translate` with transition
- `onTransitionEnd` on the SVG path triggers `onLegComplete` callback
- Page advances to next leg after a 400ms pause

### Vehicle / Difficulty System
- **Easy mode**: vehicle reflects tenure at previous stop (≥5yr = 🪧 hitchhike, 2-4yr = 🚗 car, <2yr = ✈️ plane)
- **Hard mode**: all legs use same random vehicle per player (no hint)
- Plane paths use quadratic bezier curve for arc effect

### Scoring
| Guess # | Points |
|---------|--------|
| 1st     | 500    |
| 2nd     | 400    |
| 3rd     | 300    |
| 4th     | 200    |
| 5th     | 100    |
| Failed  | 0      |

### Daily Puzzle
- Puzzle number: days since Jan 1, 2025
- 5 players per day, selected from `ALL_PLAYERS` array by `(puzzleNum + i) % total`
- Same for all users (no auth required)

## Design System

### Colors (Tailwind custom)
```
parchment     #F5EFE0   Background
navy          #1C2B4A   Header, primary text  
ember         #D4621A   Accent, path color
forest        #2A7A4B   Success, college stops
danger        #B93232   Errors, failed
map-land      #EAE4D5   US states fill
map-water     #C9DCE8   Map background
map-border    #C0B09A   State borders, card borders
text-warm     #2C2218   Body text
text-muted    #7A6E62   Secondary text
```

### Fonts
- **Display**: Alfa Slab One (headers, CTAs) → `font-slab`
- **Body**: Karla (UI, labels) → `font-sans`
- **Mono**: JetBrains Mono (scores, puzzle numbers) → `font-mono`

## Player Database (`lib/players.ts`)

Each player needs:
```typescript
{
  id: string                    // kebab-case, unique
  name: string                  // Display name (exact for guessing)
  sport: 'NBA' | 'NFL' | 'MLB' | 'NHL'
  college?: {                   // Optional — omit for international players
    name: string
    city: string
    coords: [number, number]    // [longitude, latitude]
  }
  teams: Array<{
    teamName: string
    city: string
    coords: [number, number]    // [longitude, latitude]
    years: [number, number]     // [start year, end year]
    isCollege?: boolean
  }>
}
```

**Important**: Only include US locations (geoAlbersUsa doesn't show Canada/international). Skip Canadian teams (e.g., Toronto Raptors, Edmonton Oilers) or start from first US team.

Current players: LeBron James, Shaquille O'Neal, Kevin Durant, Vince Carter, Patrick Ewing (NBA); Tom Brady, Peyton Manning, Brett Favre, Jerry Rice, Emmitt Smith (NFL); Randy Johnson, Derek Jeter, Albert Pujols (MLB); Wayne Gretzky, Mario Lemieux (NHL).

## Key Gotchas

1. **GameMap must be dynamically imported** with `ssr: false` — react-simple-maps uses browser APIs
2. **`useMap()` must be called inside a ComposableMap child** — hence the `MapLayers` pattern
3. **SVG `transform` with `px` units** is used for vehicle animation (CSS transitions on SVG)
4. **Double `requestAnimationFrame`** trick for CSS transitions to trigger properly after initial render
5. **`onTransitionEnd`** on the path element drives leg-to-leg sequencing — don't use setTimeout for this
6. **Ghost paths** are rendered from the full player DB — the guessed name is looked up via `getPlayerByName()`

## Roadmap

### V2
- [ ] Supabase auth (streaks, all-time stats)
- [ ] Badge system (per-team badges for correct guesses)
- [ ] Sport filter (NBA-only mode, etc.)
- [ ] Expand player database (target 100+ players)
- [ ] More cities / handle non-US team stops elegantly
- [ ] Animated share card (OG image generation)
- [ ] Leaderboard / friend challenges

### Known Limitations
- Player DB is small (15 players) — daily repeats after ~3 days currently
- No persistence — refreshing loses game state (add localStorage in V2)
- Ghost paths for guesses not in the DB won't render (graceful fail)

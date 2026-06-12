# Agent 01: PWA Shell & Navigation

## Objective

Build the React PWA shell with navigation between sections (Spelling, Math, Olympus Protocol), coin balance display, responsive layout for iPad/mobile, and PWA configuration.

## Files You Own

```
src/main.tsx
src/App.tsx
src/index.css
src/components/Navigation.tsx
src/components/CoinBalance.tsx
src/components/Modal.tsx
src/components/Button.tsx
src/components/ProgressBar.tsx
src/pages/Home.tsx
src/pages/SpellingGame.tsx
src/pages/MathGame.tsx
src/pages/olympus/OlympusHub.tsx
```

> Do NOT modify files outside this list unless coordinating with the lead.

## Dependencies

- **Phase 0** provides: store stubs (`src/store/coinStore.ts`, `src/store/playerStore.ts`), project scaffolding, Tailwind config, types
- Store stubs will have `useCoinStore` with `coins`, `earnCoins(amount)`, `spendCoins(amount)`
- Other agents will fill in actual game pages — you build placeholders

## Detailed Requirements

### Navigation
- Bottom tab bar with 3 sections: Spelling, Math, Olympus
- Active tab highlighted, icons (SVG or emoji for now)
- Touch-friendly tap targets (min 44px)
- Smooth tab transitions

### Layout (responsive)
- **iPad landscape:** full width, nav at bottom
- **Mobile portrait:** stacked layout, nav at bottom
- **Desktop:** centered max-width container (1024px), nav at bottom or left sidebar

### Coin Balance
- Always visible in top header
- Reads from `useCoinStore` Zustand store
- Displays coin icon + number
- Animated increment when coins change

### Pages
- `Home.tsx`: Landing page with 3 section cards (Spelling, Math, Olympus) — each card has icon, title, brief description. Big touch targets.
- `SpellingGame.tsx`: Stub — "Spelling Game — Coming Soon" placeholder
- `MathGame.tsx`: Stub — "Math Game — Coming Soon" placeholder
- `OlympusHub.tsx`: Section wrapper with sub-navigation (Main Menu, Garage, Armory). Sub-routes render inline. `Outlet` pattern.

### PWA Configuration
- Service worker registration in `main.tsx` via `vite-plugin-pwa`
- `manifest.json` with app name "Olympus Protocol", icons, theme color
- Offline fallback page
- Update prompt UI (new version available → reload)

### Shared Components
- `Button.tsx` — Primary/secondary styles, large touch area, loading state
- `Modal.tsx` — Overlay modal with title, content, close button, backdrop click
- `ProgressBar.tsx` — Horizontal bar with label, percentage, color variants

## Acceptance Criteria
- [ ] App renders on iPad portrait + landscape without overflow
- [ ] Tab navigation switches between 3 sections
- [ ] Coin balance displays and updates reactively
- [ ] PWA installs on iPad (Add to Home Screen)
- [ ] App works offline (cached shell)
- [ ] All touch targets ≥ 44px

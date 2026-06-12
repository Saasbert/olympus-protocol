# Agent 01: PWA Shell & Navigation

## Objective

Build the React PWA shell with navigation between sections (Spelling, Math, Olympus), coin balance display, responsive layout for iPad/mobile, PWA config, and all shared UI components.

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

## Dependencies

- Store stubs are already defined: `coinStore.ts`, `playerStore.ts`, `loadoutStore.ts`, `battleStore.ts`
- Other agents fill actual game pages — you build the shell and placeholders

## Requirements

### Navigation
- Bottom tab bar with 3 sections: Spelling, Math, Olympus
- Active tab highlighted, touch targets min 44px
- Smooth transitions

### Layout
- iPad landscape: full width, nav bottom
- Mobile portrait: stacked, nav bottom
- Desktop: centered max-width 1024px

### Coin Balance
- Top header, reads from `useCoinStore`
- Coin icon + animated number

### Pages
- `Home.tsx`: 3 section cards (Spelling, Math, Olympus) with icons, descriptions
- `SpellingGame.tsx`: placeholder "Coming Soon"
- `MathGame.tsx`: placeholder "Coming Soon"
- `OlympusHub.tsx`: section wrapper with sub-nav (Menu, Garage, Armory), sub-routing

### PWA
- Service worker via `vite-plugin-pwa` (already configured in `vite.config.ts` — verify it works)
- Offline fallback

### Shared Components
- `Button.tsx` — primary/secondary/danger, loading state, disabled
- `Modal.tsx` — overlay with title, close, backdrop
- `ProgressBar.tsx` — horizontal bar with label, % display, color variants
- `Navigation.tsx` — bottom tab bar with route links
- `CoinBalance.tsx` — top header component

## Acceptance Criteria
- [ ] App renders on iPad portrait + landscape without overflow
- [ ] Tab navigation switches sections
- [ ] Coin balance displays reactively from store
- [ ] PWA installable (Add to Home Screen)
- [ ] All touch targets ≥ 44px
- [ ] No console errors

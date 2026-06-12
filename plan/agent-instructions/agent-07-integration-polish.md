# Agent 07: Integration & Polish

## Objective

After all Phase 1 agents deliver their work, integrate everything end-to-end, fix bugs, polish the experience, and validate v1.0 readiness.

## Files You Touch

Any file in the project — but coordinate changes with original owning agents when modifying their work.

## Dependencies

All Phase 1 agents must have completed their deliverables before this work begins.

## Integration Waves

### Wave 1: Data → UI Integration
- Verify Agent 05's data files correctly export their constants
- Verify Agent 03's Garage reads from `upgrades.ts`, Armory reads from `weapons.ts`
- Fix any type mismatches between data definitions and component expectations
- Test: Navigate Garage, see 6 systems; navigate Armory, see weapons list

### Wave 2: Loadout → Battle Integration
- Verify `loadoutStore` correctly passes selected robot + weapons to `BattleArena`
- Verify Phaser `BattleScene` reads loadout from store on scene start
- Verify opponent robot is properly instantiated from loadout data
- Test: Select loadout → Enter battle → Robot appears with correct weapons

### Wave 3: AI → Battle Integration
- Verify `AIController` is instantiated by `CombatManager`
- Verify AI reads opponent state correctly
- Test: vs AI battle — AI moves, fires, repairs, retreats

### Wave 4: Assets → Game Integration
- Replace all placeholder sprites (colored rectangles) with Agent 04's real assets
- Update `PreloadScene` asset list
- Verify all sprite keys match between asset files and Phaser code
- Test: All robots have proper sprites, weapons have visual effects, backgrounds render

### Wave 5: Full Economy Loop
- Verify coins earned in battle save to `coinStore` via `battleStore`
- Verify coins visible in header update after battle
- Verify Garage/Armory purchases deduct coins
- Verify persistence: reload page, coins and upgrades persist
- Test: Win battle → See coins increase → Spend in Garage → Reload → Verify persistence

### Wave 6: Polish
- **Touch responsiveness:** Test all interactions on iPad — joystick, buttons, menus. Fix dead zones, unresponsive areas.
- **Visual consistency:** Ensure all screens share the same dark mecha theme. Check fonts, colors, spacing.
- **Performance:** Profile Phaser on iPad. Check frame rate during combat. Optimize if needed (reduce draw calls, sprite batching).
- **Edge cases:** Empty inventory in Armory, insufficient coins, unupgraded systems, all weapons on cooldown, robot destroyed animation.
- **Error states:** No loadout selected when starting battle, corrupted localStorage data, missing assets.
- **Sound (stretch):** Add basic SFX — weapon fire, hit, explosion, repair, UI click. Use simple generated tones if no budget for audio assets.

### Wave 7: PWA Validation
- Test install on iPad Safari (Add to Home Screen)
- Test full offline functionality (airplane mode)
- Test on mobile Safari and Chrome
- Test on desktop Chrome/Firefox/Safari
- Verify service worker caches all necessary assets
- Add loading/fallback states for slow connections

## Bug Tracking

Log all bugs in a shared document with:
- Description and steps to reproduce
- Expected vs actual behavior
- Device/browser where observed
- Owning agent (for assignment)

## Final v1.0 Checklist

- [ ] Player can complete full flow: Open app → Navigate to Olympus → Select vs AI → Choose loadout → Battle → Win/Lose → See results → Coins updated
- [ ] Garage tech tree: Research upgrades, apply to robot stats
- [ ] Armory: Produce new weapons, upgrade existing, merge two into advanced
- [ ] AI opponent fights with 3 difficulty levels
- [ ] Coin economy: earn from battles, spend on upgrades/weapons
- [ ] PWA installable on iPad
- [ ] Works offline
- [ ] Touch controls functional on iPad
- [ ] All placeholder sprites replaced
- [ ] No console errors on navigation or during combat
- [ ] Game state persists across page reloads

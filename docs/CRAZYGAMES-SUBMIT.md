# CrazyGames Submission Guide for Orbital Miner

## 1. Account Setup

- **Create Developer Account**: Visit [developer.crazygames.com](https://developer.crazygames.com) and sign up
- **Complete Profile**: Add company/individual details, payment information
- **Accept Developer Agreement**: Review terms for 70/30 revenue split
- **Verify Email**: Confirm account activation

## 2. Pre-submission Checklist

### Technical Requirements
- [ ] **HTTPS hosting** on Vercel with SSL certificate
- [ ] **Mobile responsive** - works on 320px+ screen widths
- [ ] **Performance**: 60 FPS on mid-range devices, <3s load time
- [ ] **No external dependencies** that could break (fonts, APIs)
- [ ] **Error handling** for network issues, device limitations
- [ ] **Fullscreen support** implemented
- [ ] **Keyboard + mouse controls** optimized for web
- [ ] **Touch controls** for mobile (if applicable)

### Content Requirements
- [ ] **No copyrighted assets** - all art, sound, music original or licensed
- [ ] **Age-appropriate content** - family-friendly preferred
- [ ] **Complete gameplay loop** - tutorial, progression, end state
- [ ] **No broken features** - all mechanics functional

## 3. SDK Integration Verification Steps

### Install CrazyGames SDK
```bash
npm install @crazygames/sdk
```

### Required Integrations
```javascript
// Initialize SDK
import { CrazySDK } from '@crazygames/sdk';

// Game start
CrazySDK.init().then(() => {
    // Start your Phaser game here
    startGame();
});

// Ad breaks (implement these calls)
CrazySDK.requestAd('midgame'); // Between levels
CrazySDK.requestAd('rewarded'); // For bonuses

// Game state management
CrazySDK.gameplayStart(); // When actual gameplay begins
CrazySDK.gameplayStop(); // On pause/menu
CrazySDK.happyTime(); // On level completion/achievements
```

### Test Integration
- [ ] SDK initializes without errors
- [ ] Ad requests don't crash game
- [ ] Game state changes are tracked
- [ ] Works with CrazyGames testing tools

## 4. Bundle Size Optimization (Target ≤20MB)

### Phaser 3 Optimization
- [ ] **Use Webpack bundle analyzer** to identify large assets
- [ ] **Compress textures**: Use WebP format, optimize sprite atlases
- [ ] **Audio compression**: OGG Vorbis for web, keep files <1MB each
- [ ] **Code splitting**: Load non-essential assets after gameplay starts
- [ ] **Remove unused Phaser features** in build configuration

### Asset Optimization
```javascript
// Example: Lazy load non-critical assets
this.load.on('complete', () => {
    // Load additional mining ship variants after core game loads
    this.load.atlas('advanced_ships', 'assets/advanced_ships.webp', 'assets/advanced_ships.json');
});
```

## 5. Game Cover Images Required

### Create These Assets:
- [ ] **Thumbnail**: 280x280px PNG
  - Clear game logo/title
  - Iconic game element (mining drone, asteroids)
  - High contrast for small size visibility

- [ ] **Banner**: 1900x1200px PNG
  - Horizontal layout showcasing gameplay
  - Game title prominently displayed
  - Action scene from Orbital Miner
  - Professional, eye-catching design

### Design Tips:
- Use bright, contrasting colors
- Avoid text-heavy designs
- Show core gameplay elements
- Ensure readability at different sizes

## 6. Categories & Tags Selection

### Primary Category:
- **Action** (for fast-paced mining gameplay)

### Secondary Categories:
- **Puzzle** (for strategic asteroid navigation)
- **Arcade** (for pick-up-and-play appeal)

### Recommended Tags:
- `space`, `mining`, `asteroids`, `upgrade`, `action`, `puzzle`, `phaser`, `webgl`, `mobile-friendly`
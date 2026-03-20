# Orbital Miner - Technical Architecture Document

## 1. Engine Choice: Phaser 3 (rationale)

**Selected**: Phaser 3.70+ with WebGL renderer
- **Bundle size**: ~800KB minified, fits CrazyGames 20MB mobile requirement
- **Performance**: Hardware-accelerated rendering for particle effects and smooth movement
- **Input handling**: Unified pointer/keyboard/touch system
- **Asset loading**: Built-in preloader with progress callbacks for CrazyGames SDK integration
- **Audio**: Web Audio API integration with global mute support
- **Mobile optimization**: Automatic canvas scaling and touch input normalization

## 2. Project File Structure

```
orbital-miner/
├── src/
│   ├── scenes/
│   │   ├── BootScene.js          # SDK init, canvas setup
│   │   ├── LoadScene.js          # Asset generation, progress tracking
│   │   ├── MenuScene.js          # Main menu, settings
│   │   ├── GameScene.js          # Core gameplay
│   │   └── GameOverScene.js      # Results, restart flow
│   ├── entities/
│   │   ├── Player.js             # Mining drone with physics
│   │   ├── Asteroid.js           # Destructible resource nodes
│   │   ├── Resource.js           # Collectible particles
│   │   └── Hazard.js            # Moving space debris
│   ├── systems/
│   │   ├── GameState.js          # State machine manager
│   │   ├── InputManager.js       # Unified input handling
│   │   ├── AudioManager.js       # Sound effects with mute compliance
│   │   ├── ParticleManager.js    # Explosion/mining effects
│   │   └── UIManager.js          # HUD and interface
│   ├── utils/
│   │   ├── AssetGenerator.js     # Procedural graphics creation
│   │   ├── CrazyGamesSDK.js      # SDK wrapper and event handling
│   │   └── Constants.js          # Game configuration
│   └── main.js                   # Phaser game instance
├── public/
│   ├── index.html                # Canvas setup, SDK script tag
│   └── manifest.json             # PWA metadata
├── package.json
├── vite.config.js                # Build configuration
└── README.md
```

## 3. Scene Architecture (Boot→Load→Menu→Game→GameOver)

**BootScene**: 
- Initialize CrazyGames SDK (`window.CrazyGames.SDK.init()`)
- Set up canvas properties (`user-select: none`)
- Configure input listeners (prevent Escape/Ctrl+W)
- Transition to LoadScene immediately

**LoadScene**:
- Call `loadingStart()` SDK event
- Generate procedural assets (ship sprites, asteroid textures, particle templates)
- Display loading progress with visual feedback
- Call `loadingStop()` when complete
- Auto-transition to MenuScene

**MenuScene**:
- Main menu with Play/Settings buttons
- Visual onboarding overlay (skippable)
- Keyboard/mouse/touch input demonstration
- Settings: audio toggle (respects SDK muteAudio flag)

**GameScene**:
- Call `gameplayStart()` on scene start
- Core mining gameplay loop
- Real-time resource collection and hazard avoidance
- Call `gameplayStop()` on death/pause
- Call `happytime()` on major milestone achievements only

**GameOverScene**:
- Display session statistics and high scores
- Restart button (returns to GameScene)
- Menu button (returns to MenuScene)
- Midgame ad request between sessions

## 4. Game State Machine (exact enum names)

```javascript
const GameState = {
    LOADING: 'loading',
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    MINING: 'mining',          // Active resource extraction
    UPGRADING: 'upgrading',    // Ship enhancement phase
    GAME_OVER: 'game
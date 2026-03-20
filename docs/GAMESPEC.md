# Orbital Miner - Implementation Spec

## 1. File Map

```
src/
├── scenes/
│   ├── BootScene.js          # Initialize SDK, set up canvas dimensions
│   ├── LoadScene.js          # Load assets, show progress bar
│   ├── MenuScene.js          # Main menu with play button and instructions
│   ├── GameScene.js          # Core gameplay loop with mining mechanics
│   └── GameOverScene.js      # Score display and restart option
├── entities/
│   ├── Player.js             # Player ship with thrust and rotation
│   ├── Asteroid.js           # Destructible asteroids with resources
│   ├── Resource.js           # Collectable resource crystals
│   └── Hazard.js             # Moving space debris obstacles
├── managers/
│   ├── GameState.js          # Score, health, resources tracking
│   ├── InputManager.js       # Unified input handling for all platforms
│   ├── AudioManager.js       # Synthesized audio effects
│   ├── ParticleManager.js    # Explosion and trail effects
│   ├── UIManager.js          # HUD and interface elements
│   └── AssetGenerator.js     # Procedural sprite generation
├── integrations/
│   └── CrazyGamesSDK.js      # SDK wrapper and event handling
└── main.js                   # Phaser config and game initialization
```

## 2. Scene Lifecycle

```javascript
// Boot → Load
BootScene: create() → CrazyGamesSDK.init() → scene.start('LoadScene')

// Load → Menu  
LoadScene: preload() → create() → scene.start('MenuScene')

// Menu → Game
MenuScene: playButton.onClick() → CrazyGamesSDK.gameplayStart() → scene.start('GameScene')

// Game → GameOver
GameScene: player.health <= 0 → CrazyGamesSDK.gameplayStop() → scene.start('GameOverScene')

// GameOver → Menu
GameOverScene: restartButton.onClick() → scene.start('MenuScene')
```

## 3. Entities & Classes

### Player
```javascript
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    this.health = 100;
    this.fuel = 100;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 200;
    this.thrustPower = 150;
  }
  
  update() { /* Apply thrust, rotate, bounds checking */ }
  takeDamage(amount) { /* Reduce health, trigger damage particles */ }
  consumeFuel(amount) { /* Reduce fuel, disable thrust if empty */ }
}
```

### Asteroid
```javascript
class Asteroid extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, size) {
    this.size = size; // 'small', 'medium', 'large'
    this.health = size === 'large' ? 3 : size === 'medium' ? 2 : 1;
    this.resources = Math.floor(Math.random() * 3) + 1;
  }
  
  takeDamage() { /* Reduce health, spawn fragments if destroyed */ }
  explode() { /* Create Resource drops and particles */ }
}
```

### Resource
```javascript
class Resource extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    this.type = type; // 'crystal', 'fuel', 'health'
    this.value = type === 'crystal' ? 10 : type === 'fuel' ? 25 : 20;
    this.magnetRange = 50;
  }
  
  update(player) { /* Magnetic attraction when player is close */ }
}
```

### Hazard
```javascript
class Hazard extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, hazardType) {
    
# HTML5 Game Development Error Reference Guide

## 1. npm install / Vite build errors

### `ENOENT: no such file or directory, scandir 'node_modules'`
```bash
rm -rf node_modules package-lock.json
npm install
```

### `Cannot resolve module 'phaser'`
```bash
npm install phaser@3.80.1 --save
```

### `Vite build fails with memory error`
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  }
}
```

### `Module not found: Can't resolve './assets'`
```javascript
// Move assets to public/ folder
// Reference as: '/assets/image.png' not './assets/image.png'
```

---

## 2. Phaser 3 engine errors

### `Uncaught TypeError: Cannot read property 'Game' of undefined`
```javascript
// Wrong
import { Game } from 'phaser'

// Correct
import Phaser from 'phaser'
const game = new Phaser.Game(config)
```

### `WebGL context lost`
```javascript
const config = {
  type: Phaser.AUTO,
  canvas: document.getElementById('game'),
  contextCreation: { 
    preserveDrawingBuffer: true 
  }
}
```

### `Scene not found`
```javascript
// Ensure scene key matches
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' }) // Must match
  }
}

// In config
scene: [GameScene] // Not 'GameScene'
```

### `this.load.image is not a function`
```javascript
// Wrong - calling in constructor
constructor() {
  this.load.image('player', '/assets/player.png')
}

// Correct - use preload()
preload() {
  this.load.image('player', '/assets/player.png')
}
```

---

## 3. CrazyGames SDK errors

### `CrazyGames is not defined`
```html
<!-- Add before your game script -->
<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>
```

### `SDK initialization failed`
```javascript
// Check if in CrazyGames environment
if (typeof window.CrazyGames !== 'undefined') {
  window.CrazyGames.init().then(() => {
    console.log('SDK initialized')
  }).catch(error => {
    console.error('SDK init failed:', error)
    // Continue game anyway
  })
} else {
  console.log('Not in CrazyGames environment')
}
```

### `Ad failed to load`
```javascript
// Always have fallback
function showAd() {
  if (window.CrazyGames?.ad) {
    window.CrazyGames.ad.requestAd('midgame').catch(() => {
      // Ad failed, continue game
      resumeGame()
    })
  } else {
    // No ads available, continue
    resumeGame()
  }
}
```

### `Environment disabled error`
```javascript
// Don't fail on missing features
try {
  window.CrazyGames.user.getUser()
} catch (error) {
  console.log('User features disabled')
  // Use guest mode
}
```

---

## 4. Canvas/WebGL context errors

### `Failed to create WebGL context`
```javascript
const config = {
  type: Phaser.AUTO, // Falls back to Canvas if WebGL fails
  canvas: document.getElementById('game-canvas'),
  failIfMajorPerformanceCaveat: false
}
```

### `Canvas is already in use`
```javascript
// Destroy previous game instance
if (window.game) {
  window.game.destroy(true)
}
window.game = new Phaser.
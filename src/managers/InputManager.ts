```typescript
import { TouchControls } from '../types';

class InputManagerClass {
  private keys: Map<string, boolean> = new Map();
  private pointers: Map<number, { x: number; y: number; isDown: boolean }> = new Map();
  private scene: Phaser.Scene | null = null;
  private touchControls: TouchControls | null = null;

  init(scene: Phaser.Scene): void {
    this.scene = scene;
    
    // Keyboard input
    scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      this.keys.set(event.code, true);
    });

    scene.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      this.keys.set(event.code, false);
    });

    // Pointer input
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.pointers.set(pointer.id, {
        x: pointer.x,
        y: pointer.y,
        isDown: true
      });
    });

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.pointers.has(pointer.id)) {
        this.pointers.set(pointer.id, {
          x: pointer.x,
          y: pointer.y,
          isDown: this.pointers.get(pointer.id)?.isDown || false
        });
      }
    });

    scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.pointers.has(pointer.id)) {
        this.pointers.set(pointer.id, {
          x: pointer.x,
          y: pointer.y,
          isDown: false
        });
      }
    });
  }

  createTouchControls(scene: Phaser.Scene): TouchControls {
    const buttonSize = 80;
    const margin = 30;
    
    // Left button
    const leftButton = scene.add.graphics();
    leftButton.fillStyle(0x333333, 0.7);
    leftButton.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
    leftButton.lineStyle(2, 0x666666);
    leftButton.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
    leftButton.fillStyle(0xffffff);
    leftButton.fillTriangle(30, 20, 30, 60, 10, 40);
    leftButton.setPosition(margin, scene.cameras.main.height - buttonSize - margin);
    leftButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize), Phaser.Geom.Rectangle.Contains);
    leftButton.setScrollFactor(0);

    // Right button
    const rightButton = scene.add.graphics();
    rightButton.fillStyle(0x333333, 0.7);
    rightButton.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
    rightButton.lineStyle(2, 0x666666);
    rightButton.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
    rightButton.fillStyle(0xffffff);
    rightButton.fillTriangle(50, 20, 50, 60, 70, 40);
    rightButton.setPosition(margin * 2 + buttonSize, scene.cameras.main.height - buttonSize - margin);
    rightButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize), Phaser.Geom.Rectangle.Contains);
    rightButton.setScrollFactor(0);

    // Thrust button
    const thrustButton = scene.add.graphics();
    thrustButton.fillStyle(0x333333, 0.7);
    thrustButton.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
    thrustButton.lineStyle(2, 0x666666);
    thrustButton.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
    thrustButton.fillStyle(0xffffff);
    thrustButton.fillTriangle(40, 10, 30, 50, 50, 50);
    thrustButton.setPosition(scene.cameras.main.width - buttonSize - margin, scene.cameras.main.height - buttonSize - margin);
    thrustButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize), Phaser.Geom.Rectangle.Contains);
    thrustButton.setScrollFactor(0);

    this.touchControls = { leftButton, rightButton, thrustButton };
    return this.touchControls;
  }

  updateTouchControls(): void {
    if (!this.touchControls || !this.scene) return;

    const { leftButton, rightButton, thrustButton } = this.touchControls;
    const buttonSize = 80;
    const margin = 30;

    // Update positions based on current screen size
    leftButton.setPosition(margin, this.scene.cameras.main.height - buttonSize - margin);
    rightButton.setPosition(margin * 2 + buttonSize, this.scene.cameras.main.height - buttonSize - margin);
    thrustButton.setPosition(this.scene.cameras.main.width - buttonSize - margin, this.scene.cameras.main.height - buttonSize - margin);
  }

  isKeyDown(keyCode: string): boolean {
    return this.keys.get(keyCode) || false;
  }

  isPointerDown(pointerId: number = 0): boolean {
    return this.pointers.get(pointerId)?.isDown || false;
  }

  getPointerPosition(pointerId: number = 0): { x: number; y: number } | null {
    return this.pointers.get(pointerId) || null;
  }

  isLeftPressed(): boolean {
    return this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA') || 
           (this.touchControls?.leftButton && this.isTouchingButton(this.touchControls.leftButton));
  }

  isRightPressed(): boolean {
    return this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD') ||
           (this.touchControls?.rightButton && this.isTouchingButton(this.touchControls.rightButton));
  }

  isThrustPressed(): boolean {
    return this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW') || this.isKeyDown('Space') ||
           (this.touchControls?.thrustButton && this.isTouchingButton(this.touchControls.thrustButton));
  }

  private isTouchingButton(button: Phaser.GameObjects.Graphics): boolean {
    for (const pointer of this.pointers.values()) {
      if (pointer.isDown) {
        const bounds = button.getBounds();
        if (pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
            pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height) {
          return true;
        }
      }
    }
    return false;
  }

  destroy(): void {
    this.keys.clear();
    this.pointers.clear();
    this.scene = null;
    this.touchControls = null;
  }
}

export const InputManager = new InputManagerClass();
```
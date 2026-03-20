import { AudioManager } from '../managers/AudioManager';

export class Player extends Phaser.GameObjects.Container {
  private ship: Phaser.GameObjects.Graphics;
  private thrustParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private velocity: Phaser.Math.Vector2;
  private maxSpeed: number = 300;
  private thrustPower: number = 400;
  private rotationSpeed: number = 4;
  private fuel: number = 100;
  private maxFuel: number = 100;
  private isThrusting: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.velocity = new Phaser.Math.Vector2(0, 0);

    // Create ship graphics
    this.ship = new Phaser.GameObjects.Graphics(scene);
    this.drawShip();
    this.add(this.ship);

    // Create thrust particles
    this.createThrustParticles();

    // Add physics body
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(20, 30);
    body.setOffset(-10, -15);

    scene.add.existing(this);
  }

  private drawShip(): void {
    this.ship.clear();
    
    // Main ship body
    this.ship.fillStyle(0x00ff00);
    this.ship.fillTriangle(0, -15, -10, 15, 10, 15);
    
    // Cockpit
    this.ship.fillStyle(0x0099ff);
    this.ship.fillCircle(0, -5, 4);
    
    // Engine details
    this.ship.fillStyle(0x666666);
    this.ship.fillRect(-8, 10, 4, 8);
    this.ship.fillRect(4, 10, 4, 8);
  }

  private createThrustParticles(): void {
    // Create simple particle effect for thrust
    const particles = this.scene.add.particles(0, 0, 'spark', {
      x: 0,
      y: 20,
      speed: { min: 50, max: 100 },
      lifespan: 200,
      quantity: 2,
      scale: { start: 0.3, end: 0 },
      tint: [0xff6600, 0xff0000, 0xffff00],
      emitting: false,
      follow: this
    });
    
    this.thrustParticles = particles;
  }

  update(delta: number, leftPressed: boolean, rightPressed: boolean, thrustPressed: boolean): void {
    // Rotation
    if (leftPressed) {
      this.rotation -= this.rotationSpeed * (delta / 1000);
    }
    if (rightPressed) {
      this.rotation += this.rotationSpeed * (delta / 1000);
    }

    // Thrust
    this.isThrusting = false;
    if (thrustPressed && this.fuel > 0) {
      this.isThrusting = true;
      this.fuel = Math.max(0, this.fuel - 30 * (delta / 1000));
      
      const thrustX = Math.sin(this.rotation) * this.thrustPower * (delta / 1000);
      const thrustY = -Math.cos(this.rotation) * this.thrustPower * (delta / 1000);
      
      this.velocity.x += thrustX;
      this.velocity.y += thrustY;

      // Limit speed
      if (this.velocity.length() > this.maxSpeed) {
        this.velocity.normalize().scale(this.maxSpeed);
      }

      AudioManager.playSound('thrust');
    }

    // Update thrust particles
    if (this.thrustParticles) {
      this.thrustParticles.setEmitting(this.isThrusting);
    }

    // Apply velocity
    this.x += this.velocity.x * (delta / 1000);
    this.y += this.velocity.y * (delta / 1000);

    // Drag
    this.velocity.scale(0.99);

    // Screen wrapping
    const camera = this.scene.cameras.main;
    if (this.x < -20) this.x = camera.width + 20;
    if (this.x > camera.width + 20) this.x = -20;
    if (this.y < -20) this.y = camera.height + 20;
    if (this.y > camera.height + 20) this.y = -20;

    // Fuel regeneration (slowly)
    if (!this.isThrusting && this.fuel < this.maxFuel) {
      this.fuel = Math.min(this.maxFuel, this.fuel + 10 * (delta / 1000));
    }
  }

  getFuel(): number {
    return this.fuel;
  }

  getMaxFuel(): number {
    return this.maxFuel;
  }

  addFuel(amount: number): void {
    this.fuel = Math.min(this.maxFuel, this.fuel + amount);
  }

  takeDamage(): void {
    // Flash effect
    this.scene.tweens.add({
      targets: this.ship,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.ship.alpha = 1;
      }
    });
  }

  destroy(): void {
    if (this.thrustParticles) {
      this.thrustParticles.destroy();
    }
    super.destroy();
  }
}
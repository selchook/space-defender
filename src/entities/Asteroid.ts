```typescript
import { AsteroidConfig } from '../types';

export class Asteroid extends Phaser.GameObjects.Graphics {
  private velocity: Phaser.Math.Vector2;
  private rotationSpeed: number;
  public resources: number;
  private size: number;

  constructor(scene: Phaser.Scene, config: AsteroidConfig) {
    super(scene);

    this.x = config.x;
    this.y = config.y;
    this.size = config.size;
    this.resources = config.resources;
    this.velocity = new Phaser.Math.Vector2(config.velocity.x, config.velocity.y);
    this.rotationSpeed = (Math.random() - 0.5) * 2;

    this.drawAsteroid();

    // Add physics body
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.size * 2, this.size * 2);
    body.setOffset(-this.size, -this.size);
    body.setImmovable(true);

    scene.add.existing(this);
  }

  private drawAsteroid(): void {
    this.clear();
    
    // Draw irregular asteroid shape
    const points = [];
    const numPoints = 8;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = this.size * (0.8 + Math.random() * 0.4);
      points.push(Math.cos(angle) * radius);
      points.push(Math.sin(angle) * radius);
    }

    // Main asteroid body
    this.fillStyle(0x8B4513);
    this.fillPoints(points, true);
    
    // Resource veins
    if (this.resources > 0) {
      this.lineStyle(2, 0x00ffff);
      for (let i = 0; i < this.resources; i++) {
        const startAngle = Math.random() * Math.PI * 2;
        const startRadius = this.size * 0.3;
        const endRadius = this.size * 0.8;
        
        const startX = Math.cos(startAngle) * startRadius;
        const startY = Math.sin(startAngle) * startRadius;
        const endX = Math.cos(startAngle) * endRadius;
        const endY = Math.sin(startAngle) * endRadius;
        
        this.lineBetween(startX, startY, endX, endY);
      }
    }

    // Outline
    this.lineStyle(1, 0x555555);
    this.strokePoints(points, true);
  }

  update(delta: number): void {
    this.x += this.velocity.x * (delta / 1000);
    this.y += this.velocity.y * (delta / 1000);
    this.rotation += this.rotationSpeed * (delta / 1000);

    // Screen wrapping
    const camera = this.scene.cameras.main;
    if (this.x < -this.size) this.x = camera.width + this.size;
    if (this.x > camera.width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = camera.height + this.size;
    if (this.y > camera.height + this.size) this.y = -this.size;
  }

  mineResource(): boolean {
    if (this.resources > 0) {
      this.resources--;
      
      // Create mining particle effect
      this.scene.add.particles(this.x, this.y, 'spark', {
        speed: { min: 50, max: 150 },
        lifespan: 500,
        quantity: 5,
        scale: { start: 0.5, end: 0 },
        t
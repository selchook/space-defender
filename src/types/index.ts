export interface GameState {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  resources: number;
  fuel: number;
}

export interface AsteroidConfig {
  x: number;
  y: number;
  size: number;
  resources: number;
  velocity: { x: number; y: number };
}

export interface HazardConfig {
  x: number;
  y: number;
  size: number;
  velocity: { x: number; y: number };
  type: 'debris' | 'mine';
}

export interface ParticleConfig {
  x: number;
  y: number;
  color: number;
  life: number;
  velocity: { x: number; y: number };
}

export interface TouchControls {
  thrustButton: Phaser.GameObjects.Graphics;
  leftButton: Phaser.GameObjects.Graphics;
  rightButton: Phaser.GameObjects.Graphics;
}
import Phaser from 'phaser';
import PathfinderScene from './PathfinderScene';

const config = {
  type: Phaser.AUTO,
  width: 128,
  height: 128,
  zoom: 3,
  pixelArt: true,
  scene: PathfinderScene
};

const game = new Phaser.Game(config);

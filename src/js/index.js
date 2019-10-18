import Phaser from 'phaser';
import PathFinderScene from './PathFinderScene';

const config = {
  type: Phaser.AUTO,
  width: 128,
  height: 128,
  zoom: 4,
  pixelArt: true,
  scene: PathFinderScene
};

const game = new Phaser.Game(config);

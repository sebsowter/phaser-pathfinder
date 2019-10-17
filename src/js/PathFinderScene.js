import Phaser from 'phaser';

const roundValue = function(value) {
  return Math.floor(value / 8) * 8 + 4;
}

export default class PathFinderScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('tilemap', './assets/tilemaps/tilemap.json');
    this.load.spritesheet('tiles', './assets/images/tiles.png', {
      frameWidth: 8,
      frameHeight: 8
    });
  }
  
  create() {
    const camera = this.cameras.main;
    const tilemap = this.make.tilemap({ key: 'tilemap' });
    const tileset = tilemap.addTilesetImage('tiles');
    const layer = tilemap.createDynamicLayer(0, tileset, 0, 0);
    const red = this.add.image(4, 4, 'tiles', 2).setInteractive();
    const blue = this.add.image(44, 28, 'tiles', 3).setInteractive();

    this.input.setDraggable(red);
    this.input.setDraggable(blue);

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      const tile = tilemap.getTileAtWorldXY(dragX, dragY, true, camera, layer);

      if (tile && tile.index !== 2) {
        gameObject.x = roundValue(dragX);
        gameObject.y = roundValue(dragY);
      }
    });
  }
}

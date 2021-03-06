import Phaser from 'phaser';
import Pathfinder from './Pathfinder';

export default class PathfinderScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('tilemap', './assets/tilemap.json');
    this.load.spritesheet('tiles', './assets/tiles.png', {
      frameWidth: 8,
      frameHeight: 8
    });
  }
  
  create() {
    const camera = this.cameras.main;
    const tilemap = this.make.tilemap({
      key: 'tilemap'
    });
    const tileset = tilemap.addTilesetImage('tiles');
    const layer = tilemap.createDynamicLayer(0, tileset, 0, 0);
    const tiles = tilemap.layers[0].data.map(function(row) {
      return row.map(function(tile) {
        return tile.index !== 3;
      });
    });
    const snapToGrid = function(value) {
      return Math.floor(value / 8) * 8 + 4;
    };
    
    this.pathGroup = this.add.group({
      classType: Phaser.GameObjects.Image,
      defaultKey: 'tiles',
      defaultFrame: 2
    });
    this.lineGraphics = this.add.graphics().lineStyle(1, 0x999900, 1).setDepth(1);
    this.red = this.add.image(20, 20, 'tiles', 4).setInteractive().setDepth(2);
    this.blue = this.add.image(108, 108, 'tiles', 5).setInteractive().setDepth(2);
    this.pathFinder = new Pathfinder(tiles, 8, 8);

    let tilecurrent = null;

    this.input.setDraggable(this.red);
    this.input.setDraggable(this.blue);
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      const tile = tilemap.getTileAtWorldXY(dragX, dragY, true, camera, layer);

      if (tile && tile !== tilecurrent && tile.index !== 3) {
        tilecurrent = tile;
        
        gameObject.x = snapToGrid(dragX);
        gameObject.y = snapToGrid(dragY);

        this.drawPath();
      }
    });

    this.drawPath(false);
  }
  
  drawPath(clear = true) {
    const pointA = new Phaser.Geom.Point(this.red.x, this.red.y);
    const pointB = new Phaser.Geom.Point(this.blue.x, this.blue.y);
    const path = this.pathFinder.getPath(pointA, pointB);
    
    if (clear) {
      this.lineGraphics.clear();
      this.pathGroup.clear(true, true);
    }

    this.lineGraphics.moveTo(pointA.x, pointA.y);

    path.forEach((point) => {
      this.pathGroup.create(point.x, point.y);
      this.lineGraphics.lineTo(point.x, point.y);
    });

    this.lineGraphics.strokePath();
  }
}

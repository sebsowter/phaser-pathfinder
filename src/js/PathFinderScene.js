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

    this.paths = this.add.group({
      classType: Phaser.GameObjects.Image,
      defaultKey: 'tiles',
      defaultFrame: 2,
      active: true,
      //maxSize: -1,
      //runChildUpdate: false,
      //createCallback: null,
      //removeCallback: null,
      //createMultipleCallback: null
    });
    //this.paths.clear();
    //this.paths.create(28, 44);

    const red = this.add.image(4, 4, 'tiles', 4).setInteractive();
    const blue = this.add.image(44, 28, 'tiles', 5).setInteractive();
    
    this.tiles = tilemap.layers[0].data;

    console.log('tiles', this.tiles);
    console.log('layer', layer);

    const tilesNew = this.tiles.map((row) => row.map((tile) => tile.index));
    const pathFinder = new Pathfinder(tilesNew);

    this.tilecurrent = null;

    this.input.setDraggable(red);
    this.input.setDraggable(blue);
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      const tile = tilemap.getTileAtWorldXY(dragX, dragY, true, camera, layer);

      if (tile && tile.index !== 3 && tile !== this.tilecurrent) { 
        this.tilecurrent = tile;       
        gameObject.x = this.roundValue(dragX);
        gameObject.y = this.roundValue(dragY);

        const pointA = new Phaser.Geom.Point(red.x, red.y);
        const pointB = new Phaser.Geom.Point(blue.x, blue.y);
        const path = pathFinder.getPath(pointA, pointB);

        this.updateTiles(path);
      }
    });
  }

  updateTiles(path) {
    this.paths.clear(true, true);

    path.forEach((node) => {
      this.paths.create(node.gridX * 8 + 4, node.gridY * 8 + 4);
    });
  }

  roundValue(value) {
    return Math.floor(value / 8) * 8 + 4;
  }
}

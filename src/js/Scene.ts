import { Pathfinder } from "./Pathfinder";

export class Scene extends Phaser.Scene {
  private _blue: Phaser.GameObjects.Image;
  private _lineGraphics: Phaser.GameObjects.Graphics;
  private _pathFinder: Pathfinder;
  private _pathGroup: Phaser.GameObjects.Group;
  private _red: Phaser.GameObjects.Image;

  public preload() {
    this.load.spritesheet("tiles", "./assets/tiles.png", { frameWidth: 8, frameHeight: 8 });
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemap.json");
  }

  public create() {
    const camera = this.cameras.main;
    const tilemap = this.make.tilemap({ key: "tilemap" });
    const tileset = tilemap.addTilesetImage("tiles");
    const layer = tilemap.createLayer(0, tileset, 0, 0);
    const tiles = tilemap.layers[0].data.map((row) => row.map((tile) => tile.index !== 4));

    this._pathGroup = this.add.group({ classType: Phaser.GameObjects.Image, defaultKey: "tiles", defaultFrame: 2 });
    this._lineGraphics = this.add.graphics().lineStyle(1, 0x999900, 1).setDepth(1);
    this._red = this.add.image(20, 20, "tiles", 4).setInteractive().setDepth(2);
    this._blue = this.add.image(108, 108, "tiles", 5).setInteractive().setDepth(2);

    this._pathFinder = new Pathfinder(8, 8).setNodes(tiles);

    const snapToGrid = (value: number) => Math.floor(value / 8) * 8 + 4;

    let tilecurrent = null;

    this.input
      .setDraggable(this._red)
      .setDraggable(this._blue)
      .on("drag", (_: string, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
        const tile = tilemap.getTileAtWorldXY(dragX, dragY, true, camera, layer);

        if (tile && tile !== tilecurrent && tile.index !== 4) {
          tilecurrent = tile;

          gameObject.setPosition(snapToGrid(dragX), snapToGrid(dragY));

          this.drawPath();
        }
      });

    this.drawPath(false);
  }

  public drawPath(clear = true) {
    const pointA = new Phaser.Geom.Point(this._red.x, this._red.y);
    const pointB = new Phaser.Geom.Point(this._blue.x, this._blue.y);
    const path = this._pathFinder.getPath(pointA, pointB);

    if (clear) {
      this._lineGraphics.clear();
      this._pathGroup.clear(true, true);
    }

    this._lineGraphics.moveTo(pointA.x, pointA.y);

    path.forEach((point) => {
      this._pathGroup.create(point.x, point.y);
      this._lineGraphics.lineTo(point.x, point.y);
    });

    this._lineGraphics.strokePath();
  }
}

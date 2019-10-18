import Phaser from 'phaser';

const roundValue = function(value) {
  return Math.floor(value / 8) * 8 + 4;
}

const getDistance = function(nodeA, nodeB) {
  const distX = Math.abs(nodeA.gridX - nodeB.gridX);
  const distY = Math.abs(nodeA.gridY - nodeB.gridY);

  if (distX > distY) {
    return ((14 * distY) + 10) * (distX - distY);
  }

  return ((14 * distX) + 10) * (distY - distX);
}

const retracePath = function(nodeA, nodeB) {
  const path = [];

  let currentNode = nodeB;

  while (currentNode !== nodeA) {
    path.push(currentNode);

    currentNode = currentNode.parent;
  }

  path.reverse();

  return path;
}

class GridNode {
  constructor(x, y, tileIndex) {
    this.gridX = x;
    this.gridY = y;
    this.hCost = 0;
    this.gCost = 0;
    this.parent = null;
    this.tileIndex = tileIndex;
    this.walkable = tileIndex === 1;
  }

  get fCost() {
    this.gCost + this.hCost;
  }
}

class PathFinder {
  constructor(tiles) {
    this.cols = tiles.length;
    this.rows = tiles[0].length;
    this.openList = [];
    this.closedList = [];
    this.nodes = tiles.map(function(row, y) {
      return row.map(function(tileIndex, x) {
        return new GridNode(x, y, tileIndex);
      });
    });
  }

  getNodeByXY(x, y) {
    const gridX = Math.floor(x / 8);
    const gridY = Math.floor(y / 8);

    return this.nodes[gridY][gridX];
  }

  getNeighbours(node, rows, cols) {
    const neighbours = [];
    
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) {
          continue;
        }
        
        const checkX = node.gridX + x;
        const checkY = node.gridY + y;
  
        if (checkX >= 0 && checkX < cols && checkY >= 0 && checkY < rows) {
          neighbours.push(this.nodes[checkY][checkX]);
        }
      }
    }
  
    return neighbours;
  }

  getPath(pointA, pointB) {
    this.startNode = this.getNodeByXY(pointA.x, pointA.y);
    this.targetNode = this.getNodeByXY(pointB.x, pointB.y);
    this.closedList = [];
    this.openList = [this.startNode];

    let max = 0;
    
    while (this.openList.length && max < 1000) {
      max++;

      let currentNode = this.openList[0];

      for (let i = 1; i < this.openList.length; i++) {
        const item = this.openList[i];

        if (item.fCost < currentNode.fCost || (item.fCost === currentNode.fCost && item.hCost < currentNode.hCost)) {
          currentNode = item;
        }
      }
    
      this.openList.splice(this.openList.findIndex((itemd) => itemd === currentNode), 1);
      this.closedList.push(currentNode);

      if (currentNode === this.targetNode) {
        return retracePath(this.startNode, this.targetNode);
      }

      const neighbours = this.getNeighbours(currentNode, this.rows, this.cols);
      //console.log('neighbours', neighbours);
      neighbours.forEach((neighbour) => {
        if (!neighbour.walkable || this.closedList.includes(neighbour)) {
        } else {
          const newCost = currentNode.gCost + getDistance(currentNode, neighbour);

          if (newCost < neighbour.gCost || !this.openList.includes(neighbour)) {
            neighbour.gCost = newCost;
            neighbour.hCost = getDistance(neighbour, this.targetNode);
            neighbour.parent = currentNode;

            if (!this.openList.includes(neighbour)) {
              this.openList.push(neighbour);
            }
          }
        }
      });
    }
  }
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
    const red = this.add.image(4, 4, 'tiles', 4).setInteractive();
    const blue = this.add.image(44, 28, 'tiles', 5).setInteractive();
    this.tiles = tilemap.layers[0].data;
    console.log('tiles', this.tiles);
    console.log('layer', layer);
    const tilesNew = this.tiles.map((row) => row.map((tile) => tile.index));
    const pathFinder = new PathFinder(tilesNew);
    this.tilecurrent = null;

    this.input.setDraggable(red);
    this.input.setDraggable(blue);
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {

      const tile = tilemap.getTileAtWorldXY(dragX, dragY, true, camera, layer);

      if (tile && tile.index !== 3 && tile !== this.tilecurrent) { 
        this.tilecurrent = tile;       
        gameObject.x = roundValue(dragX);
        gameObject.y = roundValue(dragY);

        const pointA = new Phaser.Geom.Point(red.x, red.y);
        const pointB = new Phaser.Geom.Point(blue.x, blue.y);
        const path = pathFinder.getPath(pointA, pointB);

        this.updateTiles(path);
      }
    });
  }

  updateTiles(path) {
    this.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        let found = path.some((p) => p.gridX === x && p.gridY === y);

        tile.setAlpha(found ? 0.5 : 1);
      });
    });
  }
}

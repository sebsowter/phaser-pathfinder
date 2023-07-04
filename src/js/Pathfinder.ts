type PathfinderNodeType = PathfinderNode | null;

class PathfinderNode {
  private _gridX: number;
  private _gridY: number;
  private _hCost: number;
  private _gCost: number;
  private _parent: PathfinderNodeType;
  private _isWalkable: boolean;

  constructor(gridX: number, gridY: number, isWalkable: boolean) {
    this._gridX = gridX;
    this._gridY = gridY;
    this._hCost = 0;
    this._gCost = 0;
    this._parent = null;
    this._isWalkable = isWalkable;
  }

  public set gCost(value: number) {
    this._gCost = value;
  }

  public set hCost(value: number) {
    this._hCost = value;
  }

  public set parent(value: PathfinderNodeType) {
    this._parent = value;
  }

  public get gCost() {
    return this._gCost;
  }

  public get hCost() {
    return this._hCost;
  }

  public get fCost() {
    return this._gCost + this._hCost;
  }

  public get gridX() {
    return this._gridX;
  }

  public get gridY() {
    return this._gridY;
  }

  public get parent() {
    return this._parent;
  }

  public get isWalkable() {
    return this._isWalkable;
  }
}

export class Pathfinder {
  private _tileWidth: number;
  private _tileHeight: number;
  private _lengthY: number;
  private _lengthX: number;
  private _nodes: PathfinderNode[][];

  constructor(tileWidth = 16, tileHeight = 16) {
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
  }

  public setNodes(tiles: boolean[][]) {
    const [row] = tiles;

    this._lengthY = tiles.length;
    this._lengthX = row.length;

    this._nodes = tiles.map((row, y) => row.map((isWalkable, x) => new PathfinderNode(x, y, isWalkable)));

    return this;
  }

  public getPath(pointA: Phaser.Geom.Point, pointB: Phaser.Geom.Point) {
    const startNode = this.getNodeFromXY(pointA.x, pointA.y);
    const targetNode = this.getNodeFromXY(pointB.x, pointB.y);
    const deadNodes = [];
    const liveNodes = [startNode];

    while (liveNodes.length) {
      let currentNode = liveNodes[0];

      for (let i = 1; i < liveNodes.length; i++) {
        const node = liveNodes[i];

        if (node.fCost < currentNode.fCost || (node.fCost === currentNode.fCost && node.hCost < currentNode.hCost)) {
          currentNode = node;
        }
      }

      liveNodes.splice(
        liveNodes.findIndex((node) => node === currentNode),
        1
      );

      deadNodes.push(currentNode);

      if (currentNode === targetNode) {
        return this.tracePath(startNode, targetNode);
      }

      this.getNeighbours(currentNode).forEach((neighbour) => {
        if (this.getWalkable(currentNode, neighbour) && !deadNodes.includes(neighbour)) {
          const cost = currentNode.gCost + this.getDistance(currentNode, neighbour);

          if (cost < neighbour.gCost || !liveNodes.includes(neighbour)) {
            neighbour.gCost = cost;
            neighbour.hCost = this.getDistance(neighbour, targetNode);
            neighbour.parent = currentNode;

            if (!liveNodes.includes(neighbour)) {
              liveNodes.push(neighbour);
            }
          }
        }
      });
    }

    return null;
  }

  private getWalkable(currentNode: PathfinderNodeType, neighbour: PathfinderNodeType) {
    const x = Math.abs(currentNode.gridX - neighbour.gridX);
    const y = Math.abs(currentNode.gridY - neighbour.gridY);

    if (neighbour.isWalkable && x + y === 2) {
      const neighbours1 = this.getNeighbours(currentNode);
      const neighbours2 = this.getNeighbours(neighbour);
      const shared = neighbours2.filter((value) => neighbours1.includes(value));

      return !shared.some((value) => !value.isWalkable);
    }

    return neighbour.isWalkable;
  }

  private tracePath(nodeA: PathfinderNodeType, nodeB: PathfinderNodeType) {
    const path: Phaser.Geom.Point[] = [];

    let currentNode = nodeB;

    while (currentNode !== nodeA) {
      path.push(new Phaser.Geom.Point(currentNode.gridX * this._tileWidth + this._tileWidth / 2, currentNode.gridY * this._tileHeight + this._tileHeight / 2));

      currentNode = currentNode.parent;
    }

    return path.reverse();
  }

  private getNeighbours(node: PathfinderNodeType) {
    const neighbours: PathfinderNodeType[] = [];

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) {
          continue;
        }

        const checkX = node.gridX + x;
        const checkY = node.gridY + y;

        if (checkX >= 0 && checkX < this._lengthX && checkY >= 0 && checkY < this._lengthY) {
          neighbours.push(this._nodes[checkY][checkX]);
        }
      }
    }

    return neighbours;
  }

  private getNodeFromXY(x: number, y: number) {
    const gridX = Math.floor(x / this._tileWidth);
    const gridY = Math.floor(y / this._tileHeight);

    return this._nodes[gridY]?.[gridX] ?? null;
  }

  private getDistance(nodeA: PathfinderNode, nodeB: PathfinderNode) {
    const distX = Math.abs(nodeA.gridX - nodeB.gridX);
    const distY = Math.abs(nodeA.gridY - nodeB.gridY);

    if (distX > distY) {
      return this.calcDistance(distY, distX);
    }

    return this.calcDistance(distX, distY);
  }

  private calcDistance(a: number, b: number) {
    return 14 * a + 10 * (b - a);
  }
}

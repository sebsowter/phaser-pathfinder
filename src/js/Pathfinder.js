class PathfinderNode {
  constructor(gridX, gridY, isWall) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.hCost = 0;
    this.gCost = 0;
    this.parent = null;
    this.isWall = isWall;
  }

  get fCost() {
    this.gCost + this.hCost;
  }
}

export default class Pathfinder {
  constructor(tiles, tileHeight, tileWidth) {
    this.tileHeight = tileHeight || 8;
    this.tileWidth = tileWidth || 8;
    this.lengthY = tiles.length;
    this.lengthX = tiles[0].length;
    this.nodes = tiles.map(function(row, y) {
      return row.map(function(isWall, x) {
        return new PathfinderNode(x, y, isWall);
      });
    });
  }

  getPath(pointA, pointB) {
    const startNode = this.getNodeByWorldXY(pointA.x, pointA.y);
    const targetNode = this.getNodeByWorldXY(pointB.x, pointB.y);
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
    
      liveNodes.splice(liveNodes.findIndex((node) => node === currentNode), 1);
      deadNodes.push(currentNode);

      if (currentNode === targetNode) {
        return this.tracePath(startNode, targetNode);
      }

      this.getNeighbours(currentNode).forEach((neighbour) => {
        if (!neighbour.isWall && !deadNodes.includes(neighbour)) {
          const newCost = currentNode.gCost + this.getDistance(currentNode, neighbour);

          if (newCost < neighbour.gCost || !liveNodes.includes(neighbour)) {
            neighbour.gCost = newCost;
            neighbour.hCost = this.getDistance(neighbour, targetNode);
            neighbour.parent = currentNode;

            if (!liveNodes.includes(neighbour)) {
              liveNodes.push(neighbour);
            }
          }
        }
      });
    }
  }

  tracePath(nodeA, nodeB) {
    const path = [];
  
    let currentNode = nodeB;
  
    while (currentNode !== nodeA) {
      path.push({
        x: currentNode.gridX,
        y: currentNode.gridY
      });
  
      currentNode = currentNode.parent;
    }

    path.reverse().pop();
  
    return path;
  }
  
  getNeighbours(node) {
    const neighbours = [];
    
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) {
          continue;
        }
        
        const checkX = node.gridX + x;
        const checkY = node.gridY + y;
  
        if (checkX >= 0 && checkX < this.lengthX && checkY >= 0 && checkY < this.lengthY) {
          neighbours.push(this.nodes[checkY][checkX]);
        }
      }
    }
  
    return neighbours;
  }
  
  getNodeByWorldXY(x, y) {
    const gridX = Math.floor(x / this.tileWidth);
    const gridY = Math.floor(y / this.tileHeight);
  
    return this.nodes[gridY][gridX];
  }
  
  getDistance(nodeA, nodeB) {
    const distX = Math.abs(nodeA.gridX - nodeB.gridX);
    const distY = Math.abs(nodeA.gridY - nodeB.gridY);
  
    if (distX > distY) {
      return this.calcDistance(distY, distX);
    }
  
    return this.calcDistance(distX, distY);
  }
  
  calcDistance(a, b) {
    return (14 * a) + (10 * (b - a));
  }
}

class Node {
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
  constructor(tiles) {
    this.lengthY = tiles.length;
    this.lengthX = tiles[0].length;
    this.nodes = tiles.map(function(row, y) {
      return row.map(function(isWall, x) {
        return new Node(x, y, isWall);
      });
    });
  }

  getPath(pointA, pointB) {
    const startNode = this.getNodeByXY(this.nodes, pointA.x, pointA.y);
    const targetNode = this.getNodeByXY(this.nodes, pointB.x, pointB.y);
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

      const neighbours = this.getNeighbours(currentNode);
      neighbours.forEach((neighbour) => {
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
  
  calcDistance(a, b) {
    return (14 * a) + (10 * (b - a));
  }
  
  getDistance(nodeA, nodeB) {
    const distX = Math.abs(nodeA.gridX - nodeB.gridX);
    const distY = Math.abs(nodeA.gridY - nodeB.gridY);
  
    if (distX > distY) {
      return this.calcDistance(distY, distX);
    }
  
    return this.calcDistance(distX, distY);
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
  
  getNodeByXY(nodes, x, y) {
    const gridX = Math.floor(x / 8);
    const gridY = Math.floor(y / 8);
  
    return nodes[gridY][gridX];
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
}

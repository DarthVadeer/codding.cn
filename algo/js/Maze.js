class Maze extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.isRenderVisited = true
    d.itemWidth = 8
    d.itemHeight = 8
    d.road = ' '
    d.wall = '#'
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    d.mazeData = (typeof mazeData === "undefined" ? require('./mazeData.js').default : mazeData).split('\n').map(row => row.split('').map(s => new Node(s)))
    d.contentWidth = d.mazeData[0].length * d.itemWidth
    d.contentHeight = d.mazeData.length * d.itemWidth
    d.canvas.width = d.contentWidth
    d.canvas.height = d.contentHeight
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    // d.mazeData[d.enter.y][d.enter.x].isPath = true
    // d.mazeData[d.exit.y][d.exit.x].isPath = true
  }
  inArea(y, x) {
    const d = this.d

    return (
      x >= 0 && x < d.mazeData[0].length &&
      y >= 0 && y < d.mazeData.length
    )
  }
  _inArea(y, x) {
    const d = this.d

    return (
      x >= 1 && x < d.mazeData[0].length - 1 &&
      y >= 1 && y < d.mazeData.length - 1
    )
  }
  dfsAll() {
    const d = this.d

    const dfs = (p) => {
      const node = d.mazeData[p.y][p.x]

      node.isPath = true
      node.visited = true

      if (p.x === d.exit.x && p.y === d.exit.y) return true

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited && 
          d.mazeData[newY][newX].n === d.road
        ) {
          if (dfs({x: newX, y: newY})) {
            return true
          }
        }
      }

      node.isPath = false
      return false
    }
    dfs(d.enter)
  }
  dfs1() {
    const d = this.d
    const dfs = (p) => {
      const node = d.mazeData[p.y][p.x]

      node.isPath = true
      node.visited = true

      if (p.x === d.exit.x && p.y === d.exit.y) return true

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited && 
          d.mazeData[newY][newX].n === d.road
        ) {
          if (dfs({x: newX, y: newY})) {
            return true
          }
        }
      }

      node.isPath = false
      return false
    }
    dfs(d.enter)
  }
  findPath(p) {
    const d = this.d

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
  }
  dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()
      d.mazeData[p.y][p.x].visited = true

      if (p.x === d.exit.x && p.y === d.exit.y) break

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited && 
          d.mazeData[newY][newX].n === d.road
        ) {
          stack.push({
            x: newX,
            y: newY,
            from: p,
          })
        }
      }
    }

    this.findPath(p)
  }
  bfs() {
    const d = this.d
    const queue = [d.enter]
    let p

    while (queue.length > 0) {
      p = queue.shift()
      d.mazeData[p.y][p.x].visited = true

      if (p.x === d.exit.x && p.y === d.exit.y) break

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited && 
          d.mazeData[newY][newX].n === d.road
        ) {
          queue.push({
            x: newX,
            y: newY,
            from: p,
          })
        }
      }
    }

    this.findPath(p)
  }
  generate() {
    const d = this.d

    d.isRenderVisited = false
    d.row = 71
    d.col = 71

    d.mazeData = Array(d.row).fill().map((_, idxRow) => {
      return Array(d.col).fill().map((_, idxCol) => {
        return new Node(idxRow % 2 === 1 && idxCol % 2 === 1 ? d.road : d.wall)
      })
    })

    d.contentWidth = d.mazeData[0].length * d.itemWidth
    d.contentHeight = d.mazeData.length * d.itemWidth
    d.canvas.width = d.contentWidth
    d.canvas.height = d.contentHeight
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }

    d.mazeData[d.enter.y][d.enter.x].n = d.road
    d.mazeData[d.exit.y][d.exit.x].n = d.road
  }
  generateDfs1() {
    this.generate()

    const d = this.d

    const dfs = (p) => {
      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road

          dfs({
            x: newX,
            y: newY,
          })
        }
      }
    }

    dfs({
      x: 1,
      y: 1,
    })
  }
  generateDfs2() {
    this.generate()

    const d = this.d
    const stack = [{x: 1, y: 1}]

    while (stack.length > 0) {
      const p = stack.pop()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          stack.push({
            x: newX,
            y: newY,
          })
        }
      }
    }
  }
  generateBfs() {
    this.generate()

    const d = this.d
    const queue = [{x: 1, y: 1}]

    while (queue.length > 0) {
      const p = queue.shift()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          queue.push({
            x: newX,
            y: newY,
          })
        }
      }
    }
  }
  generateRand() {
    this.generate()

    const d = this.d
    const queue = [{x: 1, y: 1}]

    while (queue.length > 0) {
      const p = queue[Math.random() < .5 ? 'shift' : 'pop']()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road

          for (let j = 0; j < 4; j++) {
            const _y = newY + d.dir[j][1]
            const _x = newX + d.dir[j][0]

            if (Math.random() < .02 && this._inArea(_y, _x)) {
              d.mazeData[_y][_x].n = d.road
            }
          }

          queue[Math.random() < .5 ? 'unshift' : 'push']({
            x: newX,
            y: newY,
          })
        }
      }
    }

    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.visited = false
      })
    })

    d.isRenderVisited = false
    this.dfs1()
  }
  setPos() {
    const d = this.d
  }
  render() {
    const d = this.d
    const {gd} = d

    d.mazeData.forEach((row, stair) => {
      row.forEach((node, idx) => {
        gd.beginPath()
        gd.rect(idx * d.itemWidth, stair * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = d.color[(node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited && d.isRenderVisited ? 'yellow' : 'white')))]
        gd.fill()
      })
    })
  }
}
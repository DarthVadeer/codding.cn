class Maze extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.isRenderVisited = true
    d.itemWidth = 6
    d.mazeData = typeof mazeData ===  "undefined" ? require('./mazeData').default : mazeData
    d.mazeData = d.mazeData.split('\n').map(row => row.split('').map(c => new Node(c)))
    d.contentWidth = d.mazeData[0].length * d.itemWidth
    d.contentHeight = d.mazeData.length * d.itemWidth
    d.canvas.width = d.contentWidth
    d.canvas.style.width = ''
    d.canvas.height = d.contentHeight
    d.wall = '#'
    d.road = ' '
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    // d.mazeData[d.enter.y][d.enter.x].isPath = true
    // d.mazeData[d.exit.y][d.exit.x].isPath = true
  }
  inArea(y, x) {
    return (
      y >= 0 && y < this.d.mazeData.length && 
      x >= 0 && x < this.d.mazeData[0].length
    )
  }
  findPath(p) {
    const d = this.d

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
  }
  dfs1() {
    const d = this.d

    const dfs = (p) => {
      const node = d.mazeData[p.y][p.x]

      node.visited = true
      node.isPath = true

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
  dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()

      const node = d.mazeData[p.y][p.x]

      node.visited = true
      node.isPath = true

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

      node.isPath = false
    }

    this.findPath(p)
  }
  bfs() {
    const d = this.d
    const queue = [d.enter]
    let p

    while (queue.length > 0) {
      p = queue.shift()

      const node = d.mazeData[p.y][p.x]

      node.visited = true
      node.isPath = true

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

      node.isPath = false
    }

    this.findPath(p)
  }
  generateInit() {
    const d = this.d

    d.row = 71
    d.col = 71

    d.mazeData = new Array(d.row).fill().map((_, idxRow) => {
      return new Array(d.col).fill().map((_, idxCol) => {
        return new Node(idxRow % 2 === 1 && idxCol % 2 === 1 ? d.road : d.wall)
      })
    })

    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    d.isRenderVisited = false
    d.canvas.width = d.col * d.itemWidth
    d.canvas.height = d.row * d.itemWidth
    d.mazeData[d.enter.y][d.enter.x].n = d.road
    d.mazeData[d.exit.y][d.exit.x].n = d.road
  }
  generateDfs1() {
    const d = this.d

    this.generateInit()

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

    dfs({x: 1, y: 1})
  }
  generateDfs2() {
    const d = this.d
    const stack = [{x: 1, y: 1}]

    this.generateInit()

    while (stack.length > 0) {
      const p = stack.pop()

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0] * 2
        const newX = p.x + d.dir[i][1] * 2

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited
        ) {
          stack.push({x: newX, y: newY})
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
        }
      }
    }
  }
  generateBfs() {
    const d = this.d
    const queue = [{x: 1, y: 1}]

    this.generateInit()

    while (queue.length > 0) {
      const p = queue.shift()

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0] * 2
        const newX = p.x + d.dir[i][1] * 2

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited
        ) {
          queue.push({x: newX, y: newY})
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
        }
      }
    }
  }
  generateRand() {
    const d = this.d
    const queue = [{x: 1, y: 1}]

    this.generateInit()

    while (queue.length > 0) {
      const p = queue[Math.random() < .5 ? 'pop' : 'shift']()
      // const p = queue.pop()

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0] * 2
        const newX = p.x + d.dir[i][1] * 2

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited
        ) {
          queue[Math.random() < .5 ? 'unshift' : 'push']({x: newX, y: newY})
          // queue.push({x: newX, y: newY})
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
        }
      }
    }

    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.visited = false
      })
    })
    this.bfs()

    /*console.log(d.mazeData.map((row) => {
      return row.map((node) => {
        return node.n
      }).join('')
    }).join('\n'))*/
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
        gd.fillStyle = d.color[node.n === '#' ? 'blue' : (node.isPath ? 'red' : (node.visited ? (d.isRenderVisited ? 'yellow' : 'white') : 'white'))]
        gd.fill()
      })
    })
  }
}
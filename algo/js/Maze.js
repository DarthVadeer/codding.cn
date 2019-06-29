class Maze extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.itemWidth = 6
    d.road = ' '
    d.wall = '#'
    d.mazeData = mazeData.split('\n').map(row => row.split('').map(n => new Node(n)))
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

    d.canvas.width = d.mazeData[0].length * d.itemWidth
    d.canvas.style.width = ''
    d.canvas.height = d.mazeData.length * d.itemWidth
  }
  inArea(y, x) {
    const d = this.d
    return (
      y >= 0 && y < d.mazeData.length &&
      x >= 0 && x < d.mazeData[0].length
    )
  }
  dfs1() {
    const d = this.d

    const findPath = (y, x) => {
      const node = d.mazeData[y][x]

      d.mazeData[y][x].visited = true
      node.isPath = true

      if (y === d.exit.y && x === d.exit.x) {
        // console.log('dfs1 路找到了')
        return true
      }

      for (let i = 0; i < 4; i++) {
        const newY = y + d.dir[i][0]
        const newX = x + d.dir[i][1]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          if (findPath(newY, newX)) {
            return true
          }
        }
      }

      node.isPath = false
      return false
    }

    findPath(d.enter.y, d.enter.x)
    d.dfs1Ready = true
  }
  findPath(p) {
    const d = this.d

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
  }
  async dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()
      const node = d.mazeData[p.y][p.x]

      d.mazeData[p.y][p.x].visited = true

      if (p.y === d.exit.y && p.x === d.exit.x) {
        // console.log('dfs2 路找到了')
        break
      }

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0]
        const newX = p.x + d.dir[i][1]

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

    d.dfs2Ready = true
    this.findPath(p)
  }
  bfs() {
    const d = this.d
    const queue = [d.enter]
    let p

    while (queue.length > 0) {
      p = queue.shift()
      const node = d.mazeData[p.y][p.x]

      d.mazeData[p.y][p.x].visited = true

      if (p.y === d.exit.y && p.x === d.exit.x) {
        // console.log('dfs2 路找到了')
        break
      }

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0]
        const newX = p.x + d.dir[i][1]

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

    d.bfsReady = true
    this.findPath(p)
  }
  setPos() {}
  render() {
    const d = this.d
    const {canvas, gd} = d

    // console.warn('%c render ' + d.typeItem.startFn, 'color: red')

    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.mazeData.forEach((row, stair) => {
      row.forEach((node, idx) => {
        gd.beginPath()
        gd.rect(idx * d.itemWidth, stair * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = d.color[node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited ? 'yellow' : 'white'))]
        gd.fill()
      })
    })
  }
}
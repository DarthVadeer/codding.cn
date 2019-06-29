class Maze extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    // d.canvas.onclick = () => {
    //   // console.log(d.canvas.toDataURL())
    //   d.canvas.toBlob((blob) => {
    //     const fm = new FormData()
    //     const xhr = new XMLHttpRequest()

    //     fm.append('imgName', d.typeItem.name + '.png')
    //     fm.append('img', blob)
    //     xhr.open('POST', 'http://localhost/save.php', true)
    //     xhr.send(fm)
    //   })
    // }

    d.itemWidth = 4
    d.itemHeight = 4
    d.road = ' '
    d.wall = '#'
    d.mazeData = mazeData.split('\n').map(row => row.split('').map(n => new Node(n)))
    d.canvas.width = d.itemWidth * d.mazeData[0].length
    d.canvas.style.width = ''
    d.canvas.height = d.itemWidth * d.mazeData.length
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }

    d.mazeData[d.enter.y][d.enter.x].isPath = true
    d.mazeData[d.exit.y][d.exit.x].isPath = true
  }
  findPath(p) {
    const d = this.d

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
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
    
    const dfs = (y, x) => {
      const node = d.mazeData[y][x]

      node.visited = true
      node.isPath = true

      if (y === d.exit.y && x === d.exit.x) return true

      for (let i = 0; i < 4; i++) {
        const newX = x + d.dir[i][1]
        const newY = y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          if (dfs(newY, newX)) return true
        }
      }

      node.isPath = false
      return false
    }

    dfs(d.enter.y, d.enter.x)
  }
  dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()
      const node = d.mazeData[p.y][p.x]

      node.visited = true

      if (p.y === d.exit.y && p.x === d.exit.x) break

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
      const node = d.mazeData[p.y][p.x]

      node.visited = true

      if (p.y === d.exit.y && p.x === d.exit.x) break

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
  setPos() {}
  render() {
    const d = this.d
    const {gd} = d

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
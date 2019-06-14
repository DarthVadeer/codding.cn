class Maze extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.road = ' '
    d.wall = '#'
    d.itemWidth = 5
    d.canvas.style.border = 'none'
    d.canvas.style.width = ''
    d.canvas.style.background = 'wheat'

    d.mazeData = mazeData.split(/\n/g).map(line => line.split('').map(c => new Node(c)))
    d.enter = {x: 1, y: 0}
    d.exit = {x: d.mazeData.length - 2, y: d.mazeData[0].length - 1}
    d.dir = [[-1, 0],[0, 1],[1, 0],[0, -1]]
    d.canvas.width = d.itemWidth * d.mazeData[0].length
    d.canvas.height = d.itemWidth * d.mazeData.length

    me.render('hard')

    d.btn.onclick = async (e) => {
      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          node.isPath = false
          node.visited = false
        })
      })
      d.sign = Math.random()
      d.delay = 1
      me[d.type.startFn]()
    }
  }
  generate1() {
    const me = this
    const d = me.d

    // console.log('generate1')
  }
  async bfs() {
    const me = this
    const d = me.d
    const sign = d.sign
    let isFind = false
    let queue = [d.enter]
    let lastP

    async function findPath(p) {
      let _p = p
      
      lastP = p

      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          node.isPath = false
        })
      })

      while (_p) {
        d.mazeData[_p.x][_p.y].isPath = true
        _p = _p.prev
      }

      d.delay && me.render()
      return sleep(d.delay)
    }

    while (queue.length > 0) {
      if (sign !== d.sign) {
        console.warn('sign2 时过境迁')
        return
      }

      const p = queue.shift()
      const node = d.mazeData[p.x][p.y]

      node.visited = true

      await findPath(p)

      if (p.x === d.exit.x && p.y === d.exit.y) {
        isFind = true
        break
      }

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][0]
        const newY = p.y + d.dir[i][1]

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited && 
          d.mazeData[newX][newY].n === d.road
        ) {
          queue.push({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    await findPath(lastP)
    me.render()
  }
  async dfs2() {
    const me = this
    const d = me.d
    const sign = d.sign
    let isFind = false
    let stack = [d.enter]
    let lastP

    async function findPath(p) {
      let _p = p
      
      lastP = p

      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          node.isPath = false
        })
      })

      while (_p) {
        d.mazeData[_p.x][_p.y].isPath = true
        _p = _p.prev
      }

      d.delay && me.render()
      return sleep(d.delay)
    }

    while (stack.length > 0) {
      if (sign !== d.sign) {
        console.warn('sign2 时过境迁')
        return
      }

      const p = stack.pop()
      const node = d.mazeData[p.x][p.y]

      node.visited = true

      await findPath(p)

      if (p.x === d.exit.x && p.y === d.exit.y) {
        isFind = true
        break
      }

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][0]
        const newY = p.y + d.dir[i][1]

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited && 
          d.mazeData[newX][newY].n === d.road
        ) {
          stack.push({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    await findPath(lastP)
    me.render()
  }
  async dfs1() {
    const me = this
    const d = me.d
    const sign = d.sign

    async function dfs(x, y) {
      if (sign !== d.sign) {
        console.warn('sign1 时过境迁')
        return
      }

      const node = d.mazeData[x][y]

      node.isPath = true
      node.visited = true

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      if (x === d.exit.x && y === d.exit.y) {
        return new Promise(next => next(true))
      }

      for (let i = 0; i < 4; i++) {
        const newX = x + d.dir[i][0]
        const newY = y + d.dir[i][1]

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited && 
          d.mazeData[newX][newY].n === d.road
        ) {
          if (await dfs(newX, newY)) return new Promise(next => next(true))
        }
      }

      node.isPath = false
      return new Promise(next => next(false))
    }

    await dfs(d.enter.x, d.enter.y)
    me.render()
  }
  inArea(x, y) {
    const me = this
    const d = me.d

    return (
      x >= 0 && x < d.mazeData.length &&
      y >= 0 && y < d.mazeData[0].length
    )
  }
  setPos() {
    const me = this
    const d = me.d

    // console.log('setPos')
  }
  render(hard) {
    // Maze.count = Maze.count || 0
    // console.log(++Maze.count)
    const me = this
    const d = me.d
    const {canvas, gd} = d

    d.bgImg && gd.drawImage(
      d.bgImg,
      0, 0, d.bgImg.width, d.bgImg.height
    )

    d.mazeData.forEach((row, idxRow, arr) => {
      row.forEach((node, idxCol, arr) => {
        if (node.n === d.wall && !hard) return
        gd.beginPath()
        gd.rect(idxCol * d.itemWidth, idxRow * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = Node.color[node.isPath ? 'red' : (node.visited ? 'yellow' : (node.n === d.wall ? 'blue' : 'white'))]
        gd.fill()
      })
    })

    if (!d.bgImg) {
      d.bgImg = new Image()
      canvas.toBlob((blob) => {
        d.bgImg.src = URL.createObjectURL(blob)
      })
    }
  }
}
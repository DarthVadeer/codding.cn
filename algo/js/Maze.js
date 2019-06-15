class Maze extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 5
    d.delay = 0
    d.road = ' '
    d.wall = '#'
    d.sign = 1
    d.canvas.style.width = ''
    d.canvas.style.boxShadow = 'none'
    d.canvas.style.background = 'wheat'

    d.mazeData = mazeData.split('\n').map(line => line.split('').map(c => new Node(c)))
    d.enter = {x: 1, y: 0}
    d.exit = {x: d.mazeData.length - 2, y: d.mazeData[0].length - 1}
    d.dir = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    d.canvas.width = d.itemWidth * d.mazeData[0].length
    d.canvas.height = d.itemWidth * d.mazeData.length

    // d.mazeData[d.enter.x][d.enter.y].isPath = true
    // d.mazeData[d.exit.x][d.exit.y].isPath = true
    me.render()

    d.btn.onclick = (e) => {
      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          if (node.n !== d.road) return
          node.visited = false
          node.isPath = false
        })
      })

      d.sign++
      d.delay = 1
      me[d.type.startFn]()
    }
  }
  async bfs() {
    const me = this
    const d = me.d
    const sign = d.sign
    const queue = [d.enter]
    let isFind = false
    let lastP

    function findPath(p) {
      let _p = p

      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          node.isPath = false
        })
      })

      while (_p) {
        d.mazeData[_p.x][_p.y].isPath = true
        _p = _p.prev
      }
    }

    while (queue.length > 0) {
      const p = queue.shift()
      const node = d.mazeData[p.x][p.y]

      lastP = p

      if (d.sign !== sign) {
        console.warn('bfs 时过境迁')
        return
      }

      node.visited = true

      if (d.delay) {
        findPath(p)
        me.render()
        await sleep(d.delay)
      }

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

    if (isFind) {
      findPath(lastP)
      d.bg.width && me.render()
    } else {
      console.log('no solution')
    }
  }
  async dfs2() {
    const me = this
    const d = me.d
    const sign = d.sign
    const stack = [d.enter]
    let isFind = false
    let lastP

    function findPath(p) {
      let _p = p

      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          node.isPath = false
        })
      })

      while (_p) {
        d.mazeData[_p.x][_p.y].isPath = true
        _p = _p.prev
      }
    }

    while (stack.length > 0) {
      const p = stack.pop()
      const node = d.mazeData[p.x][p.y]

      lastP = p

      if (d.sign !== sign) {
        console.warn('dfs2 时过境迁')
        return
      }

      node.visited = true

      if (d.delay) {
        findPath(p)
        me.render()
        await sleep(d.delay)
      }

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

    if (isFind) {
      findPath(lastP)
      d.bg.width && me.render()
    } else {
      console.log('no solution')
    }
  }
  async dfs1() {
    const me = this
    const d = me.d
    const sign = d.sign

    async function dfs(x, y) {
      const node = d.mazeData[x][y]

      if (d.sign !== sign) {
        console.warn('dfs1 时过境迁')
        return
      }

      node.visited = true
      node.isPath = true

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      if (x === d.exit.x && y === d.exit.y) return new Promise(next => next(true))

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
    d.bg.width && me.render()
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

  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    gd.fillStyle = '#fff'
    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.bg && gd.drawImage(
      d.bg,
      0, 0, d.bg.width, d.bg.height
    )

    d.mazeData.forEach((row, idxRow, arr) => {
      row.forEach((node, idxCol, arr) => {
        if (node.n === d.wall && d.bg) return
        gd.beginPath()
        gd.rect(idxCol * d.itemWidth, idxRow * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = Node.color[node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited ? 'yellow' : 'white'))]
        gd.fill()
      })
    })

    if (!d.bg) {
      d.bg = new Image()
      d.bg.onload = me.render.bind(me)
      canvas.toBlob((blob) => d.bg.src = URL.createObjectURL(blob))
      // document.body.insertBefore(d.bg, document.body.children[0])
    }
  }
}
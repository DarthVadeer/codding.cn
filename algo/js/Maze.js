class Maze extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 6
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
    // d.dir.push(d.dir.shift())
    // d.dir.push(d.dir.shift())
    d.canvas.width = d.itemWidth * d.mazeData[0].length
    d.canvas.height = d.itemWidth * d.mazeData.length

    // d.mazeData[d.enter.x][d.enter.y].isPath = true
    // d.mazeData[d.exit.x][d.exit.y].isPath = true
    // ;['bfs', 'dfs2', 'dfs1'].some(v => v === d.type.startFn) && me.render()

    d.btn.onclick = (e) => {
      console.clear()

      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          if (node.n !== d.road) return
          node.visited = false
          node.visited2 = false
          node.isPath = false
        })
      })

      d.sign++
      d.delay = 1
      console.log(d.type.startFn)
      me[d.type.startFn]()
    }
  }
  async generateRandomQueue2() {
    const me = this
    const d = me.d
    const sign = d.sign
    const randomQueue = [{x: 1, y: 1}]

    me.generateReset()

    while (randomQueue.length > 0) {
      if (d.sign !== sign) {
        console.log('generateRandomQueue2 时过境迁')
        return
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      const p = randomQueue[Math.random() < .5 ? 'pop' : 'shift']()

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
          randomQueue[Math.random() < .5 ? 'unshift' : 'push']({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    me.dfs1()
    me.render()
  }
  async generateRandomQueue1() {
    const me = this
    const d = me.d
    const sign = d.sign
    const randomQueue = [{x: 1, y: 1}]

    me.generateReset()

    while (randomQueue.length > 0) {
      if (d.sign !== sign) {
        console.log('generateRandomQueue1 时过境迁')
        return
      }

      randomQueue.swap(rand(0, randomQueue.length - 1), randomQueue.length - 1)
      const p = randomQueue.pop()

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
          randomQueue.push({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    me.dfs1()
    me.render()
  }
  async generate3() {
    const me = this
    const d = me.d
    const sign = d.sign
    const queue = [{x: 1, y: 1}]

    me.generateReset()

    while (queue.length > 0) {
      const p = queue.shift()

      if (d.sign !== sign) {
        console.log('generate2 时过境迁')
        return
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
          queue.push({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    me.render()
  }
  async generate2() {
    const me = this
    const d = me.d
    const sign = d.sign
    const stack = [{x: 1, y: 1}]

    me.generateReset()

    while (stack.length > 0) {
      const p = stack.pop()

      if (d.sign !== sign) {
        console.log('generate2 时过境迁')
        return
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
          stack.push({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    me.render()
  }
  async generate1() {
    const me = this
    const d = me.d
    const sign = d.sign

    me.generateReset()

    async function createRoad(x, y) {
      if (d.sign !== sign) {
        console.log('generate1 时过境迁')
        return new Promise(next => next())
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = x + d.dir[i][0] * 2
        const newY = y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[x + _x][y + _y].n = d.road
          await createRoad(newX, newY)
        }
      }

      return new Promise(next => next())
    }

    await createRoad(1, 1)
    me.render()
  }
  generateReset() {
    const me = this
    const d = me.d

    d.row = 81
    d.col = 81

    d.mazeData = new Array(d.row).fill().map((_, idxRow) => {
      return new Array(d.col).fill().map((_, idxCol) => {
        return new Node(
          idxRow % 2 === 1 && idxCol % 2 === 1 ? ' ' : '#',
          {
            inMist: true
          }
        )
      })
    })

    d.exit = {x: d.mazeData.length - 2, y: d.mazeData[0].length - 1}
    d.mazeData[d.enter.x][d.enter.y].n = d.road
    d.mazeData[d.exit.x][d.exit.y].n = d.road
    d.canvas.width = d.itemWidth * d.mazeData[0].length
    d.canvas.height = d.itemWidth * d.mazeData.length
  }
  findPath(p) {
    const me = this
    const d = me.d
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
  async bfs() {
    const me = this
    const d = me.d
    const sign = d.sign
    const queue = [d.enter]
    let isFind = false
    let lastP

    while (queue.length > 0) {
      if (d.sign !== sign) {
        console.warn('bfs 时过境迁')
        return
      }

      const p = queue.shift()
      const node = d.mazeData[p.x][p.y]

      lastP = p
      node.visited = true

      if (d.delay) {
        me.findPath(p)
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
      me.findPath(lastP)
      me.render()
    } else {
      console.log('no solution bfs')
    }
  }
  async dfs2() {
    const me = this
    const d = me.d
    const sign = d.sign
    const stack = [d.enter]
    let isFind = false
    let lastP

    while (stack.length > 0) {
      if (d.sign !== sign) {
        console.warn('dfs2 时过境迁')
        return
      }

      const p = stack.pop()
      const node = d.mazeData[p.x][p.y]

      lastP = p
      node.visited = true

      if (d.delay) {
        me.findPath(p)
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
      me.findPath(lastP)
      me.render()
    } else {
      console.log('no solution dfs2')
    }
  }
  async dfs1() {
    const me = this
    const d = me.d
    const sign = d.sign

    async function dfs(x, y) {
      if (d.sign !== sign) {
        console.warn('dfs1 时过境迁')
        return
      }

      const node = d.mazeData[x][y]

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

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

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
  openMist(x, y) {
    const me = this
    const d = me.d

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (me.inArea(i, j)) {
          d.mazeData[i][j].inMist = false
        }
      }
    }
  }
  setPos() {
    const me = this
    const d = me.d

  }
  render(hard) {
    // console.warn('render')
    const me = this
    const d = me.d
    const {canvas, gd} = d

    gd.fillStyle = '#fff'
    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.mazeData.forEach((row, idxRow, arr) => {
      row.forEach((node, idxCol, arr) => {
        gd.beginPath()
        gd.rect(idxCol * d.itemWidth, idxRow * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = Node.color[node.inMist ? 'black' : (node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited ? 'yellow' : 'white')))]
        gd.fill()
      })
    })
  }
}
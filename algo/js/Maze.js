class Maze extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 6
    d.itemHeight = 6
    d.wall = '#'
    d.road = ' '
    d.mazeData = mazeData.split('\n')
    d.mazeData.forEach((item, idx, arr) => {
      d.mazeData[idx] = item.split('').map((wall) => {
        return new Node(wall, {
          isPath: false,
          visited: false,
        })
      })
    })

    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
    // d.dir.reverse()
    d.enter = {
      x: 1,
      y: 0,
    }
    d.exit = {
      x: d.mazeData[0].length - 2,
      y: d.mazeData.length - 1,
    }

    d.canvas.style.border = 'none'
    d.canvas.style.width = ''
    d.canvas.width = d.mazeData[0].length * d.itemWidth
    d.canvas.height = d.mazeData.length * d.itemWidth

    me.preset(() => {
      if (me.ready) {
        d.btn.onclick = null
        me.ready()
      }
    })
  }
  dfs2() {
    const me = this
    const d = me.d

    d.btn.onclick = function() {
      d.btn.onclick = null
      me.findSolution2()
    }
  }
  dfs() {
    const me = this
    const d = me.d

    d.btn.onclick = function() {
      d.btn.onclick = null
      me.findSolution1()
    }
  }
  getMaze(x, y) {
    const me = this
    return me.d.mazeData[x][y]
  }
  async findSolution2() {
    const me = this
    const d = me.d
    const stack = [d.enter]
    let isSolved = false

    while (stack.length > 0) {
      const p = stack.pop()
      const node = me.getMaze(p.x, p.y)

      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          node.isPath = false
        })
      })

      node.visited = true
      let _p = p
      while (_p) {
        d.mazeData[_p.x][_p.y].isPath = true
        _p = _p.prev
      }
      me.render()
      await sleep(1)

      if (p.x === d.exit.x && p.y === d.exit.y) {
        isSolved = true
        console.log('找到了出口 dfs2')
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
  }
  async findSolution1() {
    const me = this
    const d = me.d

    async function findSolution1(x, y) {
      const node = me.getMaze(x, y)

      node.visited = true
      node.isPath = true
      me.render()
      await sleep(1)

      if (x === d.exit.x && y === d.exit.y) {
        console.log('找到了出口 dfs1')
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
          if (await findSolution1(newX, newY)) {
            return new Promise(next => next(true))
          }
        }
      }

      node.isPath = false
      me.render()
      await sleep(1)
      return new Promise(next => next(false))
    }

    await findSolution1(d.enter.x, d.enter.y)
    me.render()
  }
  setPos() {
    const me = this
    const d = me.d

    /*d.mazeData.forEach((arr, n) => {
      arr.forEach((node, idx, arr) => {
        node.x = idx * d.itemWidth
        node.y = n * d.itemHeight
      })
    })*/
  }
  inArea(y, x) {
    const me = this
    const maze = me.d.mazeData

    return (
      y >= 0 && y < maze.length && 
      x >= 0 && x < maze[0].length
    )
  }
  preset(cb) {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    d.mazeData.forEach((arr, n) => {
      arr.forEach((node, idx, arr) => {
        node.x = idx * d.itemWidth
        node.y = n * d.itemHeight
        gd.beginPath()
        gd.rect(node.x, node.y, d.itemWidth, d.itemWidth)
        gd.fillStyle = Node.color[node.isPath ? 'red' : (node.n === d.wall ? 'blue' : 'white')]
        gd.fill()
      })
    })

    canvas.toBlob((blob) => {
      d.presetImg = new Image()
      d.presetImg.src = URL.createObjectURL(blob)
      d.presetImg.onload = cb
    })
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    if (!d.presetImg) return

    gd.drawImage(
      d.presetImg,
      0, 0, d.presetImg.width, d.presetImg.height
    )

    function renderScene() {
      d.mazeData.forEach((arr, n) => {
        arr.forEach((node, idx, arr) => {
          if (node.n === d.wall) return

          gd.beginPath()
          gd.rect(node.x, node.y, d.itemWidth, d.itemWidth)
          gd.fillStyle = Node.color[node.isPath ? 'red' : (node.visited ? 'yellow' : 'white')]
          gd.fill()
        })
      })
    }

    renderScene()
  }
}

class Maze extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.devicePixelRatio = 1
    d.itemWidth = 6
    d.itemHeight = 6
    d.wall = '#'
    d.road = ' '
    d.mazeData = mazeData.split('\n').map((line) => {
      return line.split('').map((c) => new Node(c))
    })

    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
    d.enter = {
      x: 1,
      y: 0,
    }
    d.exit = {
      x: d.mazeData.length - 2,
      y: d.mazeData[0].length - 1,
    }

    d.canvas.style.border = 'none'
    d.canvas.width = (d.mazeData.length * d.itemWidth) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = (d.mazeData[0].length * d.itemHeight) * d.devicePixelRatio

    me.preset()
    d.btn.onclick = (e) => {
      d.btn.onclick = null
      me.ready()
    }
  }
  dfs1() {
    const me = this
    const d = me.d

    async function dfs(x, y) {
      const node = d.mazeData[x][y]

      node.visited = true
      node.isPath = true

      me.render()
      await sleep(1)

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

      // me.render()
      // await sleep(1)

      return new Promise(next => next(false))
    }

    me.ready = async () => {
      console.log(await dfs(d.enter.x, d.enter.y) ? 'yes' : 'no')
      me.render()
    }
  }
  dfs2() {
    const me = this
    const d = me.d
    const stack = [d.enter]

    me.ready = async () => {
      let isFind = false

      while (stack.length > 0) {
        const p = stack.pop()
        const node = d.mazeData[p.x][p.y]

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

      me.render()
    }
  }
  nfs() {
    const me = this
    const d = me.d
    const queue = [d.enter]

    me.ready = async () => {
      let isFind = false

      while (queue.length > 0) {
        const p = queue.shift()
        const node = d.mazeData[p.x][p.y]
        let _p = p

        node.visited = true
        d.mazeData.forEach((row, idx, arr) => {
          row.forEach((node, idx, arr) => {
            node.isPath = false
          })
        })

        while (_p) {
          d.mazeData[_p.x][_p.y].isPath = true
          _p = _p.prev
        }

        me.render()
        await sleep(1)

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

      me.render()
    }
  }
  preset(cb) {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    me.setPos()

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.mazeData.forEach((row, stair, arr) => {
      row.forEach((node, idx, arr) => {
        node.x = idx * d.itemWidth
        node.y = stair * d.itemHeight

        gd.beginPath()
        gd.rect(node.x, node.y, d.itemWidth, d.itemHeight)
        gd.fillStyle = Node.color[node.n === d.wall ? 'blue' : 'white']
        gd.fill()
      })
    })

    d.canvas.toBlob((blob) => {
      d.presetImg = new Image()
      d.presetImg.onload = (e) => {
        cb && cb()
      }
      d.presetImg.src = URL.createObjectURL(blob)
    })
    gd.restore()
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

    if (!d.presetImg) return

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.drawImage(
      d.presetImg,
      0, 0, canvas.width, canvas.height
    )

    d.mazeData.forEach((row, stair, arr) => {
      row.forEach((node, idx, arr) => {
        if (node.n === d.wall) return

        gd.beginPath()
        gd.rect(node.x, node.y, d.itemWidth, d.itemHeight)
        gd.fillStyle = Node.color[node.isPath ? 'red' : (node.visited ? 'yellow' : 'white')]
        gd.fill()
      })
    })
    gd.restore()
  }
}
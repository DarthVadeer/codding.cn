class SolveMaze extends Common {
  create() {
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

    me.preset()
    d.btn.onclick = function() {
      d.btn.onclick = null
      me.findSolution()
    }
  }
  getMaze(x, y) {
    const me = this
    return me.d.mazeData[x][y]
  }
  async findSolution() {
    const me = this
    const d = me.d
    const dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
    let count = 0

    async function findSolution(x, y) {
      const node = me.getMaze(x, y)

      node.visited = true
      node.isPath = true

      ++count
      if (count > 0) {
        me.render()
        await sleep(1)
      }

      if (x === d.exit.x && y === d.exit.y) {
        // alert('找到了出口')
        d.btn.innerHTML = d.btn.title + '（找到了出口）'
        return new Promise(next => next(true))
      }

      for (let i = 0; i < 4; i++) {
        const newX = x + dir[i][0]
        const newY = y + dir[i][1]

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited && 
          d.mazeData[newX][newY].n === d.road
        ) {
          if (await findSolution(newX, newY)) {
            return new Promise(next => next(true))
          }
        }
      }

      node.isPath = false
      if (count > 0) {
        me.render()
        await sleep(1)
      }
      return new Promise(next => next(false))
    }

    await findSolution(d.enter.x, d.enter.y)
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
        gd.fillStyle = Node.color[node.isPath ? 'orange' : (node.n === d.wall ? 'blue' : 'white')]
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
          gd.fillStyle = Node.color[node.isPath ? 'orange' : (node.visited ? 'yellow' : 'white')]
          gd.fill()
        })
      })
    }

    renderScene()
  }
}

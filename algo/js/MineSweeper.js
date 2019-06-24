class MineSweeper extends Common {
  constructor() {
    super(...arguments)
    
    const me = this
    const d = me.d

    d.colors = new Array(8).fill().map((_, idx, arr) => {
      const len = arr.length
      const deg = idx / len * 360
      return 'hsla(' + deg + ', 50%, 50%, 1)'
    })
    // d.canvas.style.maxWidth = 'none'
  }
  create() {
    const me = this
    const d = me.d

    d.itemWidth = 30
    d.row = 20
    d.col = 20
    d.mine = 1
    d.mineNum = parseInt(d.row * d.col / 8)
    d.img = {}
    d.arr = new Array(d.row).fill().map((_, idxRow) => {
      return new Array(d.col).fill().map((_, idxCol) => {
        return new Node(0, {
          count: 0,
          countMine: 0,
          isMine: false,
          isOpen: false,
          isFlag: false,
        })
      })
    })

    me.resetMineData()
    me.shuffle()
    me.initBg(() => {
      d.ready = true
      me.render()
    })
    me.initEvents()

    d.arr.forEach((row, idx, arr) => {
      console.log(row.map(n => n.isMine ? '*' : ' ').join('-'))
    })
  }
  async initEvents() {
    const me = this
    const d = me.d

    d.canvas.onclick = d.canvas.oncontextmenu = async (e) => {
      e.preventDefault()

      if (d.isGameOver || d.isSucc || d.isAni) return

      const scale = d.canvas.offsetWidth / d.canvas.width
      const x = parseInt(e.offsetX / d.itemWidth / scale)
      const y = parseInt(e.offsetY / d.itemWidth / scale)
      const node = d.arr[y][x]

      if (node.isOpen) return

      switch (e.type) {
        case 'click':
          if (node.isFlag) return

          if (node.isMine) {
            setTimeout(() => {
              d.isGameOver = true
              alert('game over')
            }, 100)
            node.isOpen = true
          } else if (node.countMine > 0) {
            node.isOpen = true
          } else {
            await me.open(y, x)
          }
          break
        case 'contextmenu':
          node.isFlag = !node.isFlag
          break
      }

      d.isSucc = true
      d.arr.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          if (!node.isMine && !node.isOpen) {
            d.isSucc = false
          }
        })
      })

      if (d.isSucc) {
        setTimeout(() => {
          alert('你赢了')
        }, 100)
      }
      me.render()
    }
  }
  resetMineData() {
    const me = this
    const d = me.d

    for (let i = d.row * d.col - 1; i > -1; i--) {
      const y = parseInt(i / d.col)
      const x = i % d.col

      d.arr[y][x].isMine = i < d.mineNum ? 1 : 0
    }
  }
  shuffle() {
    const me = this
    const d = me.d

    for (let i = d.row * d.col - 1; i > -1; i--) {
      const y1 = parseInt(i / d.col)
      const x1 = i % d.col

      const randNum = Math.floor(Math.random() * (i + 1))
      const y2 = parseInt(randNum / d.col)
      const x2 = randNum % d.col

      me.swap(y1, x1, y2, x2)
    }

    d.arr.forEach((row, idxRow, arr) => {
      row.forEach((node, idxCol, arr) => {
        for (let i = idxRow - 1; i <= idxRow + 1; i++) {
          for (let j = idxCol - 1; j <= idxCol + 1; j++) {
            if (!me.inArea(i, j)) continue
            const _node = d.arr[i][j]
            node.countMine += (_node.isMine ? 1 : 0)
          }
        }
      })
    })
  }
  inArea(y, x) {
    const me = this
    const d = me.d

    return (
      y >= 0 && y < d.row &&
      x >= 0 && x < d.col
    )
  }
  async open(y, x) {
    const me = this
    const d = me.d
    const queue = [{y, x}]

    d.isAni = true

    while (queue.length > 0) {
      const p = queue.shift()

      d.arr[p.y][p.x].isOpen = true
      me.render()
      await sleep(1)

      for (let i = p.y - 1; i <= p.y + 1; i++) {
        for (let j = p.x - 1; j <= p.x + 1; j++) {
          if (!me.inArea(i, j)) continue
          const node = d.arr[i][j]
          if (node.visited) continue
          node.visited = true
          if (node.countMine === 0) {
            queue.push({
              y: i,
              x: j,
            })
          } else {
            d.arr[i][j].isOpen = true
            me.render()
            await sleep(1)
          }
        }
      }
    }

    d.arr.forEach((row, idx, arr) => {
      row.forEach((node, idx, arr) => {
        node.visited = false
      })
    })

    d.isAni = false
    return sleep(0)
  }
  initBg(cb) {
    const me = this
    const d = me.d

    const c = document.createElement('canvas')
    const gd = c.getContext('2d')

    // document.body.insertBefore(c, document.body.children[0])

    c.style.background = 'wheat'
    c.style.margin = '20px'
    c.width = d.itemWidth
    c.height = d.itemWidth

    gd.beginPath()
    gd.rect(0, 0, d.itemWidth, d.itemWidth)
    gd.fillStyle = '#eee'
    gd.fill()

    gd.beginPath()
    gd.lineTo(0, d.itemWidth)
    gd.lineTo(0, 0)
    gd.lineTo(d.itemWidth, 0)
    gd.lineWidth = 4
    gd.strokeStyle = '#fff'
    gd.stroke()

    gd.beginPath()
    gd.lineTo(d.itemWidth, 0)
    gd.lineTo(d.itemWidth, d.itemWidth)
    gd.lineTo(0, d.itemWidth)
    gd.lineWidth = 4
    gd.strokeStyle = '#bbb'
    gd.stroke()

    d.img.rect = new Image()
    d.img.rect.src = c.toDataURL()

    gd.rect(0, 0, d.itemWidth, d.itemWidth)
    gd.fillStyle = '#ccc'
    gd.fill()
    gd.lineWidth = 2
    gd.strokeStyle = '#aaa'
    gd.stroke()

    d.img.bg = new Image()
    d.img.bg.src = c.toDataURL()

    gd.drawImage(
      d.img.rect,
      0, 0, d.itemWidth, d.itemWidth
    )
    gd.beginPath()
    gd.lineTo(d.itemWidth * .3, d.itemWidth * .2)
    gd.lineTo(d.itemWidth * .8, d.itemWidth * .2)
    gd.lineTo(d.itemWidth * .3, d.itemWidth * .6)
    gd.closePath()
    gd.fillStyle = Node.color.red
    gd.fill()

    gd.beginPath()
    gd.lineTo(d.itemWidth * .3, d.itemWidth * .2)
    gd.lineTo(d.itemWidth * .3, d.itemWidth * .8)
    gd.lineWidth = 2
    gd.strokeStyle = '#666'
    gd.stroke()
    d.img.flag = new Image()
    d.img.flag.src = c.toDataURL()

    gd.beginPath()
    gd.clearRect(0, 0, c.width, c.height)
    gd.arc(d.itemWidth / 2, d.itemWidth / 2, d.itemWidth / 3, 0, 2 * Math.PI)
    gd.fillStyle = Node.color.red
    gd.fill()
    d.img.mine = new Image()
    d.img.mine.src = c.toDataURL()

    setTimeout(cb, 10)
  }
  swap(y1, x1, y2, x2) {
    const me = this
    const d = me.d
    const t = d.arr[y1][x1]

    d.arr[y1][x1] = d.arr[y2][x2]
    d.arr[y2][x2] = t
  }
  setPos() {
    const me = this
    const d = me.d

    d.canvas.width = d.itemWidth * d.col
    d.canvas.style.width = ''
    d.canvas.height = d.itemWidth * d.row
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    if (!d.ready) return

    gd.fillStyle = '#ddd'
    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.arr.forEach((row, idxRow, arr) => {
      row.forEach((node, idxCol, arr) => {
        const x = idxCol * d.itemWidth
        const y = idxRow * d.itemWidth

        gd.beginPath()

        if (node.isFlag) {
          // 旗子
          gd.drawImage(
            d.img.flag,
            x, y, d.itemWidth, d.itemWidth
          )
        } else {
          if (node.isOpen) {
            // 打开了
            if (node.isMine) {
              gd.drawImage(
                d.img.mine,
                x, y, d.itemWidth, d.itemWidth
              )
            } else {
              gd.drawImage(
                d.img.bg,
                x, y, d.itemWidth, d.itemWidth
              )

              if (node.countMine > 0) {
                gd.textAlign = 'center'
                gd.textBaseline = 'middle'
                gd.fillStyle = '#333'
                gd.font = '16px Impact'
                gd.fillStyle = d.colors[node.countMine]
                gd.fillText(node.countMine, x + d.itemWidth / 2, y + d.itemWidth / 2)
              }
            }
          } else {
            // 没打开
            gd.drawImage(
              d.img.rect,
              x, y, d.itemWidth, d.itemWidth
            )
          }
        }
      })
    })
  }
}
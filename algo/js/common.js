class Item {
  constructor(n, o) {
    this.n = n

    o = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      fillStyle: Algo.color.black,
      strokeStyle: Algo.color.black,
      ...o,
    }

    for (let key in o) {
      this[key] = o[key]
    }
  }
}

class Common {
  constructor(d = {}) {
    this.d = d
    d.conf = {
      itemWidth: 30,
      itemHeight: 18,
      levelHeight: 38,
      paddingH: 15,
      paddingV: 15,
      devicePixelRatio,
      font: '14px Arial',
      fontSm: '12px Arial',
      fontLg: '16px Arial',
      ...d.conf,
    }
    d.color = Algo.color
    d.countRender = 0
  }
  renderItem(item, o = {}) {
    if (!item) return

    const d = this.d
    const {gd} = d
    const itemWidth = o.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = o.itemHeight || d.itemHeight || d.conf.itemHeight

    gd.save()
    gd.globalAlpha = .8
    gd.beginPath()
    gd.rect(item.x + 1, item.y, itemWidth - 2, itemHeight)
    gd.fillStyle = item.fillStyle
    gd.fill()
    gd.restore()

    gd.beginPath()
    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.font = d.conf.font
    gd.fillStyle = d.color.white
    gd.fillText(item.n, item.x + itemWidth / 2, item.y + itemHeight / 2)

    gd.fillStyle = d.color.black
    gd.textBaseline = 'bottom'

    if ('balanceFactor' in item) {
      ;['高度:' + item.h, '平衡:' + item.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, item.x + itemWidth / 2, (idx - arr.length + 1) * 16 + item.y - 2)
      })
    }
  }
  /*log() {
    console.log(
      '%c' + ' countRender:',
      'color: #a00',
      this.d.countRender,
      this.d.typeItem.name,
    )
  }*/
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach(item => item.strokeStyle = randColor().toString())
    d.steps = [d.arr.clone()]
  }
  setPos() {
    const d = this.d

    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = ((d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio

    d.steps.forEach((row, stair) => {
      row.forEach((item, idx) => {
        if (!item) return
        item.x = idx * d.conf.itemWidth
        item.y = stair * d.conf.levelHeight
      })
    })
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    const renderItem = () => {
      d.steps.forEach((row, idx) => {
        row.forEach((item, idx) => {
          ++d.countRender
          this.renderItem(item)
        })
      })
    }

    const renderLine = () => {
      d.steps.last().forEach((item, idx) => {
        let stair = d.steps.length

        gd.beginPath()

        while (--stair > -1) {
          ++d.countRender
          const _item = d.steps[stair][item.fromIndex]
          if (!_item) continue

          item = _item
          gd.lineTo(item.x + itemWidth / 2 + .5, item.y + itemHeight / 2)
        }

        gd.strokeStyle = item.strokeStyle
        gd.stroke()
      })
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderItem()
    gd.restore()
  }
}

class Heap extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach(item => item.fillStyle = d.color.blue)
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    let count = 0

    d.contentWidth = Math.pow(2, d.level - 1) * itemWidth
    d.contentHeight = (d.level - 1) * d.conf.levelHeight

    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio

    for (let i = 0; i < d.level; i++) {
      const n = Math.pow(2, i)
      const perW = d.contentWidth / n

      for (let j = 0; j < n && count + j < d.arr.length; j++) {
        const index = count + j
        const item = d.arr[index]

        item.x = j * perW + perW / 2 - itemWidth / 2
        item.y = i * d.conf.levelHeight
      }

      count += n
    }
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderItem = () => {
      d.arr.forEach((item) => {
        ++d.countRender
        this.renderItem(item)
      })
    }

    const renderLine = () => {
      for (let i = d.branchIndex; i > -1; i--) {
        const node = d.arr[i]
        const nodeL = d.arr[i * 2 + 1]
        const nodeR = d.arr[i * 2 + 2]

        ++d.countRender
        gd.beginPath()
        nodeL && gd.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
        gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
        nodeR && gd.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      }
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderItem()
    gd.restore()
  }
}

class Tree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.paddingTop = 60
    d.contentWidth = d.arr.length * d.conf.itemWidth
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    const levelHeight = d.levelHeight || d.conf.levelHeight

    d.iLeft = 0
    d.contentHeight = 0
    d.translateX = 0

    d.arr.forEach((item, idx) => {
      item.x = idx * d.conf.itemWidth
      item.y = 0
    })

    const setPos = (node, depth) => {
      if (!node) return

      setPos(node.l, depth + 1)
      node.x = d.iLeft
      node.y = depth * levelHeight + d.paddingTop
      d.iLeft += itemWidth / 2
      setPos(node.r, depth + 1)

      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (node.l && node.r) {
        node.x = (node.l.x + node.r.x) / 2
      }
    }

    function updateCoord(node) {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

      node.x += d.translateX
    }

    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return
      setPos(rootNode, 0)
      d.iLeft += idx === arr.length - 1 ? itemWidth / 2 : itemWidth
    })

    d.translateX = (d.contentWidth - d.iLeft) / 2

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      if (!rootNode) return
      updateCoord(rootNode, 0)
      d.iLeft += itemWidth / 2
    })

    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = (d.contentHeight + itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderItem = (node) => {
      if (!node) return

      renderItem(node.l)
      renderItem(node.r)
      
      ++d.countRender
      this.renderItem(node)
    }

    const renderLine = (node) => {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      ++d.countRender
      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
      gd.strokeStyle = d.color.black
      gd.stroke()
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    d.arr.forEach((item) => {
      this.renderItem(item, {itemWidth: d.conf.itemWidth})
    })
    ;[d.root, d.root2].forEach((rootNode, idx) => {
      renderLine(rootNode)
      renderItem(rootNode)
    })
    gd.restore()
  }
}

class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.maxDepth = 6
    d.contentWidth = 600
    d.contentHeight = 600
    d.canvas.width = d.contentWidth * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = d.contentWidth * d.conf.devicePixelRatio
  }
  create() {}
  setPos() {}
}
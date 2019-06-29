class Node {
  constructor(n, extend) {
    this.n = n

    extend = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      fillStyle: Algo.color.black,
      strokeStyle: Algo.color.black,
      ...extend,
    }

    for (let key in extend) {
      this[key] = extend[key]
    }
  }
}

class Common {
  constructor(d = {}) {
    this.d = d

    d.conf = Algo.conf
    d.color = Algo.color
    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  renderNode(node, o = {}) {
    if (!node) return

    const d = this.d
    const {gd} = d
    const itemWidth = node.width || o.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = node.height || o.itemHeight || d.itemHeight || d.conf.itemHeight

    let x = node.width ? 
    node.x - (node.width - d.conf.itemWidth) / 2 :
    node.x

    gd.beginPath()
    gd.save()
    gd.globalAlpha = .8
    gd.rect(x + 1, node.y, itemWidth - 2, itemHeight)
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.fillStyle = d.color.white
    gd.font = d.conf.font
    gd.fillText(node.n, x + itemWidth / 2 + .5, node.y + itemHeight / 2)

    if ('balanceFactor' in node) {
      gd.textBaseline = 'bottom'
      ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillStyle = d.color.black
        gd.fillText(str, x + itemWidth / 2, -(arr.length - idx - 1) * 16 + node.y - 2)
      })
    }
  }
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach(node => node.strokeStyle = randColor().toString())
    d.steps = [d.arr.clone()]
  }
  setPos() {
    const d = this.d

    d.steps.forEach((row, stair) => {
      row.forEach((node, idx) => {
        if (!node) return

        node.x = idx * d.conf.itemWidth
        node.y = stair * d.conf.levelHeight
      })
    })

    d.contentHeight = (d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderLine = () => {
      d.steps.last().forEach((node, idx) => {
        let stair = d.steps.length

        gd.beginPath()

        while (--stair > -1) {
          const _node = d.steps[stair][node.fromIndex]
          if (!_node) continue

          node = _node
          gd.lineTo(node.x + d.conf.itemWidth / 2 + .5, node.y + d.conf.itemHeight / 2)
        }

        gd.strokeStyle = node.strokeStyle
        gd.stroke()
      })
    }

    const renderNode = () => {
      d.steps.forEach((row, idx) => {
        row.forEach((node, idx) => {
          this.renderNode(node)
        })
      })
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderNode()
    gd.restore()
  }
}

class Heap extends Common {
  constructor() {
    super(...arguments)

    const d = this.d
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.arr.forEach(node => node.fillStyle = d.color.blue)
  }
  setPos() {
    const d = this.d
    let count = 0

    d.contentWidth = Math.pow(2, d.level - 1) * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.contentHeight = (d.level - 1) * d.conf.levelHeight
    d.canvas.height = (d.contentHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.scale
    
    for (let i = 0; i < d.level; i++) {
      const n = Math.pow(2, i)
      const perW = d.contentWidth / n

      for (let j = 0; j < n && count + j < d.arr.length; j++) {
        const index = count + j
        const node = d.arr[index]

        node.x = j * perW + perW / 2 - d.conf.itemWidth / 2
        node.y = i * d.conf.levelHeight
      }

      count += n
    }
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderLine = () => {
      for (let i = d.branchIndex; i > -1; i--) {
        const node = d.arr[i]
        const nodeL = d.arr[i * 2 + 1]
        const nodeR = d.arr[i * 2 + 2]

        gd.beginPath()
        nodeL && gd.lineTo(nodeL.x + d.conf.itemWidth / 2, nodeL.y + d.conf.itemHeight / 2)
        gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
        nodeR && gd.lineTo(nodeR.x + d.conf.itemWidth / 2, nodeR.y + d.conf.itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      }
    }

    const renderNode = () => {
      d.arr.forEach((node, idx) => {
        this.renderNode(node)
      })
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderNode()
    gd.restore()
  }
}

class Tree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.paddingH = 20
    d.paddingTop = 60
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    const levelHeight = d.levelHeight || d.conf.levelHeight

    d.contentWidth = d.arr.length * d.conf.itemWidth + d.paddingH * 2
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'

    d.iLeft = 0
    d.contentHeight = 0
    d.translateX = 0

    d.arr.forEach((node, idx) => {
      node.x = idx * d.conf.itemWidth + d.paddingH
      node.y = 0
    })

    const setPos = (node, depth) => {
      if (!node) return

      setPos(node.l, depth + 1)
      node.x = d.iLeft
      d.iLeft += itemWidth / 2
      node.y = depth * levelHeight + d.paddingTop
      setPos(node.r, depth + 1)

      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (node.l && node.r) {
        node.x = (node.l.x + node.r.x) / 2
      }
    }

    const updateCoord = (node) => {
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
    !d.root2 && (d.translateX += itemWidth / 4)

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      if (!rootNode) return
      updateCoord(rootNode)
    })

    d.canvas.height = (d.contentHeight + itemHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    const levelHeight = d.levelHeight || d.conf.levelHeight

    const renderLine = (node) => {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
      gd.strokeStyle = d.color.black
      gd.stroke()
    }

    const renderNode = (node) => {
      if (!node) return

      renderNode(node.l)
      renderNode(node.r)
      this.renderNode(node)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    d.arr.forEach(node => this.renderNode(node, {itemWidth: d.conf.itemWidth}))
    ;[d.root, d.root2].forEach((rootNode, idx) => {
      renderLine(rootNode)
      renderNode(rootNode)
    })
    gd.restore()
  }
}

class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.depth = 5
    d.maxDepth = 6
    d.countLoop = 0
    d.contentWidth = 600
    d.contentHeight = 600
    d.canvas.width = d.contentWidth * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = d.contentHeight * d.conf.scale
  }
  create() {}
  setPos() {}
  render() {}
  /*log() {
    const d = this.d
    console.log('%c countLoop ' + d.countLoop + ' ' + d.typeItem.cons, 'color: red')
  }*/
}
class Node {
  constructor(n) {
    this.n = n
    this.x = 0
    this.y = 0
    this.tx = 0
    this.ty = 0
    this.fillStyle = Node.color.black
    this.strokeStyle = Node.color.black
  }
}

Node.color = {
  red: '#f23',
  green: 'green',
  blue: '#09f',
  orange: '#f80',
  purple: 'purple',
  white: 'white',
  black: '#333',
}

class Common {
  constructor(d = {}) {
    this.d = d

    d.arr.forEach((node, idx, arr) => {
      node.x = idx * d.conf.itemWidth
      node.y = 0
    })
    d.canvas.width = (d.arr.length * d.conf.itemWidth + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
  }
  getItemWidth() {
    return this.d.itemWidth || this.d.conf.itemWidth
  }
  getItemHeight() {
    return this.d.itemHeight || this.d.conf.itemHeight
  }
  getLevelHeight() {
    return this.d.levelHeight || this.d.conf.levelHeight
  }
  renderArr() {
    const d = this.d
    const {canvas, gd} = d

    if (d.arrRendered) return

    d.arr.forEach((node, idx, arr) => {
      gd.save()
      gd.globalAlpha = .75
      gd.beginPath()
      gd.rect(node.x + 1, node.y, d.conf.itemWidth - 1, d.conf.itemHeight)
      gd.fillStyle = node.fillStyle
      gd.fill()
      gd.restore()

      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.font = d.conf.font
      gd.fillStyle = Node.color.white
      gd.fillText(node.n, node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
    })
  }
  renderNode(node) {
    if (!node) return

    const d = this.d
    const {canvas, gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()

    gd.save()
    gd.globalAlpha = .75
    gd.beginPath()
    gd.rect(node.x + 1, node.y, itemWidth - 1, itemHeight)
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.font = d.conf.font
    gd.fillStyle = Node.color.white
    gd.fillText(node.n, node.x + itemWidth / 2, node.y + itemHeight / 2)

    if (node.balanceFactor !== undefined) {
      ;['高度=' + node.h, '平衡=' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillStyle = Node.color.black
        gd.textBaseline = 'bottom'
        gd.fillText(str, node.x + itemWidth / 2, node.y - (arr.length - idx - 1) * 16 - 2)
      })
    }
  }
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach((node, idx, arr) => {
      node.strokeStyle = randColor()
    })
    d.steps = [d.arr.clone()]
  }
  setPos() {
    const d = this.d

    d.steps.forEach((step, stair, arr) => {
      step.forEach((node, idx, arr) => {
        if (!node) return

        node.x = idx * d.conf.itemWidth
        node.y = stair * d.conf.levelHeight
      })
    })

    d.canvas.height = ((d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
  }
  render() {
    const d = this.d
    const {canvas, gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    d.steps.forEach((step, stair, arr) => {
      stair > 0 && step.forEach((from, idx, arr) => {
        if (!from) return

        let _stair = stair
        let to

        while (!to) to = d.steps[--_stair][from.fromIndex]

        gd.beginPath()
        gd.lineTo(from.x + .5 + itemWidth / 2, from.y + itemHeight / 2)
        gd.lineTo(to.x + .5 + itemWidth / 2, to.y + itemHeight / 2)
        gd.strokeStyle = from.strokeStyle
        gd.stroke()
      })
    })

    d.steps.forEach((step, stair, arr) => {
      step.forEach((node, idx, arr) => {
        this.renderNode(node)
      })
    })
    gd.restore()
  }
}

class Heap extends Common {
  constructor() {
    super(...arguments)
  }
  setPos() {
    const d = this.d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()
    let count = 0

    for (let i = 0; i < d.level; i++) {
      const n = Math.pow(2, i)
      const perW = Math.pow(2, d.level - 1) * itemWidth / n

      for (let j = 0; j < n && count + j < d.arr.length; j++) {
        const index = count + j
        const node = d.arr[index]

        node.x = j * perW + perW / 2 - itemWidth / 2
        node.y = i * levelHeight
      }

      count += n
    }
  }
  render() {
    const d = this.d
    const {canvas, gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    
    for (let i = d.branchIndex; i > -1; i--) {
      const node = d.arr[i]
      const nodeL = d.arr[i * 2 + 1]
      const nodeR = d.arr[i * 2 + 2]

      gd.beginPath()
      nodeL && gd.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      nodeR && gd.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
      gd.strokeStyle = node.strokeStyle
      gd.stroke()
    }

    d.arr.forEach((node, idx, arr) => {
      this.renderNode(node)
    })
    gd.restore()
  }
}

class Tree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.paddingTop = 40
  }
  setPos() {
    const d = this.d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()
    let translateX = 0
    let translateY = 0

    d.iLeft = 0
    d.level = -1
    d.iHeight = 0

    function setPos(node) {
      if (!node) return

      d.level++
      setPos(node.l)
      node.x = d.iLeft
      node.y = d.level * levelHeight + d.paddingTop + d.conf.paddingV
      d.iLeft += itemWidth / 2
      setPos(node.r)
      d.level--

      if (node.l && node.r) {
        node.x = (node.l.x + node.r.x) / 2
      }

      d.iHeight = Math.max(d.iHeight, node.y)
    }

    function updateCoord(node) {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

      node.x += translateX
    }

    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      setPos(rootNode)
      d.iLeft += idx === arr.length - 1 ? itemWidth / 2 : itemWidth
    })

    translateX = (d.canvas.width / d.devicePixelRatio - d.iLeft) / 2 - d.conf.paddingH

    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      updateCoord(rootNode)
    })

    d.canvas.height = (d.iHeight + itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()

    function renderLine(node) {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
      gd.strokeStyle = node.strokeStyle
      gd.stroke()
    }

    function renderNode(node) {
      if (!node) return

      renderNode(node.l)
      renderNode(node.r)

      me.renderNode(node)
    }

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    me.renderArr()
    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      renderLine(rootNode)
      renderNode(rootNode)
    })
    gd.restore()
  }
}
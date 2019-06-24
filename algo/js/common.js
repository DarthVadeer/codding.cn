class Node {
  constructor(n) {
    const o = {
      n,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      fillStyle: Node.color.black,
      strokeStyle: Node.color.black,
      ...arguments[1],
    }

    for (let key in o) {
      this[key] = o[key]
    }
  }
}

Node.color = {
  red: '#f23',
  green: 'green',
  blue: '#09f',
  orange: '#f80',
  purple: '#c0a',
  yellow: '#ff0',
  white: 'white',
  black: '#333',
  gray: '#ccc',
}

class Common {
  constructor(d = {}) {
    const me = this

    me.d = d
    d.canvas.width = (d.arr.length * d.conf.itemWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.arr.forEach((node, idx, arr) => {
      node.x = idx * d.conf.itemWidth
      node.y = 0
    })
  }
  getItemWidth() {
    const d = this.d
    return d.itemWidth || d.conf.itemWidth
  }
  getItemHeight() {
    const d = this.d
    return d.itemHeight || d.conf.itemHeight
  }
  getLevelHeight() {
    const d = this.d
    return d.levelHeight || d.conf.levelHeight
  }
  setPos() {}
  render() {}
  renderArr() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    d.arr.forEach((node, idx, arr) => {
      gd.save()
      gd.beginPath()
      gd.rect(node.x + 1, node.y, itemWidth - 2, itemHeight)
      gd.globalAlpha = .8
      gd.fillStyle = node.fillStyle
      gd.fill()
      gd.restore()

      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.fillStyle = Node.color.white
      gd.font = d.conf.fontSm
      gd.fillText(node.n, node.x + itemWidth / 2, node.y + itemHeight / 2)
    })
  }
  renderNode(node) {
    if (!node) return

    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()

    gd.save()
    gd.beginPath()
    gd.rect(node.x + 1, node.y, itemWidth - 2, itemHeight)
    gd.globalAlpha = .8
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.fillStyle = Node.color.white
    gd.font = d.conf.fontSm
    gd.fillText(node.n, node.x + itemWidth / 2, node.y + itemHeight / 2)

    if (node.h !== undefined) {
      gd.fillStyle = Node.color.black
      gd.font = d.conf.fontSm
      gd.textAlign = 'center'
      gd.textBaseline = 'bottom'

      ;['高度=' + node.h, '平衡=' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, node.x + itemWidth / 2, node.y - idx * 14 - 4)
      })
    }
  }
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.arr.forEach((node, idx, arr) => {
      node.strokeStyle = randColor().toString()
    })
    d.steps = [d.arr.clone()]
  }
  setPos() {
    const me = this
    const d = me.d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    d.canvas.height = ((d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingH * 2) * d.conf.devicePixelRatio

    d.steps.forEach((step, stair, arr) => {
      step.forEach((node, idx, arr) => {
        if (!node) return

        node.x = idx * itemWidth
        node.y = stair * d.conf.levelHeight
      })
    })
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    function renderNode() {
      d.steps.forEach((step, stair, arr) => {
        step.forEach((node, idx, arr) => {
          me.renderNode(node)
        })
      })
    }

    function renderLine() {
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
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderNode()
    gd.restore()
  }
}

class Heap extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.arr.forEach(node => node.fillStyle = Node.color.blue)
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.canvas.width = (Math.pow(2, d.level - 1) * d.conf.itemWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio
  }
  setPos() {
    const me = this
    const d = me.d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()
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
    const me = this
    const d = me.d
    const {canvas, gd} = d

    function renderNode() {
      d.arr.forEach((node, idx, arr) => {
        me.renderNode(node)
      })
    }

    function renderLine() {
      const itemWidth = me.getItemWidth()
      const itemHeight = me.getItemHeight()

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
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderNode()
    gd.restore()
  }
}

class Tree extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.paddingTop = 40
  }
  flip(node) {
    if (!node) return

    const me = this
    const t = node.l

    node.l = node.r
    node.r = t

    me.flip(node.l)
    me.flip(node.r)

    return node
  }
  setPos() {
    const me = this
    const d = me.d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()
    let translateX = 0

    d.level = -1
    d.iLeft = 0
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
      d.iLeft += (idx === arr.length - 1 ? itemWidth / 2 : itemWidth)
    })

    translateX = (d.canvas.width / d.conf.devicePixelRatio - d.conf.paddingH * 2 - d.iLeft) / 2
    !d.root2 && (translateX += itemWidth / 2)
    d.canvas.height = (d.iHeight + itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio

    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      updateCoord(rootNode)
    })
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    
    function renderLine(node) {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      const nodeL = node.l
      const nodeR = node.r

      gd.beginPath()
      nodeL && gd.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      nodeR && gd.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
      gd.strokeStyle = node.strokeStyle
      gd.stroke()
    }

    function renderNode(node) {
      if (!node) return

      renderNode(node.l)
      renderNode(node.r)

      me.renderNode(node)
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    me.renderArr()
    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      renderLine(rootNode)
      renderNode(rootNode)
    })
    gd.restore()
  }
}

class Fractal extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.depth = 6
    d.maxDepth = 6
    d.canvas.style.boxShadow = 'none'
    d.canvas.width =
    d.canvas.height = 512 * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'

    d.canvas.onclick = (e) => {
      e.preventDefault()
      d.depth++
      d.depth > d.maxDepth && (d.depth = d.maxDepth)
      me.render()
    }
    d.canvas.oncontextmenu = (e) => {
      e.preventDefault()
      d.depth--
      d.depth < 1 && (d.depth = 1)
      me.render()
    }
  }
}
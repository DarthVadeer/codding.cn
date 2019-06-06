Array.prototype.clone= function() {
  return clone(this)
}

Array.prototype.swap = function(a, b) {
  const t = this[a]
  this[a] = this[b]
  this[b] = t
}

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.rnd = function(len, rangeL, rangeR) {
  rangeL = rangeL === undefined ? 0 : rangeL
  rangeR = rangeR === undefined ? len : rangeR
  return new Array(len).fill().map(_ => rand(rangeL, rangeR))
}

async function sleep(time) {
  return new Promise((next) => {
    time > 0 ? setTimeout(next, time) : next()
  })
}

function clone(o) {
  return JSON.parse(JSON.stringify(o))
}

function rand(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m)
}

function randColor(a) {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 : a,
  }

  return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
}

class Node {
  constructor(n) {
    const color = Common.prototype.color

    this.n = n
    this.x = 0
    this.y = 0
    this.tx = 0
    this.ty = 0
    this.fillStyle = '#333'
    this.strokeStyle = '#333'
  }
}

class Common {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.arr.forEach((node, idx, arr) => {
      node.x = idx * d.conf.itemWidth + d.conf.sceneSpace
      node.y = d.conf.sceneSpace
    })
    d.canvas.width = (d.arr.length * me.getItemWidth() + d.conf.sceneSpace * 2) * devicePixelRatio
    d.canvas.style.width = d.canvas.width / devicePixelRatio + 'px'
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
  updatePos(node) {
    let vx = (node.tx - node.x) / 15
    let vy = (node.ty - node.y) / 15

    /*if (node.x.toString().indexOf('.') > -1 || node.y.toString().indexOf('.') > -1) {
      console.log(this.constructor.name, node)
    }*/

    vx = Math[vx > 0 ? 'ceil' : 'floor'](vx)
    vy = Math[vy > 0 ? 'ceil' : 'floor'](vy)

    node.x += vx
    node.y += vy
  }
  renderArr() {
    const me = this
    const d = me.d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()

    if (d.arrRendered) return

    d.arrRendered = true
    d.arr.forEach((node, idx, arr) => {
      me.renderNode(node)
    })
  }
  renderNode(node, idx) {
    const me = this
    const d = me.d

    if (!node) return

    const {gd, conf} = this.d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()

    gd.save()
    gd.globalAlpha = .7
    gd.beginPath()
    gd.rect(node.x + 1, node.y, itemWidth - 2, itemHeight)
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.font = conf.font
    gd.fillStyle = '#fff'
    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.fillText(node.n, node.x + itemWidth / 2, node.y + itemHeight / 2)

    if (idx !== undefined) {
      gd.fillStyle = d.color.def
      gd.font = d.conf.fontSm
      gd.textAlign = 'center'
      gd.textBaseline = 'bottom'
      gd.fillText(idx, node.x + itemWidth / 2, node.y)
    }

    if (node.balanceFactor !== undefined) {
      ;['高度=' + node.h, '平衡=' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillStyle = d.color.def
        gd.font = d.conf.fontSm
        gd.textAlign = 'center'
        gd.textBaseline = 'bottom'
        gd.fillText(str, node.x + itemWidth / 2, node.y - (arr.length - idx - 1) * 16 - 2)
      })
    }
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)
  }
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.arr.forEach((node, idx, arr) => {
      node.strokeStyle = randColor()
    })
    d.steps = [d.arr.clone()]
  }
  setPos() {
    const me = this
    const d = me.d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()

    d.canvas.height = ((d.steps.length - 1) * levelHeight + itemHeight + d.conf.sceneSpace * 2) * devicePixelRatio

    d.steps.forEach((step, stair, arr) => {
      step.forEach((node, idx, arr) => {
        if (!node) return
        node.x = idx * itemWidth + d.conf.sceneSpace
        node.y = stair * levelHeight + d.conf.sceneSpace
      })
    })
  }
  render() {
    const me = this
    const d = me.d
    const {gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()

    super.render()
    gd.save()
    gd.scale(devicePixelRatio, devicePixelRatio)
    d.steps.forEach((step, stair, arr) => {
      stair > 0 && step.forEach((from, idx, arr) => {
        if (!from) return

        let _stair = stair
        let to

        while (!to) to = d.steps[--_stair][from.fromIndex]

        gd.beginPath()
        gd.lineTo(from.x + itemWidth / 2 + .5, from.y + itemHeight / 2)
        gd.lineTo(to.x + itemWidth / 2 + .5, to.y + itemHeight / 2)
        gd.strokeStyle = from.strokeStyle
        gd.stroke()
      })
    })

    d.steps.forEach((step, stair, arr) => {
      step.forEach((node, idx, arr) => {
        me.renderNode(node)
      })
    })
    gd.restore()
  }
}

class Heap extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d
    
    d.sceneTopSpace = 10
    d.arr.forEach((node, idx, arr) => {
      node.fillStyle = d.color.blue
    })
  }
  setPos() {
    const me = this
    const d = me.d
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

        node.x = perW * j + perW / 2 - itemWidth / 2 + d.conf.sceneSpace
        node.y = i * levelHeight + d.conf.sceneSpace + d.sceneTopSpace
      }

      count += n
    }
  }
  render() {
    const me = this
    const d = me.d
    const {gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()

    super.render()
    gd.save()
    gd.scale(devicePixelRatio, devicePixelRatio)
    d.arr.forEach((node, idx, arr) => {
      const nodeL = arr[idx * 2 + 1]
      const nodeR = arr[idx * 2 + 2]

      gd.beginPath()
      nodeL && gd.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      nodeR && gd.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
      gd.strokeStyle = d.color.def
      gd.stroke()
    })

    d.arr.forEach((node, idx, arr) => {
      me.renderNode(node, idx)
    })
    gd.restore()
  }
}

class Tree extends Common {
  constructor() {
    super(...arguments)
    
    const me = this
    const d = me.d

    d.sceneTopSpace = 50
  }
  setPos() {
    const me = this
    const d = me.d
    const {canvas, gd, conf} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()

    d.level = -1
    d.iLeft = 0
    d.iHeight = 0
    
    function setPos(node) {
      if (!node) return

      d.level++
      setPos(node.l)
      node.x = d.iLeft
      d.iLeft += itemWidth / 2
      node.y = d.level * levelHeight
      setPos(node.r)
      d.level--

      if (node.l && node.r) {
        node.x = (node.l.x + node.r.x) / 2
      }
    }

    function translateCoord(node) {
      if (!node) return

      translateCoord(node.l)
      translateCoord(node.r)

      node.x += (canvas.width / devicePixelRatio - d.iLeft) / 2
      node.y += d.sceneTopSpace + conf.sceneSpace
      d.iHeight = Math.max(d.iHeight, node.y)
    }

    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return

      setPos(rootNode)
      d.iLeft += idx === arr.length - 1 ? itemWidth / 2 : itemWidth
    })
    
    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return

      translateCoord(rootNode)
    })
    
    canvas.height = (d.iHeight + itemHeight + d.conf.sceneSpace) * devicePixelRatio
  }
  render() {
    const me = this
    const d = me.d
    const {gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()

    function renderLine(node) {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
      gd.strokeStyle = d.color.def
      gd.stroke()
    }

    function renderNode(node) {
      if (!node) return

      renderNode(node.l)
      renderNode(node.r)

      me.renderNode(node)
    }

    super.render()
    gd.save()
    gd.scale(devicePixelRatio, devicePixelRatio)
    me.renderArr()
    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return

      renderLine(rootNode)
      renderNode(rootNode)
    })
    gd.restore()
  }
}
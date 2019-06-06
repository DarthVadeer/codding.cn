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

class MergeSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    function mergeSort(l, r) {
      if (l >= r) return

      const mid = l + parseInt((r - l) / 2)
      mergeSort(l, mid)
      mergeSort(mid + 1, r)

      const aux = new Array(r - l + 1)

      for (let i = l; i <= r; i++) {
        aux[i - l] = d.arr[i]
        aux[i - l].fromIndex = i
        aux[i - l].fillStyle = d.color.orange
      }

      let i = l
      let j = mid + 1

      for (let k = l; k <= r; k++) {
        if (i > mid) {
          d.arr[k] = aux[j - l]
          j++
        } else if (j > r) {
          d.arr[k] = aux[i - l]
          i++
        } else if (aux[i - l].n <= aux[j - l].n) {
          d.arr[k] = aux[i - l]
          i++
        } else {
          d.arr[k] = aux[j - l]
          j++
        }
      }

      const fillStyle = d.color[l === 0 && r === d.arr.length - 1 ? 'blue' : 'orange']

      d.steps.push(
        new Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone().map((node) => {
            node.fillStyle = fillStyle
            return node
          })
        )
      )
    }

    mergeSort(0, d.arr.length - 1)
  }
}

class QuickSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    function quickSort(l, r) {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
        d.arr[i].fillStyle = d.color.orange
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let j = l

      for (let i = l + 1; i <= r; i++) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.red
          d.arr.swap(i, j + 1)
          j++
        }
      }

      d.arr[l].fillStyle = d.color.blue
      d.arr.swap(l, j)
      d.steps.push(
        new Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )

      quickSort(l, j - 1)
      quickSort(j + 1, r)
    }

    quickSort(0, d.arr.length - 1)
    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
}

class QuickSort2 extends Sort {
  startSort() {
    const me = this
    const d = me.d

    function quickSort(l, r) {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let i = l + 1
      let j = r

      while (true) {
        while (i <= r && d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.red
          i++
        }
        while (j > l && d.arr[j].n > v) {
          d.arr[j].fillStyle = d.color.orange
          j--
        }
        if (i > j) break
        d.arr.swap(i, j)
        d.arr[i].fillStyle = d.color.red
        d.arr[j].fillStyle = d.color.orange
        i++
        j--
      }

      d.arr[l].fillStyle = d.color.blue
      d.arr.swap(l, j)
      d.steps.push(
        new Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )

      quickSort(l, j - 1)
      quickSort(j + 1, r)
    }

    quickSort(0, d.arr.length - 1)
    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
}

class QuickSort3 extends Sort {
  startSort() {
    const me = this
    const d = me.d

    function quickSort(l, r) {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let lt = l
      let gt = r + 1
      let i = l + 1

      while (i < gt) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.red
          d.arr.swap(i, lt + 1)
          lt++
          i++
        } else if (d.arr[i].n > v) {
          d.arr[i].fillStyle = d.color.orange
          d.arr.swap(i, gt - 1)
          gt--
        } else {
          d.arr[i].fillStyle = d.color.purple
          i++
        }
      }

      d.arr[l].fillStyle = d.color.blue
      d.arr.swap(l, lt)
      d.steps.push(
        new Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )

      quickSort(l, lt - 1)
      quickSort(gt, r)
    }

    quickSort(0, d.arr.length - 1)
    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
}

class BinarySearch extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.blue
      d.root = me.add(d.root, item)
    })
  }
  add(node, item) {
    if (!node) return item

    if (item.n < node.n) {
      node.l = this.add(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.add(node.r, item)
    } else {
      // ===
    }

    return node
  }
}

class BinarySearchFlip extends BinarySearch {
  create() {
    const me = this
    const d = me.d

    super.create()

    function flip(node) {
      if (!node) return

      flip(node.l)
      flip(node.r)

      const t = node.l
      node.l = node.r
      node.r = t
    }

    d.root2 = clone(d.root)
    flip(d.root2)
  }
}

class AVLTree extends Tree {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 40
    d.levelHeight = 60
    d.sceneTopSpace = 80
    d.canvas.width = (d.arr.length * me.getItemWidth() + d.conf.sceneSpace * 2) * devicePixelRatio
    d.canvas.style.width = d.canvas.width / devicePixelRatio + 'px'

    d.arr.forEach((node, idx, arr) => {
      node.x = idx * d.itemWidth + d.conf.sceneSpace
      node.y = d.conf.sceneSpace
    })
  }
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.blue
      item.h = 1
      item.balanceFactor = 0
      d.root = me.add(d.root, item)
    })
  }
  add(node, item) {
    const me = this

    if (!node) return item

    if (item.n < node.n) {
      node.l = this.add(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.add(node.r, item)
    } else {
      // ===
    }

    const balanceFactor = me.getBalanceFactor(node)

    if (Math.abs(balanceFactor) > 1) {
      if (balanceFactor > 0) {
        // 左边高
        if (me.getBalanceFactor(node.l) < 0) {
          node.l = me.leftRotate(node.l)
        }
        node = me.rightRotate(node)
      } else {
        // 右边高
        if (me.getBalanceFactor(node.r) > 0) {
          node.r = me.rightRotate(node.r)
        }
        node = me.leftRotate(node)
      }
    }

    node.h = Math.max(me.getHeight(node.l), me.getHeight(node.r)) + 1
    node.balanceFactor = me.getBalanceFactor(node)

    return node
  }
  leftRotate(x) {
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    // y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
  rightRotate(x) {
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    // y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
  getHeight(node) {
    return node ? node.h : 0
  }
  getBalanceFactor(node) {
    return node ? this.getHeight(node.l) - this.getHeight(node.r) : 0
  }
}

class RBTree extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.red
      d.root = me.addL(d.root, item)
      d.root.fillStyle = d.color.black
    })

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.red
      d.root2 = me.addR(d.root2, item)
      d.root2.fillStyle = d.color.black
    })
  }
  addR(node, item) {
    const me = this
    const d = me.d

    if (!node) return item

    if (item.n < node.n) {
      node.l = this.addR(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.addR(node.r, item)
    } else {
      // ===
    }

    if (me.isRed(node.l) && !me.isRed(node.r)) {
      node = me.rightRotate(node)
    }

    if (me.isRed(node.r) && me.isRed(node.r.r)) {
      node = me.leftRotate(node)
    }

    if (me.isRed(node.r) && me.isRed(node.l)) {
      me.flipColors(node)
    }

    return node
  }
  addL(node, item) {
    const me = this
    const d = me.d

    if (!node) return item

    if (item.n < node.n) {
      node.l = this.addL(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.addL(node.r, item)
    } else {
      // ===
    }

    if (me.isRed(node.r) && !me.isRed(node.l)) {
      node = me.leftRotate(node)
    }

    if (me.isRed(node.l) && me.isRed(node.l.l)) {
      node = me.rightRotate(node)
    }

    if (me.isRed(node.l) && me.isRed(node.r)) {
      me.flipColors(node)
    }

    return node
  }
  isRed(node) {
    const d = this.d
    return node ? node.fillStyle === d.color.red : false
  }
  leftRotate(x) {
    const d = this.d
    const y = x.r

    x.r = y.l
    y.l = x

    y.fillStyle = x.fillStyle
    x.fillStyle = d.color.red

    return y
  }
  rightRotate(x) {
    const d = this.d
    const y = x.l

    x.l = y.r
    y.r = x

    y.fillStyle = x.fillStyle
    x.fillStyle = d.color.red

    return y
  }
  flipColors(node) {
    const d = this.d

    node.fillStyle = d.color.red
    node.l.fillStyle = d.color.black
    node.r.fillStyle = d.color.black
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

    function updateCoord(node) {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

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

      updateCoord(rootNode)
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

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)
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

class MaxHeap extends Heap {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

    d.raw = d.arr.clone()
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.canvas.width = (Math.pow(2, d.level - 1) * itemWidth + d.conf.sceneSpace * 2) * devicePixelRatio
    d.canvas.style.width = d.canvas.width / devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * levelHeight + itemHeight + d.conf.sceneSpace * 2 + d.sceneTopSpace) * devicePixelRatio
  }
  heapify() {
    const me = this
    const d = me.d
    
    for (let i = d.branchIndex; i > -1; i--) {
      me.shiftDown(i)
    }
  }
  createByShiftUp(k) {
    const me = this
    const d = me.d
    const {arr} = d

    for (let i = 1; i < arr.length; i++) {
      me.shiftUp(i)
    }
  }
  shiftUp(k) {
    const me = this
    const d = me.d
    const {arr} = d

    while (k > 0) {
      let j = parseInt(k / 2)

      if (arr[j].n > arr[k].n) break

      arr.swap(j, k)
      k = j
    }
  }
  shiftDown(k) {
    const me = this
    const d = me.d
    const {arr} = d

    while (k * 2 + 1 < arr.length) {
      let j = k * 2 + 1

      if (j + 1 < arr.length && arr[j + 1].n > arr[j].n) j++

      if (arr[k].n > arr[j].n) break

      arr.swap(j, k)
      k = j
    }
  }
}

class SegmentTree extends Heap {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 45

    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

    d.len = 11
    d.level = Math.ceil(Math.log(d.len) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map((_, idx) => {
      return new Node(null)
    })
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.canvas.width = (Math.pow(2, d.level - 1) * itemWidth + d.conf.sceneSpace * 2) * devicePixelRatio
    d.canvas.style.width = d.canvas.width / devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * levelHeight + itemHeight + d.conf.sceneSpace * 2 + d.sceneTopSpace) * devicePixelRatio
  }
  createL() {
    const me = this
    const d = me.d

    function create(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      create(treeIndex * 2 + 1, l, mid)
      create(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].fillStyle = d.color.blue
    }
    create(0, 0, d.len - 1)
  }
  createR() {
    const me = this
    const d = me.d

    function create(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      create(treeIndex * 2 + 1, l, mid - 1)
      create(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].fillStyle = d.color.blue
    }
    create(0, 0, d.len - 1)
  }
}

class Algo {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.conf = {
      sceneSpace: 20,
      itemWidth: 30,
      itemHeight: 20,
      levelHeight: 40,
      fontSm: '12px Arial',
      font: '14px Arial',
    }

    d.color = {
      red: '#d00',
      green: 'green',
      blue: '#09f',
      orange: 'orange',
      purple: 'purple',
      white: 'white',
      black: '#333',
      def: '#333',
    }

    d.cons = {
      list: []
    }

    d.type = {
      list: [
        {name: '红黑树（左倾 & 右倾）', cons: RBTree, opt: {startFn: 'create'}},
        {name: 'AVLTree', cons: AVLTree, opt: {startFn: 'create'}},
        {name: '二分搜索树 - 镜像反转', cons: BinarySearchFlip, opt: {startFn: 'create'}},
        {name: '二分搜索树', cons: BinarySearch, opt: {startFn: 'create'}},
        {name: '线段树 R', cons: SegmentTree, opt: {startFn: 'createR'}},
        {name: '线段树 L', cons: SegmentTree, opt: {startFn: 'createL'}},
        {name: '最大堆 - shiftUp', cons: MaxHeap, opt: {startFn: 'createByShiftUp'}},
        {name: '最大堆 - heapify', cons: MaxHeap, opt: {startFn: 'heapify'}},
        {name: '快速排序3', cons: QuickSort3, opt: {startFn: 'startSort'}},
        {name: '快速排序2', cons: QuickSort2, opt: {startFn: 'startSort'}},
        {name: '快速排序', cons: QuickSort, opt: {startFn: 'startSort'}},
        {name: '归并排序', cons: MergeSort, opt: {startFn: 'startSort'}},
      ]
    }

    location.origin.indexOf('codding.cn') > -1 && d.type.list.reverse()

    const nodeStyle = document.querySelector('#box-algo > .list')

    nodeStyle.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1)

    randArr = new Array(len).fill().map((_, idx) => len - idx)
    randArr = [5, 11, 14, 16, 4, 9, 12, 17, 18, 4, 10, 15, 11, 14, 2, 12, 15, 18, 15, 4]
    // randArr[len - 1] = 2.5

    randArr = randArr.map((n) => {
      return new Node(n)
    })

    ;[].slice.call(nodeStyle.querySelectorAll('canvas')).forEach((canvas, idx, arr) => {
      const type = d.type.list[idx]
      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        algo: this,
        ...d,
      })

      d.cons.list.push(o)
      o[type.opt.startFn]()
      o.setPos()
      o.render()
    })
  }
}



export default Algo

class Node {
  constructor(n) {
    const d = {
      n,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      fillStyle: Node.color.black,
      strokeStyle: Node.color.black,
      ...arguments[1],
    }

    for (let key in d) {
      this[key] = d[key]
    }
  }
}

Node.color = {
  red: '#f23',
  green: 'green',
  blue: '#09f',
  orange: '#f80',
  purple: 'purple',
  yellow: '#ff0',
  white: 'white',
  black: '#333',
}

class Common {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.arr.forEach((node, idx, arr) => {
      node.x = idx * d.conf.itemWidth
      node.y = 0
    })
    d.canvas.width = (d.arr.length * d.conf.itemWidth + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
  }
  getItemWidth() {
    const me = this
    return me.d.itemWidth || me.d.conf.itemWidth
  }
  getItemHeight() {
    const me = this
    return me.d.itemHeight || me.d.conf.itemHeight
  }
  getLevelHeight() {
    const me = this
    return me.d.levelHeight || me.d.conf.levelHeight
  }
  renderArr() {
    const me = this
    const d = me.d
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

    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

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
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

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
        me.renderNode(node)
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
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()

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
      me.renderNode(node)
    })
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
  setPos() {
    const me = this
    const d = me.d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()
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
      if (!rootNode) return
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
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()

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

class MergeSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    function mergeSort(l, r) {
      if (l >= r) return

      const mid = l + parseInt((r - l) / 2)
      mergeSort(l, mid)
      mergeSort(mid + 1, r)

      const aux = new Array(r - l + 1).fill()

      for (let i = l; i <= r; i++) {
        aux[i - l] = d.arr[i]
        d.arr[i].fromIndex = i
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

      const fillStyle = Node.color[l === 0 && r === d.arr.length - 1 ? 'blue' : 'orange']

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
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let j = l

      for (let i = l + 1; i <= r; i++) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = Node.color.red
          d.arr.swap(i, j + 1)
          j++
        } else {
          d.arr[i].fillStyle = Node.color.orange
        }
      }

      d.arr[l].fillStyle = Node.color.blue
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
    
    d.steps.push(d.arr.clone().map((node, idx) => {
      node.fillStyle = Node.color.blue
      node.fromIndex = idx
      return node
    }))
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
          d.arr[i].fillStyle = Node.color.red
          i++
        }
        while (j > l && d.arr[j].n > v) {
          d.arr[j].fillStyle = Node.color.orange
          j--
        }
        if (i > j) break
        d.arr.swap(i, j)
        d.arr[i].fillStyle = Node.color.red
        d.arr[j].fillStyle = Node.color.orange
        i++
        j--
      }

      d.arr[l].fillStyle = Node.color.blue
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
    
    d.steps.push(d.arr.clone().map((node, idx) => {
      node.fillStyle = Node.color.blue
      node.fromIndex = idx
      return node
    }))
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
          d.arr[i].fillStyle = Node.color.red
          d.arr.swap(i, lt + 1)
          lt++
          i++
        } else if (d.arr[i].n > v) {
          d.arr[i].fillStyle = Node.color.orange
          d.arr.swap(i, gt - 1)
          gt--
        } else {
          d.arr[i].fillStyle = Node.color.purple
          i++
        }
      }

      d.arr[l].fillStyle = Node.color.blue
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
    
    d.steps.push(d.arr.clone().map((node, idx) => {
      node.fillStyle = Node.color.blue
      node.fromIndex = idx
      return node
    }))
  }
}

class MaxHeap extends Heap {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.canvas.width = (Math.pow(2, d.level - 1) * d.conf.itemWidth + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
    d.branchIndex = parseInt((d.arr.length - 2) / 2)

    d.arr.forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
    })
  }
  heapify() {
    const me = this
    const d = me.d
    
    for (let i = d.branchIndex; i > -1; i--) {
      me.shiftDown(i)
    }
  }
  createByShiftUp(l) {
    const me = this
    const d = me.d

    for (let i = 1; i < d.arr.length; i++) {
      me.shiftUp(i)
    }
  }
  shiftUp(k) {
    const me = this
    const d = me.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[k].n <= d.arr[j].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
  shiftDown(k) {
    const me = this
    const d = me.d

    while (k * 2 + 1 < d.arr.length) {
      let j = k * 2 + 1

      if (j + 1 < d.arr.length && d.arr[j + 1].n > d.arr[j].n) j++

      if (d.arr[k].n >= d.arr[j].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
}

class SegmentTree extends Heap {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.len = 10
    d.level = Math.ceil(Math.log(d.len) / Math.log(2)) + 1
    d.itemWidth = 40
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.canvas.width = (Math.pow(2, d.level - 1) * me.getItemWidth() + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
  }
  createL() {
    const me = this
    const d = me.d

    function createL(treeIndex, l, r) {
      if (l > r) return

      if (l === r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = Node.color.blue
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      createL(treeIndex * 2 + 1, l, mid)
      createL(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].fillStyle = Node.color.blue
    }

    createL(0, 0, d.len)
  }
  createR() {
    const me = this
    const d = me.d

    function createR(treeIndex, l, r) {
      if (l > r) return

      if (l === r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = Node.color.blue
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      createR(treeIndex * 2 + 1, l, mid - 1)
      createR(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].fillStyle = Node.color.blue
    }

    createR(0, 0, d.len)
  }
}

class BinarySearch extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
      d.root = me.add(d.root, node)
    })

    d.root2 = clone(d.root)
    me.flip(d.root2)
  }
  add(node, item) {
    const me = this
    
    if (!node) return item

    if (item.n < node.n) {
      node.l = me.add(node.l, item)
    } else if (item.n > node.n) {
      node.r = me.add(node.r, item)
    } else {
      // ===
    }

    return node
  }
  flip(node) {
    const me = this
    
    if (!node) return

    me.flip(node.l)
    me.flip(node.r)

    const t = node.l
    node.l = node.r
    node.r = t
  }
}

class AVLTree extends Tree {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.levelHeight = 60
    d.paddingTop = 60
    d.itemWidth = 50
  }
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
      node.h = 1
      node.balanceFactor = 0
      d.root = me.add(d.root, node)
    })
  }
  add(node, item) {
    const me = this
    const d = me.d

    if (!node) return item

    if (item.n < node.n) {
      node.l = me.add(node.l, item)
    } else if (item.n > node.n) {
      node.r = me.add(node.r, item)
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
  getHeight(node) {
    return node ? node.h : 0
  }
  getBalanceFactor(node) {
    const me = this
    return me.getHeight(node.l) - me.getHeight(node.r)
  }
  leftRotate(x) {
    const me = this
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(me.getHeight(x.l), me.getHeight(x.r)) + 1
    y.h = Math.max(me.getHeight(y.l), me.getHeight(y.r)) + 1

    x.balanceFactor = me.getBalanceFactor(x)

    return y
  }
  rightRotate(x) {
    const me = this
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(me.getHeight(x.l), me.getHeight(x.r)) + 1
    y.h = Math.max(me.getHeight(y.l), me.getHeight(y.r)) + 1

    x.balanceFactor = me.getBalanceFactor(x)

    return y
  }
}

class RBTree extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.red
      d.root = me.addL(d.root, node)
      d.root.fillStyle = Node.color.black
    })

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.red
      d.root2 = me.addR(d.root2, node)
      d.root2.fillStyle = Node.color.black
    })
  }
  addL(node, item) {
    const me = this
    const d = me.d

    if (!node) return item

    if (item.n < node.n) {
      node.l = me.addL(node.l, item)
    } else if (item.n > node.n) {
      node.r = me.addL(node.r, item)
    } else {
      // ===
    }

    if (!me.isRed(node.l) && me.isRed(node.r)) {
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
  addR(node, item) {
    const me = this
    const d = me.d
    
    if (!node) return item

    if (item.n < node.n) {
      node.l = me.addR(node.l, item)
    } else if (item.n > node.n) {
      node.r = me.addR(node.r, item)
    } else {
      // ===
    }

    if (me.isRed(node.l) && !me.isRed(node.r)) {
      node = me.rightRotate(node)
    }

    if (me.isRed(node.r) && me.isRed(node.r.r)) {
      node = me.leftRotate(node)
    }

    if (me.isRed(node.l) && me.isRed(node.r)) {
      me.flipColors(node)
    }

    return node
  }
  isRed(node) {
    return node ? node.fillStyle === Node.color.red : false
  }
  leftRotate(x) {
    const y = x.r

    x.r = y.l
    y.l = x

    y.fillStyle = x.fillStyle
    x.fillStyle = Node.color.red

    return y
  }
  rightRotate(x) {
    const y = x.l

    x.l = y.r
    y.r = x

    y.fillStyle = x.fillStyle
    x.fillStyle = Node.color.red

    return y
  }
  flipColors(node) {
    node.fillStyle = Node.color.red
    node.l.fillStyle = Node.color.black
    node.r.fillStyle = Node.color.black
  }
}

class Trie extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    // d.str = 'cat dog deer panda pan'
    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    // d.str = `Create your own custom views that conform to the View protocol, and compose them with SwiftUI views for displaying text, images, and custom shapes using stacks, lists, and more. Apply powerful modifiers to built-in views and your own views to customize their rendering and interactivity. Share code between apps on multiple platforms with views and controls that adapt to their context and presentation.`
    d.arr = d.str.toLowerCase().match(/\w+/g) || []
    d.root = {
      x: 0,
      y: 0,
      isWord: false,
      map: {}
    }
  }
  create() {
    const me = this
    const d = me.d

    d.arr.forEach((str, idx, arr) => {
      let curNode = d.root

      for (let i = 0, len = str.length; i < len; i++) {
        const k = str[i]

        if (!curNode.map[k]) {
          curNode.map[k] = {
            x: 0,
            y: 0,
            isWord: false,
            map: {}
          }
        }

        curNode = curNode.map[k]
      }

      curNode.isWord = true
    })
  }
  setPos() {
    const me = this
    const d = me.d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

    {
      d.textArr = []
      const arr = d.str.split(/\s+/g) || []
      let textLevel = 3
      let textLen = Math.ceil(arr.length / textLevel)

      for (let i = 0; i < textLevel; i++) {
        d.textArr.push(arr.slice(i * textLen, (i + 1) * textLen))
      }
    }

    d.level = -1
    d.iLeft = 0
    d.iHeight = 0

    function setPos(node) {
      if (!node) return

      const keys = Object.keys(node.map)
      // .sort((a, b) => a.localeCompare(b))

      d.level++
      keys.forEach((key, idx, arr) => {
        setPos(node.map[key], key)
      })

      node.x = keys.length > 0 ? (node.map[keys.first()].x + node.map[keys.last()].x) / 2 : d.iLeft
      node.y = d.level * levelHeight + d.textArr.length * 18 + 20
      d.iHeight = Math.max(d.iHeight, node.y)

      keys.length === 0 && (d.iLeft += itemWidth * 1)
      d.level--
    }

    setPos(d.root, 'root')

    d.canvas.width = (d.iLeft + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = (d.iHeight + itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()

    d.level = 0
    d.iLeft = 0

    function renderLine(node) {
      if (!node) return

      const keys = Object.keys(node.map)

      keys.forEach((key, idx, arr) => {
        const to = node.map[key]
        renderLine(to, key)

        gd.beginPath()
        gd.lineTo(node.x + itemWidth / 2 + .5, node.y + itemHeight / 2)
        gd.lineTo(to.x + itemWidth / 2 + .5, to.y + itemHeight / 2)
        gd.strokeStyle = Node.color.black
        gd.stroke()
      })
    }

    function renderNode(node, nodeName) {
      if (!node) return

      const keys = Object.keys(node.map)

      keys.forEach((key, idx, arr) => {
        renderNode(node.map[key], key)
      })

      gd.save()
      gd.globalAlpha = .75
      gd.beginPath()
      gd.rect(node.x + 1, node.y, itemWidth - 2, itemHeight)
      gd.fillStyle = Node.color[node.isWord ? 'blue' : 'black']
      gd.fill()
      gd.restore()

      gd.fillStyle = Node.color.white
      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.font = d.conf.font
      gd.fillText(nodeName, node.x + itemWidth / 2, node.y + itemHeight / 2)
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    
    {
      gd.fillStyle = Node.color.black
      gd.font = d.conf.fontLg
      gd.textAlign = 'left'
      gd.textBaseline = 'top'
      
      let translateX = ((canvas.offsetWidth - d.conf.paddingH * 2) - gd.measureText(d.textArr[0]).width) / 2

      d.textArr.forEach((arr, idx) => {
        const str = arr.join(' ')
        gd.fillText(str, translateX, idx * 18)
      })
    }

    renderLine(d.root, 'root')
    renderNode(d.root, 'root')
    gd.restore()
  }
}

const mazeData = `#####################################################################################################
                                    #     #     #   #     # # #               # # # # #   #   #   # #
# # # ### # ############# ### # ##### ##### ##### ### ##### # # ####### ####### # # # # ### ### ### #
# # #   # #       #   # #   # # #       # #   # #         #           # # #               # # # # # #
### # # ### ####### ### ######### ####### # ### # ######### ### ######### # ############### # # # # #
#   # # #           # #   #   # #                   # #   # # # # # # # #     # # #     #           #
### ####### # # # ### # ### ### # ### ##### ######### # ### # ### # # # # ##### # # ##### ###########
#         # # # #       #   # #     #     #         # #         # #   #       # # # # # #     # #   #
# # # ####### ### ### ### ### # ##### ############### # ##### ### # ### ####### # # # # # ##### # ###
# # #   # #   #     #   #   #       #   #   # # # # #     # #             # # # # #   # #     #   # #
### # ### ### ### ### ### ### ########### ### # # # # ##### ### ### # # ### # # # # ### # ####### # #
#   # # #       # #       #                             # #   # # # # #               # #     #   # #
# # ### ### # ### ### # ### ##### # # ####### # # # ##### # ##### ######### # # # # ### # ####### # #
# #       # #   # #   #         # # #       # # # # # # #                 # # # # #         # # #   #
# # # ### # # ####### # # # ##### ### # # ####### ### # # ### ### ##### # ######### # # # ### # # ###
# # #   # # #   #     # # #     #   # # #     # #           #   #     # #     #     # # #           #
# ### ####### ##### # # # # ######### ### # ### ####### # ######### ##### ####### # # # # ### # # # #
# #       #       # # # # #       #     # #           # #         #     #   #     # # # #   # # # # #
# # # # # # # # # ### ##### # ####### ##### # ### # ##### # ####### ########### # ##### # ######### #
# # # # # # # # #   #     # #     # #     # #   # #   # # #     #           #   #     # #       #   #
# # ### # # ### # ### # ### # # ### ######### # # # ### ######### # ############# # # ### ######### #
# #   # # # #   # #   #   # # #             # # # #             # # # # # #   # # # #   #         # #
# # # # # ##### # # # ##### # ### # # ### # # ##### # ### # ######### # # ### # ##### # # # # # ### #
# # # # # #     # # #     # #   # # #   # # #     # #   # #       # # # #   #       # # # # # # # # #
# # # # ##### # # # # # ### # # # ### ####### # ### # ### # # # ### # # # ### ####### # ### ##### ###
# # # # #     # # # # #   # # # #   #       # #   # # # # # # #                     # #   # # # # # #
# ##### ### # # ##### # ### ### # ########### ######### ### ####### # # # # ##### ##### ##### # # # #
#   # # #   # #     # #   # # # #       # # #             # # #   # # # # #     #     #   #         #
# ### ##### ### ##### # ##### ### # # ### # ####### # # ##### # ##### # ### # ### ##### ### ### # # #
# #         #       # #         # # #             # # #     #       # #   # #   # #   #       # # # #
### ####### ### # ################### ### ####### ####### ### ### # # # # # # ##### ##### # #########
#   #         # #                   #   #       #       #       # # # # # # #           # #   #     #
# # ####### ##### # # ### # # # # ### ### ### ##### # ##### # ############### # ### # ### # ### #####
# #   #         # # #   # # # # # #     #   #     # #     # #   # # # #   # # #   # # #   #         #
# # ####### ######### ##### # ### # # ### # # # ##### # ### # ### # # # ### ### # ##### # # # # # # #
# # # #         #         # #   # # #   # # # #     # #   # #                 # #     # # # # # # # #
##### ##### # ##### # # # # # # ##### ##### ### ##### # ##### # # # # ################# ### ####### #
#           #   #   # # # # # #     #     #   #     # #     # # # # #           #     #   #       # #
### ### # # # ### # ####### ##### ### # ##### # # ##### # # # # # ### ##### ##### ##### ### # ### ###
# # #   # # #   # #       #     # #   #     # # #   #   # # # # # #       #           #   # #   #   #
# ##### ##### ### # # ##### # ##### # # # ##### # ##### # # ######### # ##### # ####### ### # ##### #
#         #     # # #     # #     # # # #     # #     # # #     #     #     # #       #   # #     # #
# ### # ##### ####### ####### ################# # ####### # ######### # # ##### # ############# #####
# #   # #       #           # # # #         # # #       # #     #     # #     # #       #     # # # #
# ### ### # # # # # # ##### ### # # ### # ### ### # # ##### ##### ### ### ############### ####### # #
# #     # # # # # # #     #           # #       # # #   # #   # # #     #         #     #     # #   #
# ### ####### ### # ####### ### # ####### # ######### ### ##### ##### ############# ##### ##### # ###
# #   # # #     # #       #   # #     # # #         #             #             #           # #     #
# ##### # ### ##### ### ### ##### # ### ### ##### # # # # # # # ##### # # # # ### ########### # #####
# #               #   # #       # #   # # #     # # # # # # # #     # # # # #         #             #
# ##### # # # # # # ####### # ##### ### # ##################### # # ########### # ##### ### ### # ###
# # #   # # # # # #     #   #   #               # # # # # #   # # #           # #     #   #   # #   #
### ### ### ### # # # ### # # # ### # # # ####### # # # # # ########### # # # ### # ### ### ##### # #
#       #     # # # #   # # # # #   # # #         #   # #       #     # # # #   # #       #   #   # #
####### ### # ### ####### ##### # # # ### # # ##### ### # ####### ####### # # ### # # # ########### #
#         # # #     #   #     # # # # #   # #         #     # #     #   # # #   # # # #     #   # # #
####### ### # ### ### ### # ####### # # # # # # ### ### ##### # ##### ####### ### # # # ####### # ###
#   #     # # #         # # #   #   # # # # # #   # #               # # #   #   # # # #   # # #     #
### ### ######### # # ####### ##### # # # ##### ##### ### # # # ##### # # ### ######### ### # # #####
#             #   # #     # #   #   # # # #             # # # #   #         #   # # # #       #     #
##### # # # # ### # # ##### # ##### ##### ### # ### # ####### ##### ### # ####### # # ### ##### #####
#     # # # #   # # #     # # #   # #       # #   # #       #         # #     #   #     # # # #     #
##### ####### # ### # ##### # # ####### # # ### ### # ### ### ### # ####### ##### # ####### # # ### #
#         #   #   # #                 # # # #     # #   #   #   # # # # # #   # # #   # # #       # #
# # # # ##### ####### ### # # # ### ### # # # # # ################### # # ##### # # ### # # #########
# # # #     #     #     # # # #   #   # # # # # #     # #           # # # # # # #             # #   #
# ##### ##### ##### # ##### ### ########### # # # # ### # ### # ##### # # # # # # ####### ##### # ###
# #         #     # #     #   #     #     # # # # #         # #           #             #           #
# ##### # ########### # # # # # ##### ### # ### # # # # ######### # # # ### ### # ### ### ### # #####
# # #   #           # # # # # #         # # #   # # # #         # # # #       # #   # #     # #     #
### ### # ### # ############# # # # ########### # ### # # ### ##### # # # # ##### ### ### ##### #####
#       #   # #             # # # #   # #     # # #   # #   #     # # # # #     #   # # # # # #   # #
### # # # # ### # # # ##### ### ### ### # ##### ##### # # # ############### # ######### ### # ##### #
#   # # # #   # # # #     #   #   #           # #     # # #           #     # # # # # #             #
# # ### ########### # # ########### # # # # # ##### # # ### ##### ####### # ### # # # ### ### ##### #
# # #         # # # # #           # # # # # #   #   # #   #     #     #   #           # #   # #   # #
# # ### ### ### # ##### # # # ##### # ### ### ### # # # ##### # # # ##### # ### # ##### # ##### #####
# # #     # #       #   # # #     # #   #   # #   # # #     # # # #     # #   # #                 # #
# ##### ##### ### ##### ##### ##### ##### # # ### ### # # ####### # ##### # # ##### ### # # # ##### #
# #             #     #   #       #     # # # #     # # #     #   #     # # #     #   # # # #       #
# # # # # # # ### # ##### # # # ### ####### # # # # # ### ####### # ######### # # # ### ##### # # # #
# # # # # # #   # #     # # # #   #       # # # # # # #       #   #     # #   # # #   #     # # # # #
##### # # # ####### # ######### ### ####### # # ######### # # ### ####### ### # ######### ###########
#     # # #       # # # # # #     #     # # # #       #   # # #             # #         #     # #   #
# # ### ### # ##### ### # # ### ######### ##### # # ##### ####### # ### # ##### # ### ### # ### # ###
# # #   #   #     #         #       #         # # #   #       #   #   # #   #   #   #   # #         #
# ######### # ##### # # # ##### # ### ####### # # # ##### # ####### ##### ### # # ### ### # # # # ###
# #         #     # # # #     # #   #       # # # #   #   # #           #   # # # # #   # # # # #   #
### # ### # # ####### # # # ######### ############# ##### # ####### ##### # ### ### ######### # # # #
#   # #   # #     # # # # #                   # #       # #   #         # # #             #   # # # #
### ######### ##### ### ### # # ### # ######### ### # # ### # ### # # ### # ### # # ######### #######
#   #                 # #   # #   # #       #     # # #   # # #   # #   # # #   # #         #       #
############# ### # # # ### # # # ### ### ##### ################### ##### # ### ### ### # ### # # # #
#               # # # #   # # # #   #   #   # #   #   # # # #           # # #     #   # #   # # # # #
### # ##### # # # ##### ### # # # # # ####### # ### ### # # ### # # # ##### # # ### # # # # ### # # #
#   # #     # # # # # # #   # # # # #                         # # # #     # # #   # # # # #   # # # #
### ##### # # ##### # ##### # ### # # # # # # # ### # # # # ##### # # # ####### # ##### ### # ##### #
#   #     # #             # #   # # # # # # # #   # # # # #     # # # #     #   #     # #   #     # #
### # # # ### ####### ### # # ##### ##### # ### ####### # # # # ### # # # ##### # # ### ### # # # # #
#   # # # #         #   # # #     #     # # #         # # # # #   # # # #   #   # #   # #   # # # #  
#####################################################################################################`

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


class Algo {
  constructor(d = {}) {
    const me = this
    me.d = d

    d.devicePixelRatio = devicePixelRatio
    // d.devicePixelRatio = devicePixelRatio === 1 ? 2 : devicePixelRatio
    d.type = {
      list: [
        {name: '迷宫问题', cons: SolveMaze, opt: {startFn: 'create'}},
        {name: 'Trie', cons: Trie, opt: {startFn: 'create'}},
        {name: '红黑树 (左倾 & 右倾)', cons: RBTree, opt: {startFn: 'create'}},
        {name: 'AVL树', cons: AVLTree, opt: {startFn: 'create'}},
        {name: '二分搜索树 - 镜像反转', cons: BinarySearch, opt: {startFn: 'create'}},
        {name: '线段树 R', cons: SegmentTree, opt: {startFn: 'createR'}},
        {name: '线段树 L', cons: SegmentTree, opt: {startFn: 'createL'}},
        {name: '最大堆 - shiftUp', cons: MaxHeap, opt: {startFn: 'createByShiftUp'}},
        {name: '最大堆 - heapify', cons: MaxHeap, opt: {startFn: 'heapify'}},
        {name: '三路排序', cons: QuickSort3, opt: {startFn: 'startSort'}},
        {name: '双路排序', cons: QuickSort2, opt: {startFn: 'startSort'}},
        {name: '快速排序', cons: QuickSort, opt: {startFn: 'startSort'}},
        {name: '归并排序', cons: MergeSort, opt: {startFn: 'startSort'}},
      ]
    }

    // if (location.origin.indexOf('codding.cn') > -1) d.type.list.reverse()

    d.cons = {
      list: []
    }

    d.conf = {
      itemWidth: 30,
      itemHeight: 18,
      levelHeight: 40,
      paddingH: 15,
      paddingV: 15,
      fontLg: '16px Arial',
      font: '14px Arial',
      fontSm: '12px Arial',
    }

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="box-btn">
            <button title="${v.name}" class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1)
    // randArr = new Array(len).fill().map((_, idx) => idx)

    randArr = randArr.map(n => new Node(n))

    nodeList.querySelectorAll('canvas').forEach((canvas, idx, arr) => {
      const type = d.type.list[idx]
      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        btn: canvas.closest('section').querySelector('button'),
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
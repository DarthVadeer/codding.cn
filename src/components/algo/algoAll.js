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

class MergeSort extends Sort {
  startSort() {
    const d = this.d

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
    const d = this.d

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
    const d = this.d

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
    const d = this.d

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

    const d = this.d

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
    const d = this.d
    
    for (let i = d.branchIndex; i > -1; i--) {
      this.shiftDown(i)
    }
  }
  createByShiftUp(l) {
    const d = this.d

    for (let i = 1; i < d.arr.length; i++) {
      this.shiftUp(i)
    }
  }
  shiftUp(k) {
    const d = this.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[k].n <= d.arr[j].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
  shiftDown(k) {
    const d = this.d

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

    const d = this.d

    d.len = 6
    d.level = Math.ceil(Math.log(d.len) / Math.log(2)) + 1
    d.itemWidth = 40
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.canvas.width = (Math.pow(2, d.level - 1) * this.getItemWidth() + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
  }
  createL() {
    const d = this.d

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
    const d = this.d

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
    const d = this.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
      d.root = this.add(d.root, node)
    })

    d.root2 = clone(d.root)
    this.flip(d.root2)
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
  flip(node) {
    if (!node) return

    this.flip(node.l)
    this.flip(node.r)

    const t = node.l
    node.l = node.r
    node.r = t
  }
}

class AVLTree extends Tree {
  constructor() {
    super(...arguments)

    const d = this.d

    d.levelHeight = 60
    d.paddingTop = 60
    d.itemWidth = 44
  }
  create() {
    const d = this.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
      node.h = 1
      node.balanceFactor = 0
      d.root = this.add(d.root, node)
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

    const balanceFactor = this.getBalanceFactor(node)

    if (Math.abs(balanceFactor) > 1) {
      if (balanceFactor > 0) {
        // 左边高
        if (this.getBalanceFactor(node.l) < 0) {
          node.l = this.leftRotate(node.l)
        }
        node = this.rightRotate(node)
      } else {
        // 右边高
        if (this.getBalanceFactor(node.r) > 0) {
          node.r = this.rightRotate(node.r)
        }
        node = this.leftRotate(node)
      }
    }

    node.h = Math.max(this.getHeight(node.l), this.getHeight(node.r)) + 1
    node.balanceFactor = this.getBalanceFactor(node)

    return node
  }
  getHeight(node) {
    return node ? node.h : 0
  }
  getBalanceFactor(node) {
    return this.getHeight(node.l) - this.getHeight(node.r)
  }
  leftRotate(x) {
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)

    return y
  }
  rightRotate(x) {
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)

    return y
  }
}

class RBTree extends Tree {
  create() {
    const d = this.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.red
      d.root = this.addL(d.root, node)
      d.root.fillStyle = Node.color.black
    })

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.red
      d.root2 = this.addR(d.root2, node)
      d.root2.fillStyle = Node.color.black
    })
  }
  addL(node, item) {
    if (!node) return item

    if (item.n < node.n) {
      node.l = this.addL(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.addL(node.r, item)
    } else {
      // ===
    }

    if (!this.isRed(node.l) && this.isRed(node.r)) {
      node = this.leftRotate(node)
    }

    if (this.isRed(node.l) && this.isRed(node.l.l)) {
      node = this.rightRotate(node)
    }

    if (this.isRed(node.l) && this.isRed(node.r)) {
      this.flipColors(node)
    }

    return node
  }
  addR(node, item) {
    if (!node) return item

    if (item.n < node.n) {
      node.l = this.addR(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.addR(node.r, item)
    } else {
      // ===
    }

    if (this.isRed(node.l) && !this.isRed(node.r)) {
      node = this.rightRotate(node)
    }

    if (this.isRed(node.r) && this.isRed(node.r.r)) {
      node = this.leftRotate(node)
    }

    if (this.isRed(node.l) && this.isRed(node.r)) {
      this.flipColors(node)
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

    const d = this.d

    // d.str = 'cat dog deer panda pan'
    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework provides event handlers for delivering taps, gestures, and other types of input to your app, and tools to manage the flow of data from your app's models down to the views and controls that users will see and interact with.`
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
    const d = this.d

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


class Algo {
  constructor(d = {}) {
    this.d = d

    d.devicePixelRatio = devicePixelRatio
    // d.devicePixelRatio = devicePixelRatio === 1 ? 2 : devicePixelRatio
    d.type = {
      list: [
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
    // randArr = new Array(len).fill().map((_, idx) => idx)

    randArr = randArr.map(n => new Node(n))

    nodeList.querySelectorAll('canvas').forEach((canvas, idx, arr) => {
      const type = d.type.list[idx]
      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
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

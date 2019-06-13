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
  purple: 'purple',
  yellow: '#ff0',
  white: 'white',
  black: '#333',
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
      node.strokeStyle = randColor()
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

class SelectionSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    for (let i = 0; i < d.arr.length; i++) {
      let minIndex = i

      d.arr[i].fromIndex = i

      for (let j = i + 1; j < d.arr.length; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = Node.color.green
        if (d.arr[j].n < d.arr[minIndex].n) {
          minIndex = j
        }
      }

      d.arr.swap(i, minIndex)
      d.arr[minIndex].fillStyle = Node.color.orange
      d.arr[i].fillStyle = Node.color.blue
      d.steps.push(
        new Array(i).fill().concat(
          d.arr.slice(i, d.arr.length).clone()
        )
      )
    }

    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = Node.color.blue
        return node
      })
    )
  }
}

class InsertionSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    for (let i = 1; i < d.arr.length; i++) {
      let j = i
      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = Node.color.orange

      for (; j > 0; j--) {
        d.arr[j - 1].fromIndex = j - 1
        d.arr[j - 1].fillStyle = Node.color.green

        if (d.arr[j].n >= d.arr[j - 1].n) break

        d.arr.swap(j, j - 1)
      }

      d.steps.push(
        new Array(j).fill().concat(
          d.arr.slice(j, i + 1).clone()
        )
      )
    }

    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = Node.color.blue
        return node
      })
    )
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
        aux[i - l].fromIndex = i
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

      const fillStyle = Node.color[l === 0 && r === d.arr.length - 1 ? 'blue' : 'green']

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
          d.arr[i].fillStyle = Node.color.green
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

    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = Node.color.blue
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
          d.arr[i].fillStyle = Node.color.green
          i++
        }
        while (j > l && d.arr[j].n > v) {
          d.arr[j].fillStyle = Node.color.orange
          j--
        }
        if (i > j) break
        d.arr.swap(i, j)
        d.arr[i].fillStyle = Node.color.green
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

    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = Node.color.blue
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
          d.arr[i].fillStyle = Node.color.green
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

    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = Node.color.blue
        return node
      })
    )
  }
}

class MaxHeap extends Heap {
  heapify() {
    const me = this
    const d = me.d

    for (let i = d.branchIndex; i > -1; i--) {
      me.shiftDown(i)
    }
  }
  createByShiftUp() {
    const me = this
    const d = me.d

    for (let i = 1; i < d.arr.length; i++) {
      me.shiftUp(i)
    }
  }
  shiftUp(k) {
    const me = this
    const d = me.d

    while (parseInt(k - 1) / 2 > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[j].n > d.arr[k].n) break

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

      if (d.arr[k].n > d.arr[j].n) break

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

    d.itemWidth = 38
    d.len = 10
    d.level = Math.ceil(Math.log(d.len + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.canvas.width = (Math.pow(2, d.level - 1) * d.itemWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio
  }
  createL() {
    const me = this
    const d = me.d

    function createL(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = Node.color.blue
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      createL(treeIndex * 2 + 1, l, mid)
      createL(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + ', ' + r + ']'
      d.arr[treeIndex].fillStyle = Node.color.blue
    }

    createL(0, 0, d.len)
  }
  createR() {
    const me = this
    const d = me.d

    function createR(treeIndex, l, r) {
      if (l >= r) {
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

    d.root2 = me.flip(clone(d.root))
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
}

class AVLTree extends Tree {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.paddingTop = 60
    d.itemWidth = 46
    d.levelHeight = 60
  }
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.h = 1
      node.balanceFactor = 0
      node.fillStyle = Node.color.blue
      d.root = me.add(d.root, node)
    })
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
    return this.getHeight(node.l) - this.getHeight(node.r)
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
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d
  }
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
    const me = this
    const y = x.r

    x.r = y.l
    y.l = x

    y.fillStyle = x.fillStyle
    x.fillStyle = Node.color.red

    return y
  }
  rightRotate(x) {
    const me = this
    const y = x.l

    x.l = y.r
    y.r = x

    y.fillStyle = x.fillStyle
    x.fillStyle = Node.color.red

    return y
  }
  flipColors(node) {
    node.fillStyle = Node.color.red
    node.l.fillStyle = node.r.fillStyle = Node.color.black
  }
}

class Trie extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    d.arr = d.str.toLowerCase().match(/\w+/g) || []
    d.strArr = []
    d.root = new Node('root', {map: {}})
  }
  create() {
    const me = this
    const d = me.d
    const arrStr = d.str.split(/\s+/)
    const step = Math.ceil(arrStr.length / 3)
    
    for (let i = 0; i < arrStr.length; i += step) {
      d.strArr.push(
        arrStr.slice(i, i + step).join(' ')
      )
    }

    d.arr.forEach((str, idx, arr) => {
      me.add(str)
    })
  }
  add(str) {
    const me = this
    const d = me.d
    let node = d.root

    for (let i = 0; i < str.length; i++) {
      const c = str[i]

      node.map[c] = node.map[c] || new Node(c, {map: {}})
      node = node.map[c]
    }

    node.isWord = true
    node.fillStyle = Node.color.blue
  }
  setPos() {
    const me = this
    const d = me.d

    d.level = -1
    d.iLeft = 0
    d.iHeight = 0

    function setPos(node) {
      const keys = Object.keys(node.map)

      d.level++
      keys.forEach((key, idx, arr) => {
        setPos(node.map[key])
      })
      node.x = d.iLeft
      node.y = d.level * d.conf.levelHeight + d.strArr.length * 20 + d.conf.paddingV
      d.iHeight = Math.max(d.iHeight, node.y)
      d.level--

      if (keys.length === 0) {
        d.iLeft += d.conf.itemWidth
      } else {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      }
    }

    setPos(d.root)
    d.canvas.width = (d.iLeft + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = (d.iHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio
  }
  render() {
    const me = this
    const d = me.d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const {canvas, gd} = d

    function renderLine(node) {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx, arr) => {
        const _node = node.map[key]
        renderLine(_node)

        gd.beginPath()
        gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
        gd.lineTo(_node.x + itemWidth / 2, _node.y + itemHeight / 2)
        gd.strokeStyle = Node.color.black
        gd.stroke()
      })
      
      me.renderNode(node)
    }

    function renderNode(node) {
      const keys = Object.keys(node.map)

      me.renderNode(node)

      keys.forEach((key, idx, arr) => {
        renderNode(node.map[key])
      })
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)

    gd.save()
    gd.font = d.conf.fontLg
    gd.translate((canvas.width / d.conf.devicePixelRatio - d.conf.paddingH * 2 - gd.measureText(d.strArr[0]).width) / 2, 0)
    d.strArr.forEach((str, idx, arr) => {
      gd.textBaseline = 'top'
      gd.fillStyle = Node.color.black
      gd.fillText(str, 0, idx * 20)
    })
    gd.restore()

    renderLine(d.root)
    renderNode(d.root)
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

class Maze extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.devicePixelRatio = 1
    d.itemWidth = 6
    d.itemHeight = 6
    d.wall = '#'
    d.road = ' '
    d.mazeData = mazeData.split('\n').map((line) => {
      return line.split('').map((c) => new Node(c))
    })

    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
    d.enter = {
      x: 1,
      y: 0,
    }
    d.exit = {
      x: d.mazeData.length - 2,
      y: d.mazeData[0].length - 1,
    }

    d.canvas.style.border = 'none'
    d.canvas.width = (d.mazeData.length * d.itemWidth) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = (d.mazeData[0].length * d.itemHeight) * d.devicePixelRatio

    me.preset()
    d.btn.onclick = (e) => {
      d.btn.onclick = null
      me.ready()
    }
  }
  dfs1() {
    const me = this
    const d = me.d

    async function dfs(x, y) {
      const node = d.mazeData[x][y]

      node.visited = true
      node.isPath = true

      me.render()
      await sleep(1)

      if (x === d.exit.x && y === d.exit.y) return new Promise(next => next(true))

      for (let i = 0; i < 4; i++) {
        const newX = x + d.dir[i][0]
        const newY = y + d.dir[i][1]

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited && 
          d.mazeData[newX][newY].n === d.road
        ) {
          if (await dfs(newX, newY)) return new Promise(next => next(true))
        }
      }

      node.isPath = false

      // me.render()
      // await sleep(1)

      return new Promise(next => next(false))
    }

    me.ready = async () => {
      console.log(await dfs(d.enter.x, d.enter.y) ? 'yes' : 'no')
      me.render()
    }
  }
  dfs2() {
    const me = this
    const d = me.d
    const stack = [d.enter]

    me.ready = async () => {
      let isFind = false

      while (stack.length > 0) {
        const p = stack.pop()
        const node = d.mazeData[p.x][p.y]

        d.mazeData.forEach((row, idx, arr) => {
          row.forEach((node, idx, arr) => {
            node.isPath = false
          })
        })

        node.visited = true
        let _p = p
        while (_p) {
          d.mazeData[_p.x][_p.y].isPath = true
          _p = _p.prev
        }

        me.render()
        await sleep(1)

        if (p.x === d.exit.x && p.y === d.exit.y) {
          isFind = true
          break
        }

        for (let i = 0; i < 4; i++) {
          const newX = p.x + d.dir[i][0]
          const newY = p.y + d.dir[i][1]

          if (
            me.inArea(newX, newY) && 
            !d.mazeData[newX][newY].visited && 
            d.mazeData[newX][newY].n === d.road
          ) {
            stack.push({
              x: newX,
              y: newY,
              prev: p,
            })
          }
        }
      }

      me.render()
    }
  }
  nfs() {
    const me = this
    const d = me.d
    const queue = [d.enter]

    me.ready = async () => {
      let isFind = false

      while (queue.length > 0) {
        const p = queue.shift()
        const node = d.mazeData[p.x][p.y]
        let _p = p

        node.visited = true
        d.mazeData.forEach((row, idx, arr) => {
          row.forEach((node, idx, arr) => {
            node.isPath = false
          })
        })

        while (_p) {
          d.mazeData[_p.x][_p.y].isPath = true
          _p = _p.prev
        }

        me.render()
        await sleep(1)

        if (p.x === d.exit.x && p.y === d.exit.y) {
          isFind = true
          break
        }

        for (let i = 0; i < 4; i++) {
          const newX = p.x + d.dir[i][0]
          const newY = p.y + d.dir[i][1]

          if (
            me.inArea(newX, newY) && 
            !d.mazeData[newX][newY].visited && 
            d.mazeData[newX][newY].n === d.road
          ) {
            queue.push({
              x: newX,
              y: newY,
              prev: p,
            })
          }
        }
      }

      me.render()
    }
  }
  preset(cb) {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    me.setPos()

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.mazeData.forEach((row, stair, arr) => {
      row.forEach((node, idx, arr) => {
        node.x = idx * d.itemWidth
        node.y = stair * d.itemHeight

        gd.beginPath()
        gd.rect(node.x, node.y, d.itemWidth, d.itemHeight)
        gd.fillStyle = Node.color[node.n === d.wall ? 'blue' : 'white']
        gd.fill()
      })
    })

    d.canvas.toBlob((blob) => {
      d.presetImg = new Image()
      d.presetImg.onload = (e) => {
        cb && cb()
      }
      d.presetImg.src = URL.createObjectURL(blob)
    })
    gd.restore()
  }
  inArea(x, y) {
    const me = this
    const d = me.d

    return (
      x >= 0 && x < d.mazeData.length &&
      y >= 0 && y < d.mazeData[0].length
    )
  }
  setPos() {
    const me = this
    const d = me.d
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    if (!d.presetImg) return

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.drawImage(
      d.presetImg,
      0, 0, canvas.width, canvas.height
    )

    d.mazeData.forEach((row, stair, arr) => {
      row.forEach((node, idx, arr) => {
        if (node.n === d.wall) return

        gd.beginPath()
        gd.rect(node.x, node.y, d.itemWidth, d.itemHeight)
        gd.fillStyle = Node.color[node.isPath ? 'red' : (node.visited ? 'yellow' : 'white')]
        gd.fill()
      })
    })
    gd.restore()
  }
}

class Algo {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.type = {
      list: [
        {name: '迷宫问题 - 广度优先', cons: Maze, startFn: 'nfs'},
        {name: '迷宫问题 - 深度优先 - 非递归', cons: Maze, startFn: 'dfs2'},
        {name: '迷宫问题 - 深度优先 - 递归', cons: Maze, startFn: 'dfs1'},
        {name: 'Trie', cons: Trie, startFn: 'create'},
        {name: '红黑树 (左倾 & 右倾)', cons: RBTree, startFn: 'create'},
        {name: 'AVL树', cons: AVLTree, startFn: 'create'},
        {name: '二分搜索树 - 镜像反转', cons: BinarySearch, startFn: 'create'},
        {name: '线段树 - R', cons: SegmentTree, startFn: 'createR'},
        {name: '线段树 - L', cons: SegmentTree, startFn: 'createL'},
        {name: '最大堆 - shiftUp', cons: MaxHeap, startFn: 'createByShiftUp'},
        {name: '最大堆 - hepify', cons: MaxHeap, startFn: 'heapify'},
        {name: '三路排序', cons: QuickSort3, startFn: 'startSort'},
        {name: '双路排序', cons: QuickSort2, startFn: 'startSort'},
        {name: '快速排序', cons: QuickSort, startFn: 'startSort'},
        {name: '归并排序', cons: MergeSort, startFn: 'startSort'},
        {name: '插入排序', cons: InsertionSort, startFn: 'startSort'},
        {name: '选择排序', cons: SelectionSort, startFn: 'startSort'},
      ]
    }

    d.cons = {
      list: []
    }

    d.conf = {
      itemWidth: 26,
      itemHeight: 16,
      levelHeight: 36,
      paddingH: 15,
      paddingV: 15,
      font: '14px Arial',
      fontSm: '12px Arial',
      fontLg: '16px Arial',
      devicePixelRatio: devicePixelRatio < 2 ? 2 : devicePixelRatio,
      // devicePixelRatio: devicePixelRatio,
    }

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1)

    // randArr = new Array(len).fill().map((_, idx) => len - idx)
    // randArr = new Array(len).fill().map((_, idx) => idx)
    // console.log(randArr)

    randArr = randArr.map(n => new Node(n))
    
    nodeList.querySelectorAll('canvas').forEach((canvas, idx, arr) => {
      const type = d.type.list[idx]
      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        btn: canvas.closest('section').querySelector('.btn'),
        algo: this,
        ...d,
      })

      d.cons.list.push(o)
      o[type.startFn]()
      o.setPos()
      o.render()
    })
  }
}

export default Algo
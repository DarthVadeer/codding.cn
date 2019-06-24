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
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
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

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

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

    d.itemWidth = 6
    d.delay = 0
    d.road = ' '
    d.wall = '#'
    d.sign = 1
    d.canvas.style.width = ''
    d.canvas.style.boxShadow = 'none'
    d.canvas.style.background = 'wheat'

    d.mazeData = mazeData.split('\n').map(line => line.split('').map(c => new Node(c)))
    d.enter = {x: 1, y: 0}
    d.exit = {x: d.mazeData.length - 2, y: d.mazeData[0].length - 1}
    d.dir = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    // d.dir.push(d.dir.shift())
    // d.dir.push(d.dir.shift())
    d.canvas.width = d.itemWidth * d.mazeData[0].length
    d.canvas.height = d.itemWidth * d.mazeData.length

    // d.mazeData[d.enter.x][d.enter.y].isPath = true
    // d.mazeData[d.exit.x][d.exit.y].isPath = true
    // ;['bfs', 'dfs2', 'dfs1'].some(v => v === d.type.startFn) && me.render()

    d.btn.onclick = (e) => {
      console.clear()

      d.mazeData.forEach((row, idx, arr) => {
        row.forEach((node, idx, arr) => {
          if (node.n !== d.road) return
          node.visited = false
          node.visited2 = false
          node.isPath = false
        })
      })

      d.sign++
      d.delay = 1
      console.log(d.type.startFn)
      me[d.type.startFn]()
    }
  }
  async generateRandomQueue2() {
    const me = this
    const d = me.d
    const sign = d.sign
    const randomQueue = [{x: 1, y: 1}]

    me.generateReset()

    while (randomQueue.length > 0) {
      if (d.sign !== sign) {
        console.log('generateRandomQueue2 时过境迁')
        return
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      const p = randomQueue[Math.random() < .5 ? 'pop' : 'shift']()

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
          randomQueue[Math.random() < .5 ? 'unshift' : 'push']({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    me.dfs1()
    me.render()
  }
  async generateRandomQueue1() {
    const me = this
    const d = me.d
    const sign = d.sign
    const randomQueue = [{x: 1, y: 1}]

    me.generateReset()

    while (randomQueue.length > 0) {
      if (d.sign !== sign) {
        console.log('generateRandomQueue1 时过境迁')
        return
      }

      randomQueue.swap(rand(0, randomQueue.length - 1), randomQueue.length - 1)
      const p = randomQueue.pop()

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
          randomQueue.push({
            x: newX,
            y: newY,
            prev: p,
          })
        }
      }
    }

    me.dfs1()
    me.render()
  }
  async generate3() {
    const me = this
    const d = me.d
    const sign = d.sign
    const queue = [{x: 1, y: 1}]

    me.generateReset()

    while (queue.length > 0) {
      const p = queue.shift()

      if (d.sign !== sign) {
        console.log('generate2 时过境迁')
        return
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
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
  async generate2() {
    const me = this
    const d = me.d
    const sign = d.sign
    const stack = [{x: 1, y: 1}]

    me.generateReset()

    while (stack.length > 0) {
      const p = stack.pop()

      if (d.sign !== sign) {
        console.log('generate2 时过境迁')
        return
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = p.x + d.dir[i][0] * 2
        const newY = p.y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[p.x + _x][p.y + _y].n = d.road
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
  async generate1() {
    const me = this
    const d = me.d
    const sign = d.sign

    me.generateReset()

    async function createRoad(x, y) {
      if (d.sign !== sign) {
        console.log('generate1 时过境迁')
        return new Promise(next => next())
      }

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      for (let i = 0; i < 4; i++) {
        const _x = d.dir[i][0]
        const _y = d.dir[i][1]
        const newX = x + d.dir[i][0] * 2
        const newY = y + d.dir[i][1] * 2

        if (
          me.inArea(newX, newY) && 
          !d.mazeData[newX][newY].visited2
        ) {
          me.openMist(newX, newY)
          d.mazeData[newX][newY].visited2 = true
          d.mazeData[x + _x][y + _y].n = d.road
          await createRoad(newX, newY)
        }
      }

      return new Promise(next => next())
    }

    await createRoad(1, 1)
    me.render()
  }
  generateReset() {
    const me = this
    const d = me.d

    d.row = 81
    d.col = 81

    d.mazeData = new Array(d.row).fill().map((_, idxRow) => {
      return new Array(d.col).fill().map((_, idxCol) => {
        return new Node(
          idxRow % 2 === 1 && idxCol % 2 === 1 ? ' ' : '#',
          {
            inMist: true
          }
        )
      })
    })

    d.exit = {x: d.mazeData.length - 2, y: d.mazeData[0].length - 1}
    d.mazeData[d.enter.x][d.enter.y].n = d.road
    d.mazeData[d.exit.x][d.exit.y].n = d.road
    d.canvas.width = d.itemWidth * d.mazeData[0].length
    d.canvas.height = d.itemWidth * d.mazeData.length
  }
  findPath(p) {
    const me = this
    const d = me.d
    let _p = p

    d.mazeData.forEach((row, idx, arr) => {
      row.forEach((node, idx, arr) => {
        node.isPath = false
      })
    })

    while (_p) {
      d.mazeData[_p.x][_p.y].isPath = true
      _p = _p.prev
    }
  }
  async bfs() {
    const me = this
    const d = me.d
    const sign = d.sign
    const queue = [d.enter]
    let isFind = false
    let lastP

    while (queue.length > 0) {
      if (d.sign !== sign) {
        console.warn('bfs 时过境迁')
        return
      }

      const p = queue.shift()
      const node = d.mazeData[p.x][p.y]

      lastP = p
      node.visited = true

      if (d.delay) {
        me.findPath(p)
        me.render()
        await sleep(d.delay)
      }

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

    if (isFind) {
      me.findPath(lastP)
      me.render()
    } else {
      console.log('no solution bfs')
    }
  }
  async dfs2() {
    const me = this
    const d = me.d
    const sign = d.sign
    const stack = [d.enter]
    let isFind = false
    let lastP

    while (stack.length > 0) {
      if (d.sign !== sign) {
        console.warn('dfs2 时过境迁')
        return
      }

      const p = stack.pop()
      const node = d.mazeData[p.x][p.y]

      lastP = p
      node.visited = true

      if (d.delay) {
        me.findPath(p)
        me.render()
        await sleep(d.delay)
      }

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

    if (isFind) {
      me.findPath(lastP)
      me.render()
    } else {
      console.log('no solution dfs2')
    }
  }
  async dfs1() {
    const me = this
    const d = me.d
    const sign = d.sign

    async function dfs(x, y) {
      if (d.sign !== sign) {
        console.warn('dfs1 时过境迁')
        return
      }

      const node = d.mazeData[x][y]

      node.visited = true
      node.isPath = true

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

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

      if (d.delay) {
        me.render()
        await sleep(d.delay)
      }

      return new Promise(next => next(false))
    }

    await dfs(d.enter.x, d.enter.y)
    me.render()
  }
  inArea(x, y) {
    const me = this
    const d = me.d

    return (
      x >= 0 && x < d.mazeData.length &&
      y >= 0 && y < d.mazeData[0].length
    )
  }
  openMist(x, y) {
    const me = this
    const d = me.d

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (me.inArea(i, j)) {
          d.mazeData[i][j].inMist = false
        }
      }
    }
  }
  setPos() {
    const me = this
    const d = me.d

  }
  render(hard) {
    // console.warn('render')
    const me = this
    const d = me.d
    const {canvas, gd} = d

    gd.fillStyle = '#fff'
    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.mazeData.forEach((row, idxRow, arr) => {
      row.forEach((node, idxCol, arr) => {
        gd.beginPath()
        gd.rect(idxCol * d.itemWidth, idxRow * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = Node.color[node.inMist ? 'black' : (node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited ? 'yellow' : 'white')))]
        gd.fill()
      })
    })
  }
}

class Vicsek extends Fractal {
  create() {
    // console.log('Vicsek create')
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const dir = {
      '0-0': 1,
      '0-2': 1,
      '1-1': 1,
      '2-0': 1,
      '2-2': 1,
    }
    let count = 0

    function render(x, y, w, h, depth) {
      const _w = w / 3
      const _h = h / 3

      depth++

      if (_w < 1 || _h < 1 || depth > d.depth) {
        gd.beginPath()
        gd.rect(x, y, w, h)
        gd.fillStyle = Node.color.green
        gd.fill()
        return
      }

      ++count
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (dir[i + '-' + j]) {
            render(x + j * _w, y + i * _h, _w, _h, depth)
          }
        }
      }
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)
    render(0, 0, canvas.width, canvas.height, 0)
    // console.log(me.constructor.name, count)
  }
}

class Sierpinski extends Fractal {
  create() {
    // console.log('Vicsek create')
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const dir = {
      '0-0': 1,
      '0-1': 1,
      '0-2': 1,
      '1-0': 1,
      '1-2': 1,
      '2-0': 1,
      '2-1': 1,
      '2-2': 1,
    }
    let count = 0

    function render(x, y, w, h, depth) {
      const _w = w / 3
      const _h = h / 3

      depth++
      if (depth > d.depth) return
      count++

      gd.beginPath()
      gd.rect(x + _w, y + _h, _w, _h)
      gd.fillStyle = Node.color.purple
      gd.fill()

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (dir[i + '-' + j]) {
            render(x + j * _w, y + i * _h, _w, _h, depth)
          }
        }
      }
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)
    render(0, 0, canvas.width, canvas.height, 0)
    // console.log(me.constructor.name, count)
  }
}

class SierpinskiTriangle extends Fractal {
  create() {
    
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    let count = 0

    function render(x1, y1, c, depth) {
      depth++

      const x2 = x1 + c
      const y2 = y1

      const x3 = (x1 + x2) / 2
      const h = c * Math.sin(d2a(-60))
      const y3 = h + y1

      if (c < 1 || depth > d.depth) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = Node.color.blue
        gd.fill()
        return
      }

      ++count
      render(x1, y1, c / 2, depth)
      render(x1 + c / 2, y1, c / 2, depth)
      render(x1 + c / 4, y1 + h / 2, c / 2, depth)
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)
    render(0, canvas.height - canvas.height * .07, canvas.width, 0)
    // console.log(me.constructor.name, count)
  }
}

class KoachSnowflake extends Fractal {
  create() {
    // console.log('Vicsek create')
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const dir = {
      '0-0': 1,
      '0-2': 1,
      '1-1': 1,
      '2-0': 1,
      '2-2': 1,
    }
    const _canvas = canvas.cloneNode()
    const _gd = _canvas.getContext('2d')
    let count = 0

    _canvas.width *= .7

    function renderOne(x1, y1, side, deg, depth) {
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 - side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 - side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 - side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 - side * Math.sin(d2a(deg))

      ++count
      ++depth
      if (depth >= d.depth || side < 1) {
        _gd.beginPath()
        _gd.lineTo(x1, y1)
        _gd.lineTo(x2, y2)
        _gd.lineTo(x3, y3)
        _gd.lineTo(x4, y4)
        _gd.lineTo(x5, y5)
        _gd.strokeStyle = Node.color.blue
        _gd.stroke()
      } else {
        renderOne(x1, y1, side, deg + 0, depth)
        renderOne(x2, y2, side, deg - 60, depth)
        renderOne(x3, y3, side, deg + 60, depth)
        renderOne(x4, y4, side, deg + 0, depth)
      }
    }

    function renderFull() {
      new Array(3).fill().forEach((_, idx, arr) => {
        const deg = idx * 120

        gd.save()
        gd.translate(canvas.width / 2, canvas.height / 2)
        gd.rotate(d2a(deg))
        gd.drawImage(
          _canvas,
          0, 0, _canvas.width, _canvas.height,
          -_canvas.width / 2, _canvas.width * .287, _canvas.width, _canvas.height,
        )
        gd.restore()

      })
    }

    gd.clearRect(0, 0, canvas.width, canvas.height)
    renderOne(0, 0, _canvas.width, 0, 0)

    renderFull()

    // console.log(me.constructor.name, count)
  }
}

class FractalTree extends Fractal {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.maxDepth = 10
    d.depth = 7
    d.canvas.width *= 2.2
    d.canvas.height *= .6
    d.canvas.style.width = ''
  }
  create() {

  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    function renderLine(x1, y1, side, deg, degL, degR, depth) {
      if (side < 2 || depth > d.depth) return

      const x2 = x1 + side * Math.sin(d2a(deg))
      const y2 = y1 - side * Math.cos(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.stroke()

      ++depth
      renderLine(x2, y2, side * .7, deg + degL, degL, degR, depth)
      renderLine(x2, y2, side * .7, deg + degR, degL, degR, depth)
    }

    const steps = [
      {degL: -30, degR: 10, left: 0},
      {degL: -20, degR: 20, left: 0},
      {degL: -10, degR: 50, left: 0},
      {degL: -90, degR: 90, left: 0},
    ]

    const space = 100
    const perW = (canvas.width - space * 2) / steps.length

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    steps.forEach((item, idx, arr) => {
      gd.save()
      gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
      renderLine((idx === arr.length - 1 ? canvas.width - 140 : idx * perW + perW / 2 + 50) / d.conf.devicePixelRatio, canvas.height / d.conf.devicePixelRatio, 90, 0, item.degL, item.degR, 0)
      gd.restore()
    })
  }
}

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

class Algo {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.type = {
      list: [
        {name: '扫雷', cons: MineSweeper, startFn: 'create'},
        {name: '分形图 - FractalTree', cons: FractalTree, startFn: 'create'},
        {name: '分形图 - KoachSnowflake', cons: KoachSnowflake, startFn: 'create'},
        {name: '分形图 - SierpinskiTriangle', cons: SierpinskiTriangle, startFn: 'create'},
        {name: '分形图 - Sierpinski', cons: Sierpinski, startFn: 'create'},
        {name: '分形图 - Vicsek', cons: Vicsek, startFn: 'create'},
        {name: '迷宫创建 - 随机队列 - 2', cons: Maze, startFn: 'generateRandomQueue2'},
        {name: '迷宫创建 - 随机队列 - 1', cons: Maze, startFn: 'generateRandomQueue1'},
        {name: '迷宫创建 - 广度优先', cons: Maze, startFn: 'generate3'},
        {name: '迷宫创建 - 深度优先 - 非递归', cons: Maze, startFn: 'generate2'},
        // {name: '迷宫创建 - 深度优先 - 递归', cons: Maze, startFn: 'generate1'},
        {name: '迷宫遍历 - 广度优先', cons: Maze, startFn: 'bfs'},
        {name: '迷宫遍历 - 深度优先 - 非递归', cons: Maze, startFn: 'dfs2'},
        {name: '迷宫遍历 - 深度优先 - 递归', cons: Maze, startFn: 'dfs1'},
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
      devicePixelRatio,
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

    const len = 24
    let randArr = [].rnd(len, 1)

    // randArr = new Array(len).fill().map((_, idx) => len - idx)
    // randArr = new Array(len).fill().map((_, idx) => idx)
    // console.log(randArr)

    randArr = randArr.map(n => new Node(n))
    
    nodeList.querySelectorAll('canvas').forEach(async (canvas, idx, arr) => {
      const type = d.type.list[idx]

      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        btn: canvas.closest('section').querySelector('.btn'),
        algo: this,
        ...d,
        type,
      })

      d.cons.list.push(o)
      o[type.startFn]()
      o.setPos()
      ;![Maze].some(cons => type.cons === cons) && o.render()
    })
  }
}

export default Algo
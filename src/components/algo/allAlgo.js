class Node {
  constructor(n, extend) {
    this.n = n

    extend = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      width: 0,
      height: 0,
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

    d.conf = clone(Algo.conf)
    d.color = Algo.color
    d.gd.font = d.conf.font

    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  renderNode(node, opt = {}) {
    if (!node) return

    const d = this.d
    const {gd} = d
    const itemWidth = opt.itemWidth || node.width || d.itemWidth || d.conf.itemWidth
    const itemHeight = opt.itemHeight || node.height || d.itemHeight || d.conf.itemHeight
    const translateX = (itemWidth - d.conf.itemWidth) / 2
    const x = node.x - translateX

    gd.save()
    gd.globalAlpha = .8
    gd.beginPath()
    gd.rect(x + 1, node.y, itemWidth - 2, itemHeight)
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.fillStyle = d.color.white
    gd.font = d.conf.font
    gd.fillText(node.n, x + itemWidth / 2, node.y + itemHeight / 2)

    if ('balanceFactor' in node) {
      gd.textBaseline = 'bottom'
      gd.fillStyle = d.color.black

      ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, x + itemWidth / 2, (idx - arr.length + 1) * 16 + node.y)
      })
    }
  }
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach(v => v.strokeStyle = randColor().toString())
    d.steps = [d.arr.clone()]
  }
  setPos() {
    const d = this.d

    d.contentHeight = (d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale

    d.steps.forEach((row, stair) => {
      row.forEach((node, idx) => {
        if (!node) return
        node.x = idx * d.conf.itemWidth
        node.y = stair * d.conf.levelHeight
      })
    })
  }
  render() {
    const d = this.d
    const {canvas, gd} = d

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

    d.arr.forEach(node => node.fillStyle = d.color.blue)
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
  }
  setPos() {
    const d = this.d
    const {canvas} = d
    let count = 0

    d.contentWidth = Math.pow(2, d.level - 1) * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'

    d.contentHeight = (d.level - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale

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

    const renderNode = () => {
      d.arr.forEach((node, idx) => {
        this.renderNode(node)
      })
    }

    const renderLine = () => {
      for (let i = d.branchIndex; i > -1; i--) {
        const node = d.arr[i]
        const itemL = d.arr[i * 2 + 1]
        const itemR = d.arr[i * 2 + 2]

        gd.beginPath()
        itemL && gd.lineTo(itemL.x + d.conf.itemWidth / 2, itemL.y + d.conf.itemHeight / 2)
        gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
        itemR && gd.lineTo(itemR.x + d.conf.itemWidth / 2, itemR.y + d.conf.itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      }
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

    d.arr.forEach(node => node.width = d.conf.itemWidth)

    d.paddingTop = 60
    d.conf.paddingH = 30
    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth

    d.iLeft = 0
    d.contentHeight = 0
    d.translateX = 0
    d.arr.forEach((node, idx) => node.x = idx * d.conf.itemWidth)

    const setPos = (node, depth) => {
      if (!node) return

      setPos(node.l, depth + 1)
      node.x = d.iLeft
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.iLeft += itemWidth / 2
      setPos(node.r, depth + 1)

      d.contentHeight = Math.max(d.contentHeight, node.y + d.conf.itemHeight)

      if (node.l &&　node.r) {
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
    !d.root2 && (d.translateX += itemWidth / 2)

    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return
      updateCoord(rootNode, 0)
    })

    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderLine = (node) => {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      gd.beginPath()
      node.l && gd.lineTo(node.l.x + d.conf.itemWidth / 2, node.l.y + d.conf.itemHeight / 2)
      gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
      node.r && gd.lineTo(node.r.x + d.conf.itemWidth / 2, node.r.y + d.conf.itemHeight / 2)
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

    d.renderCount = 0
    d.depth = 5
    d.MaxDepth = 6
    d.contentWidth = 600
    d.contentHeight = 600

    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  create() {}
  setPos() {}
  render() {}
  /*log() {
    console.warn('renderCount', this.__proto__.constructor.name, this.d.renderCount)
  }*/
}

class SelectionSort extends Sort {
  startSort() {
    const d = this.d

    for (let i = 0, len = d.arr.length; i < len; i++) {
      let minIndex = i

      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = d.color.orange

      for (let j = i + 1; j < len; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = d.color.green

        if (d.arr[j].n < d.arr[minIndex].n) {
          minIndex = j
        }
      }

      d.arr[minIndex].fillStyle = d.color.blue
      d.arr.swap(i, minIndex)

      d.steps.push(
        new Array(i).fill().concat(
          d.arr.slice(i, d.arr.length).clone()
        )
      )
    }

    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
}

class InsertionSort extends Sort {
  startSort() {
    const d = this.d

    for (let i = 1, len = d.arr.length; i < len; i++) {
      let j = i

      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = d.color.blue

      for (; j > 0; j--) {
        d.arr[j - 1].fromIndex = j - 1
        d.arr[j - 1].fillStyle = d.color.green

        if (d.arr[j].n < d.arr[j - 1].n) {
          d.arr.swap(j, j - 1)
        } else {
          break
        }
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
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
}

class MergeSort extends Sort {
  startSort() {
    const d = this.d

    const mergeSort = (l, r) => {
      if (l >= r) return

      const mid = l + parseInt((r - l) / 2)
      mergeSort(l, mid)
      mergeSort(mid + 1, r)

      const aux = new Array(r - l + 1)

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

      const fillStyle = d.color[l === 0 && r === d.arr.length - 1 ? 'blue' : 'green']

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

    const quickSort = (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let j = l

      for (let i = l; i <= r; i++) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.green
          d.arr.swap(i, j + 1)
          j++
        } else {
          d.arr[i].fillStyle = d.color.orange
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

class QuickSort3 extends Sort {
  startSort() {
    const d = this.d

    const quickSort = (l, r) => {
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
          d.arr[i].fillStyle = d.color.green
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

class QuickSort2 extends Sort {
  startSort() {
    const d = this.d

    const quickSort = (l, r) => {
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
          d.arr[i].fillStyle = d.color.green
          i++
        }
        while (j > l && d.arr[j].n > v) {
          d.arr[j].fillStyle = d.color.orange
          j--
        }
        if (i > j) break
        d.arr.swap(i, j)
        d.arr[i].fillStyle = d.color.green
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

class MaxHeap extends Heap {
  heapify() {
    const d = this.d

    for (let i = d.branchIndex; i > -1; i--) {
      this.shiftDown(i)
    }
  }
  createByShiftUp() {
    const d = this.d

    for (let i = 1; i < d.arr.length; i++) {
      this.shiftUp(i)
    }
  }
  shiftUp(k) {
    const d = this.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[j].n > d.arr[k].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
  shiftDown(k) {
    const d = this.d

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
  createL() {
    const d = this.d

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)

    const createL = (treeIndex, l, r) => {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      createL(treeIndex * 2 + 1, l, mid)
      createL(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.gd.font = d.conf.font
      d.arr[treeIndex].width = Math.max(d.conf.itemWidth, d.gd.measureText(d.arr[treeIndex].n).width + 10)
      d.arr[treeIndex].fillStyle = d.color.blue
    }

    createL(0, 0, d.n)
  }
  createR() {
    const d = this.d

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)

    const createR = (treeIndex, l, r) => {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      createR(treeIndex * 2 + 1, l, mid - 1)
      createR(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.gd.font = d.conf.font
      d.arr[treeIndex].width = Math.max(d.conf.itemWidth, d.gd.measureText(d.arr[treeIndex].n).width + 10)
      d.arr[treeIndex].fillStyle = d.color.blue
    }

    createR(0, 0, d.n)
  }
}

class BinarySearch extends Tree {
  create() {
    const d = this.d

    d.arr.clone().forEach((node, idx) => {
      node.width = 0
      node.fillStyle = d.color.blue
      d.root = this.add(d.root, node)
    })

    d.root2 = this.flip(clone(d.root))
  }
  add(node, item) {
    if (!node) return item

    if (item.n > node.n) {
      node.r = this.add(node.r, item)
    } else if (item.n < node.n) {
      node.l = this.add(node.l, item)
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

    return node
  }
}

class AVLTree extends Tree {
  create() {
    const d = this.d

    d.itemWidth = 50
    d.paddingTop = 80
    d.conf.levelHeight = 60
    d.conf.paddingH = 15
    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'

    d.arr.clone().forEach((node, idx) => {
      node.width = 50
      node.fillStyle = d.color.blue
      node.h = 1
      node.balanceFactor = 0
      d.root = this.add(d.root, node)
    })
  }
  add(node, item) {
    if (!node) return item

    if (item.n > node.n) {
      node.r = this.add(node.r, item)
    } else if (item.n < node.n) {
      node.l = this.add(node.l, item)
    } else {
      // ===
    }

    const balanceFactor = this.getBalanceFactor(node)

    if (Math.abs(balanceFactor) > 1) {
      if (balanceFactor > 0) {
        if (this.getBalanceFactor(node.l) < 0) {
          node.l = this.leftRotate(node.l)
        }
        node = this.rightRotate(node)
      } else {
        if (balanceFactor > 0) {
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
    return node ? this.getHeight(node.l) - this.getHeight(node.r) : 0
  }
  leftRotate(x) {
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
  rightRotate(x) {
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
}

class RBTree extends Tree {
  create() {
    const d = this.d

    d.arr.clone().forEach((node, idx) => {
      node.width = 0
      node.fillStyle = d.color.red
      d.root = this.addL(d.root, node)
      d.root.fillStyle = d.color.black
    })
    d.arr.clone().forEach((node, idx) => {
      node.width = 0
      node.fillStyle = d.color.red
      d.root2 = this.addR(d.root2, node)
      d.root2.fillStyle = d.color.black
    })
  }
  addL(node, item) {
    const d = this.d

    if (!node) return item

    if (item.n > node.n) {
      node.r = this.addL(node.r, item)
    } else if (item.n < node.n) {
      node.l = this.addL(node.l, item)
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
    const d = this.d

    if (!node) return item

    if (item.n > node.n) {
      node.r = this.addR(node.r, item)
    } else if (item.n < node.n) {
      node.l = this.addR(node.l, item)
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
    return node ? node.fillStyle === this.d.color.red : false
  }
  leftRotate(x) {
    const y = x.r

    x.r = y.l
    y.l = x

    y.fillStyle = x.fillStyle
    x.fillStyle = this.d.color.red

    return y
  }
  rightRotate(x) {
    const y = x.l

    x.l = y.r
    y.r = x

    y.fillStyle = x.fillStyle
    x.fillStyle = this.d.color.red

    return y
  }
  flipColors(node) {
    const d = this.d
    node.fillStyle = d.color.red
    node.l.fillStyle = 
    node.r.fillStyle = d.color.black
  }
}

class Trie extends Common {
  create() {
    const d = this.d

    //  your app's user interface. The framework, gestures cat dog deer pan panda
    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    d.strArr = d.str.toLowerCase().match(/\w+/g)
    d._strArr = d.str.split(/\s+/g)
    d.root = new Node('root', {map: {}, isWord: false})
    d.steps = []
    d.row = 3
    d.lenStep = Math.ceil(d._strArr.length / d.row)
    d.paddingTop = d.row * d.conf.lineHeight + d.conf.paddingV

    for (let i = 0; i < d._strArr.length; i += d.lenStep) {
      d.steps.push(d._strArr.slice(i, i + d.lenStep).clone())
    }

    d.gd.font = d.conf.font
    d.strWidth = d.gd.measureText(d.steps.first().join(' ')).width

    d.strArr.forEach((str, idx) => {
      let node = d.root

      for (let i = 0, len = str.length; i < len; i++) {
        const c = str[i]
        node = node.map[c] = node.map[c] || new Node(c, {map: {}, isWord: i === len - 1})
        node.fillStyle = d.color[node.isWord ? 'blue' : 'black']
      }
    })
  }
  setPos() {
    const d = this.d
    d.iLeft = 0
    d.contentHeight = 0

    function setPos(node, depth) {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        setPos(node.map[key], depth + 1)
      })

      node.x = d.iLeft
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (keys.length === 0) {
        d.iLeft += d.conf.itemWidth
      } else {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      }
    }

    setPos(d.root, 0)
    d.contentWidth = d.iLeft
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {canvas, gd} = d

    const renderStr = () => {
      gd.textBaseline = 'top'
      gd.font = d.conf.font
      d.steps.forEach((row, idx) => {
        const str = row.join(' ')
        gd.fillText(str, (d.contentWidth - d.strWidth) / 2, idx * d.conf.lineHeight)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        const _node = node.map[key]

        renderLine(_node)

        gd.beginPath()
        gd.lineTo(node.x + d.conf.itemWidth / 2 + .5, node.y + d.conf.itemHeight / 2)
        gd.lineTo(_node.x + d.conf.itemWidth / 2 + .5, _node.y + d.conf.itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      })
    }

    const renderNode = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        renderNode(node.map[key])
      })

      this.renderNode(node)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderStr()
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}

class Vicsek extends Fractal {
  create() {
    const d = this.d
    const {gd} = d
    const dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    d.depth = 4

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) {
        ++d.renderCount
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      side /= 3
      ++depth

      dir.forEach((item, idx) => {
        render(x + item[1] * side, y + item[0] * side, side, depth)
      })
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}

class Sierpinski extends Fractal {
  create() {
    const d = this.d
    const {gd} = d

    d.depth = 4

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) return

      side /= 3

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i == 1 && j === 1) {
            ++d.renderCount
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            render(x + side * j, y + side * i, side, depth + 1)
          }
        }
      }
    }

    
    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}

class SierpinskiTriangle extends Fractal {
  create() {
    const d = this.d
    const {gd} = d

    d.depth = 6

    const render = (x1, y1, side, depth) => {
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side * Math.cos(d2a(-60))
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth >= d.depth) {
        ++d.renderCount
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = d.color.cyan
        gd.fill()
        return
      } else {
        side /= 2
        ++depth

        render(x1, y1, side, depth)
        render(x1 + side, y1, side, depth)
        render(x1 + side / 2, (y1 + y3) / 2, side, depth)
      }
    }

    let translateY = d.contentHeight
    translateY = translateY * Math.sin(d2a(-60))
    translateY = (d.contentHeight + translateY) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(0, d.contentHeight - translateY, d.contentWidth, 0)
    gd.restore()
  }
}

class KoachSnowflake extends Fractal {
  create() {
    const d = this.d
    const {canvas, gd} = d

    const render = (x1, y1, side, deg, depth) => {
      ++depth
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth >= d.depth) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.lineTo(x4, y4)
        gd.lineTo(x5, y5)
        gd.strokeStyle = d.color.blue
        gd.stroke()
      } else {
        render(x1, y1, side, deg, depth)
        render(x2, y2, side, deg - 60, depth)
        render(x3, y3, side, deg + 60, depth)
        render(x4, y4, side, deg, depth)
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(d.contentWidth * .1, d.contentHeight / 3.71, d.contentWidth * .8, 0, 0)
    gd.restore()

    d.canvas.toBlob((blob) => {
      const src = URL.createObjectURL(blob)
      const img = new Image()

      img.onload = () => {
        const len = 3
        const deg = 360 / len

        gd.clearRect(0, 0, canvas.width, canvas.height)

        new Array(len).fill().forEach((_, idx) => {
          const _deg = deg * idx

          gd.save()
          gd.translate(
            (d.contentWidth / 2 + d.conf.paddingH) * d.conf.scale,
            (d.contentHeight / 2 + d.conf.paddingV) * d.conf.scale
          )
          gd.rotate(d2a(_deg))
          gd.drawImage(
            img,
            0, 0, img.width, img.height,
            -img.width / 2, -img.height / 2, img.width, img.height
          )
          gd.restore()
          this.onready && this.onready()
        })
      }

      img.src = src
    })
  }
}

class FractalTree extends Fractal {
  create(arg = {}) {
    const d = this.d
    const {canvas, gd} = d

    d.depth = 10

    const render = (x1, y1, side, deg, degL, degR, depth) => {
      if (depth >= d.depth || side < 3) return
      ++d.renderCount

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      ++depth
      side *= .8

      render(x2, y2, side, deg + degL, degL, degR, depth)
      render(x2, y2, side, deg + degR, degL, degR, depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(
      d.contentWidth / 2 + (arg.translateX || 0),
      d.contentHeight,
      arg.side || 100,
      -90,
      arg.degL || -15,
      arg.degR || 15,
      0,
    )
    gd.restore()
  }
}

class Fib extends Fractal {
  getFibList(end) {
    const result = []
    let a = 1
    let b = 1

    for (let i = 0; i < end; i++) {
      result.push(a)
      const t = b
      b += a
      a = t
    }

    return result
  }
  renderLine(arg = {}) {
    const d = this.d
    const {canvas, gd} = d
    const fib = this.getFibList(15)
    let cx = fib[fib.length - 2]
    let cy = fib[fib.length - 2]

    d.canvas.width = (fib[fib.length - 1] + d.conf.paddingH) * d.conf.scale
    d.canvas.height = (fib[fib.length - 2] + d.conf.paddingV) * d.conf.scale

    const renderLine = () => {
      for (let len = fib.length, i = len - 1; i > 2; i--) {
        const _i = (len - i + 1) % 4
        const r = fib[i - 1]
        const deg = _i * 90

        gd.beginPath()

        if (arg.isRenderAux) {
          gd.lineTo(cx, cy)
          gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
          gd.closePath()
        } else {
          gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
        }
        
        gd.strokeStyle = d.color.indigo
        gd.stroke()

        switch (_i) {
          case 0:
            cy += fib[i - 3]
            break
          case 1:
            cx -= fib[i - 3]
            break
          case 2:
            cy -= fib[i - 3]
            break
          case 3:
            cx += fib[i - 3]
            break
        }
      }
    }

    d.canvas.width += d.conf.paddingH * 2
    d.canvas.height += d.conf.paddingV * 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
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

    const d = this.d

    d.itemWidth = 6
    d.road = ' '
    d.wall = '#'
    d.mazeData = mazeData.split('\n').map(row => row.split('').map(n => new Node(n)))
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    // d.mazeData[d.enter.y][d.enter.x].isPath = true
    // d.mazeData[d.exit.y][d.exit.x].isPath = true

    d.canvas.width = d.mazeData[0].length * d.itemWidth
    d.canvas.style.width = ''
    d.canvas.height = d.mazeData.length * d.itemWidth
  }
  inArea(y, x) {
    const d = this.d
    return (
      y >= 0 && y < d.mazeData.length &&
      x >= 0 && x < d.mazeData[0].length
    )
  }
  dfs1() {
    const d = this.d

    const findPath = (y, x) => {
      const node = d.mazeData[y][x]

      d.mazeData[y][x].visited = true
      node.isPath = true

      if (y === d.exit.y && x === d.exit.x) {
        // console.log('dfs1 路找到了')
        return true
      }

      for (let i = 0; i < 4; i++) {
        const newY = y + d.dir[i][0]
        const newX = x + d.dir[i][1]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          if (findPath(newY, newX)) {
            return true
          }
        }
      }

      node.isPath = false
      return false
    }

    findPath(d.enter.y, d.enter.x)
    d.dfs1Ready = true
  }
  findPath(p) {
    const d = this.d

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
  }
  async dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()
      const node = d.mazeData[p.y][p.x]

      d.mazeData[p.y][p.x].visited = true

      if (p.y === d.exit.y && p.x === d.exit.x) {
        // console.log('dfs2 路找到了')
        break
      }

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0]
        const newX = p.x + d.dir[i][1]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          stack.push({
            x: newX,
            y: newY,
            from: p,
          })
        }
      }
    }

    d.dfs2Ready = true
    this.findPath(p)
    // this.render()
    // this.onready && this.onready()
  }
  bfs() {
    const d = this.d
    const queue = [d.enter]
    let p

    while (queue.length > 0) {
      p = queue.shift()
      const node = d.mazeData[p.y][p.x]

      d.mazeData[p.y][p.x].visited = true

      if (p.y === d.exit.y && p.x === d.exit.x) {
        // console.log('dfs2 路找到了')
        break
      }

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0]
        const newX = p.x + d.dir[i][1]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          queue.push({
            x: newX,
            y: newY,
            from: p,
          })
        }
      }
    }

    d.bfsReady = true
    this.findPath(p)
  }
  setPos() {}
  render() {
    const d = this.d
    const {canvas, gd} = d

    // console.warn('%c render ' + d.typeItem.startFn, 'color: red')

    gd.fillRect(0, 0, canvas.width, canvas.height)

    d.mazeData.forEach((row, stair) => {
      row.forEach((node, idx) => {
        gd.beginPath()
        gd.rect(idx * d.itemWidth, stair * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = d.color[node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited ? 'yellow' : 'white'))]
        gd.fill()
      })
    })
  }
}

class Algo {
  constructor(d = {}) {
    this.d = d

    d.type = d.type || {}
    d.type.list = d.type.list || []

    const nodeList = document.querySelector('#box-algo > .list')
    
    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section class="algo-item">
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas data-title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1, len * 5)
    // randArr = new Array(len).fill().map((_, idx) => idx)

    randArr = randArr.map(n => new Node(n))

    nodeList.querySelectorAll('canvas').forEach((canvas, idx) => {
      const typeItem = d.type.list[idx]
      console.time(typeItem.cons.name)
      const o = new typeItem.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        typeItem,
      })

      o[typeItem.startFn](typeItem.arg)
      o.setPos()
      o.render()
      o.log && o.log()
      console.timeEnd(typeItem.cons.name)
    })
  }
}

Algo.conf = {
  itemWidth: 30,
  itemHeight: 18,
  levelHeight: 36,
  paddingH: 15,
  paddingV: 15,
  paddingTop: 0,
  lineHeight: 14 * 1.5,
  scale: devicePixelRatio,
  font: '14px Arial',
  fontSm: '12px Arial',
  fontLg: '16px Arial',
}

Algo.color = {
  red: '#F44336',
  pink: '#E91E63',
  purple: '#9C27B0',
  deepPurple: '#673AB7',
  indigo: '#3F51B5',
  blue: '#2196F3',
  lightBlue: '#03A9F4',
  cyan: '#00BCD4',
  teal: '#009688',
  green: '#4CAF50',
  lightGreen: '#8BC34A',
  lime: '#CDDC39',
  yellow: '#FFEB3B',
  amber: '#FFC107',
  orange: '#FF9800',
  deepOrange: '#FF5722',
  brown: '#795548',
  grey: '#9E9E9E',
  blueGrey: '#607D8B',
  black: '#000000',
  white: '#FFFFFF',
}

export default {
  Node,
  Common,
  Sort,
  Heap,
  Tree,
  Fractal,
  SelectionSort,
  InsertionSort,
  MergeSort,
  QuickSort,
  QuickSort3,
  QuickSort2,
  MaxHeap,
  SegmentTree,
  BinarySearch,
  AVLTree,
  RBTree,
  Trie,
  Vicsek,
  Sierpinski,
  SierpinskiTriangle,
  KoachSnowflake,
  FractalTree,
  Fib,
  Maze,
  Algo
}
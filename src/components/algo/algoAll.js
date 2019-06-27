class Item {
  constructor(n, o) {
    this.n = n

    o = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      fillStyle: Algo.color.black,
      strokeStyle: Algo.color.black,
      ...o,
    }

    for (let key in o) {
      this[key] = o[key]
    }
  }
}

class Common {
  constructor(d = {}) {
    this.d = d
    d.conf = {
      itemWidth: 30,
      itemHeight: 18,
      levelHeight: 38,
      paddingH: 15,
      paddingV: 15,
      devicePixelRatio,
      font: '14px Arial',
      fontSm: '12px Arial',
      fontLg: '16px Arial',
      ...d.conf,
    }
    d.color = Algo.color
    d.countRender = 0
  }
  renderItem(item, o = {}) {
    if (!item) return

    const d = this.d
    const {gd} = d
    const itemWidth = o.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = o.itemHeight || d.itemHeight || d.conf.itemHeight

    gd.save()
    gd.globalAlpha = .8
    gd.beginPath()
    gd.rect(item.x + 1, item.y, itemWidth - 2, itemHeight)
    gd.fillStyle = item.fillStyle
    gd.fill()
    gd.restore()

    gd.beginPath()
    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.font = d.conf.font
    gd.fillStyle = d.color.white
    gd.fillText(item.n, item.x + itemWidth / 2, item.y + itemHeight / 2)

    gd.fillStyle = d.color.black
    gd.textBaseline = 'bottom'

    if ('balanceFactor' in item) {
      ;['高度:' + item.h, '平衡:' + item.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, item.x + itemWidth / 2, (idx - arr.length + 1) * 16 + item.y - 2)
      })
    }
  }
  /*log() {
    console.log(
      '%c' + ' countRender:',
      'color: #a00',
      this.d.countRender,
      this.d.typeItem.name,
    )
  }*/
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach(item => item.strokeStyle = randColor().toString())
    d.steps = [d.arr.clone()]
  }
  setPos() {
    const d = this.d

    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = ((d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio

    d.steps.forEach((row, stair) => {
      row.forEach((item, idx) => {
        if (!item) return
        item.x = idx * d.conf.itemWidth
        item.y = stair * d.conf.levelHeight
      })
    })
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    const renderItem = () => {
      d.steps.forEach((row, idx) => {
        row.forEach((item, idx) => {
          ++d.countRender
          this.renderItem(item)
        })
      })
    }

    const renderLine = () => {
      d.steps.last().forEach((item, idx) => {
        let stair = d.steps.length

        gd.beginPath()

        while (--stair > -1) {
          ++d.countRender
          const _item = d.steps[stair][item.fromIndex]
          if (!_item) continue

          item = _item
          gd.lineTo(item.x + itemWidth / 2 + .5, item.y + itemHeight / 2)
        }

        gd.strokeStyle = item.strokeStyle
        gd.stroke()
      })
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderItem()
    gd.restore()
  }
}

class Heap extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach(item => item.fillStyle = d.color.blue)
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    let count = 0

    d.contentWidth = Math.pow(2, d.level - 1) * itemWidth
    d.contentHeight = (d.level - 1) * d.conf.levelHeight

    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio

    for (let i = 0; i < d.level; i++) {
      const n = Math.pow(2, i)
      const perW = d.contentWidth / n

      for (let j = 0; j < n && count + j < d.arr.length; j++) {
        const index = count + j
        const item = d.arr[index]

        item.x = j * perW + perW / 2 - itemWidth / 2
        item.y = i * d.conf.levelHeight
      }

      count += n
    }
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderItem = () => {
      d.arr.forEach((item) => {
        ++d.countRender
        this.renderItem(item)
      })
    }

    const renderLine = () => {
      for (let i = d.branchIndex; i > -1; i--) {
        const node = d.arr[i]
        const nodeL = d.arr[i * 2 + 1]
        const nodeR = d.arr[i * 2 + 2]

        ++d.countRender
        gd.beginPath()
        nodeL && gd.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
        gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
        nodeR && gd.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      }
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderItem()
    gd.restore()
  }
}

class Tree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.paddingTop = 60
    d.contentWidth = d.arr.length * d.conf.itemWidth
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    const levelHeight = d.levelHeight || d.conf.levelHeight

    d.iLeft = 0
    d.contentHeight = 0
    d.translateX = 0

    d.arr.forEach((item, idx) => {
      item.x = idx * d.conf.itemWidth
      item.y = 0
    })

    const setPos = (node, depth) => {
      if (!node) return

      setPos(node.l, depth + 1)
      node.x = d.iLeft
      node.y = depth * levelHeight + d.paddingTop
      d.iLeft += itemWidth / 2
      setPos(node.r, depth + 1)

      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (node.l && node.r) {
        node.x = (node.l.x + node.r.x) / 2
      }
    }

    function updateCoord(node) {
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

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      if (!rootNode) return
      updateCoord(rootNode, 0)
      d.iLeft += itemWidth / 2
    })

    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = (d.contentHeight + itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderItem = (node) => {
      if (!node) return

      renderItem(node.l)
      renderItem(node.r)
      
      ++d.countRender
      this.renderItem(node)
    }

    const renderLine = (node) => {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      ++d.countRender
      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
      gd.strokeStyle = d.color.black
      gd.stroke()
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    d.arr.forEach((item) => {
      this.renderItem(item, {itemWidth: d.conf.itemWidth})
    })
    ;[d.root, d.root2].forEach((rootNode, idx) => {
      renderLine(rootNode)
      renderItem(rootNode)
    })
    gd.restore()
  }
}

class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.maxDepth = 6
    d.contentWidth = 600
    d.contentHeight = 600
    d.canvas.width = d.contentWidth * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = d.contentWidth * d.conf.devicePixelRatio
  }
  create() {}
  setPos() {}
}

class SelectionSort extends Sort {
  startSort() {
    const d = this.d

    for (let i = 0, len = d.arr.length; i < len; i++) {
      let minIndex = i

      d.arr[i].fromIndex = i

      for (let j = i + 1; j < len; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = d.color.green

        if (d.arr[minIndex].n > d.arr[j].n) {
          minIndex = j
        }
      }

      d.arr[i].fillStyle = d.color.orange
      d.arr[minIndex].fillStyle = d.color.blue
      d.arr.swap(i, minIndex)

      d.steps.push(
        new Array(i).fill().concat(
          d.arr.slice(i, len).clone()
        )
      )
    }

    d.steps.push(
      d.arr.clone().map((item, idx) => {
        item.fromIndex = idx
        item.fillStyle = d.color.blue
        return item
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
          d.arr.swap(j - 1, j)
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

    // console.log(d.arr.map(v=>v.n))
    d.steps.push(
      d.arr.clone().map((item, idx) => {
        item.fromIndex = idx
        item.fillStyle = d.color.blue
        return item
      })
    )
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
          d.arr.slice(l, r + 1).clone().map((item) => {
            item.fillStyle = fillStyle
            return item
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

      for (let i = l + 1, len = d.arr.length; i < len; i++) {
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
      d.arr.clone().map((item, idx) => {
        item.fromIndex = idx
        item.fillStyle = d.color.blue
        return item
      })
    )
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
      let j = l

      for (let i = l + 1, len = d.arr.length; i < len; i++) {
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
      d.arr.clone().map((item, idx) => {
        item.fromIndex = idx
        item.fillStyle = d.color.blue
        return item
      })
    )
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
      d.arr.clone().map((item, idx) => {
        item.fromIndex = idx
        item.fillStyle = d.color.blue
        return item
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
    const len = d.arr.length

    for (let i = 1; i < len; i++) {
      this.shiftUp(i)
    }
  }
  shiftUp(k) {
    const d = this.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[j].n > d.arr[k].n) break

      d.arr.swap(j, k)
      k = j
    }
  }
  shiftDown(k) {
    const d = this.d
    const len = d.arr.length

    while (k * 2 + 1 < len) {
      let j = k * 2 + 1

      if (j + 1 < len && d.arr[j + 1].n > d.arr[j].n) j++

      if (d.arr[k].n > d.arr[j].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
}

class SegmentTree extends Heap {
  constructor() {
    super(...arguments)

    const d = this.d

    d.n = 5
    d.itemWidth = 46
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Item(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
  }
  createL() {
    const d = this.d

    function createL(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].fillStyle = d.color.blue
        d.arr[treeIndex].n = '[' + l + ']'
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      createL(treeIndex * 2 + 1, l, mid)
      createL(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].fillStyle = d.color.blue
      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
    }

    createL(0, 0, d.n)
  }
  createR() {
    const d = this.d

    function createR(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].fillStyle = d.color.blue
        d.arr[treeIndex].n = '[' + l + ']'
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      createR(treeIndex * 2 + 1, l, mid - 1)
      createR(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].fillStyle = d.color.blue
      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
    }

    createR(0, 0, d.n)
  }
}

class BinarySearch extends Tree {
  create() {
    const d = this.d

    d.arr.clone().forEach((item, idx) => {
      item.fillStyle = d.color.blue
      d.root = this.add(d.root, item)
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
    d.levelHeight = 60
    d.paddingTop = 80
    d.arr.clone().forEach((item, idx) => {
      item.fillStyle = d.color.blue
      item.h = 1
      item.balanceFactor = 0
      d.root = this.add(d.root, item)
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

    d.arr.clone().forEach((item, idx) => {
      item.fillStyle = d.color.red
      d.root = this.addL(d.root, item)
      d.root.fillStyle = d.color.black
    })
    d.arr.clone().forEach((item, idx) => {
      item.fillStyle = d.color.red
      d.root2 = this.addR(d.root2, item)
      d.root2.fillStyle = d.color.black
    })
  }
  addL(node, item) {
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
    node.l.fillStyle = 
    node.r.fillStyle = d.color.black
  }
}

class Trie extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    d.strArr = d.str.toLowerCase().match(/\w+/g) || []
    d.root = new Item('root', {map: {}, isWord: false})

    d.lineHeight = 14 * 1.5
    d.row = 3
    d.steps = []
    d.lenStep = Math.ceil(d.strArr.length / d.row)

    for (let i = 0, len = d.strArr.length; i < len; i += d.lenStep) {
      d.steps.push(d.strArr.slice(i, i + d.lenStep).join(' '))
    }

    d.paddingTop = d.row * d.lineHeight + d.conf.paddingV
    d.gd.font = d.conf.font
    d.textWidth = d.gd.measureText(d.steps[0]).width
  }
  create() {
    const d = this.d

    d.strArr.forEach((word, idx) => {
      let node = d.root

      for (let i = 0, len = word.length; i < len; i++) {
        const c = word[i]
        node = node.map[c] = node.map[c] || new Item(c, {map: {}, isWord: i === len - 1})
        node.isWord && (node.fillStyle = d.color.blue)
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
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2 + d.conf.itemHeight) * d.conf.devicePixelRatio
  }
  render() {
    const d = this.d
    const {gd, canvas} = d

    const renderText = () => {
      gd.font = d.conf.font
      gd.fillStyle = d.color.black

      d.steps.forEach((str, idx) => {
        ++d.countRender
        gd.fillText(str, (d.contentWidth - d.textWidth) / 2, idx * d.lineHeight + d.conf.paddingV)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      ++d.countRender
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

    const renderItem = (node) => {
      const keys = Object.keys(node.map)

      ++d.countRender
      keys.forEach((key, idx) => {
        renderItem(node.map[key])
      })

      this.renderItem(node)
    }

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderText()
    renderLine(d.root)
    renderItem(d.root)
    gd.restore()
  }
}

class Vicsek extends Fractal {
  constructor() {
    super(...arguments)

    const d = this.d
    d.maxDepth = 4
  }
  render() {
    const d = this.d
    const {canvas, gd} = d
    const dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    const render = (x, y, side, depth) => {
      ++d.countRender

      if (depth >= d.maxDepth) {
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      side /= 3
      dir.forEach((item, idx) => {
        render(x + side * item[1], y + side * item[0], side, depth + 1)
      })
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}

class Sierpinski extends Fractal {
  constructor() {
    super(...arguments)

    const d = this.d
    d.maxDepth = 4
  }
  render() {
    const d = this.d
    const {gd} = d

    const render = (x, y, side, depth) => {
      if (depth >= d.maxDepth) return

      side /= 3
      ++d.countRender
      ++depth

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            render(x + j * side, y + i * side, side, depth)
          }
        }
      }
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}

class SierpinskiTriangle extends Fractal {
  render() {
    const d = this.d
    const {canvas, gd} = d

    const render = (x1, y1, side, depth) => {
      ++d.countRender
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side * Math.cos(d2a(-60))
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth >= d.maxDepth) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = d.color.green
        gd.fill()
        return
      }

      side /= 2
      ++depth

      const h = y1 - y3
      render(x1, y1, side, depth)
      render(x1 + side, y1, side, depth)
      render(x1 + side / 2, y1 - h / 2, side, depth)
    }

    const h = canvas.height
    render(0, h - (h + h * Math.sin(d2a(-60))) / 2, h, 0)
  }
}

class KoachSnowflake extends Fractal {
  render() {
    const d = this.d
    const {canvas, gd} = d
    // d.maxDepth = 2

    const render = (x1, y1, side, deg, depth) => {
      ++d.countRender
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth >= d.maxDepth || side < 5) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.lineTo(x4, y4)
        gd.lineTo(x5, y5)
        gd.strokeStyle = d.color.blue
        gd.stroke()
      } else {
        ++depth
        render(x1, y1, side, deg, depth)
        render(x2, y2, side, deg - 60, depth)
        render(x3, y3, side, deg + 60, depth)
        render(x4, y4, side, deg, depth)
      }
    }

    const side = d.contentWidth * .8 * d.conf.devicePixelRatio
    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    render(d.canvas.width * .1, side / 2, side, 0, 0)
    gd.restore()

    const img = new Image()
    img.onload = (e) => {
      gd.fillStyle = d.color.white
      gd.fillRect(0, 0, canvas.width, canvas.height)

      const len = 3
      const deg = 360 / len
      new Array(len).fill().map((_, idx) => {
        const _deg = idx * deg
        gd.save()
        gd.translate(canvas.width / 2, canvas.height / 2)
        gd.rotate(d2a(_deg))
        gd.drawImage(
          img,
          0, 0, img.width, img.height,
          -img.width / 2, -img.height / 1.585, img.width, img.height
        )
        gd.restore()
      })
    }
    canvas.toBlob((blob) => {
      const src = URL.createObjectURL(blob)
      img.src = src
    })
  }
}

class FractalTree extends Fractal {
  render() {}
  renderTree(args) {
    const d = this.d
    const {canvas, gd} = d

    d.maxDepth = 10
    d.canvas.height -= 120 * d.conf.devicePixelRatio

    const render = (x1, y1, side, deg, degL, degR, depth) => {
      if (depth >= d.maxDepth || side < 2) return

      ++d.countRender

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      render(x2, y2, side * .75, deg + degL, degL, degR, depth + 1)
      render(x2, y2, side * .75, deg + degR, degL, degR, depth + 1)
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    render(d.contentWidth / 2, canvas.height / d.conf.devicePixelRatio, 120, ...args)
    gd.restore()
  }
}

class Fib extends Common {
  constructor() {
    super(...arguments)
  }
  create() {
    const d = this.d
    d.fib = this.getFibArr(15)
    d.canvas.width = d.fib[d.fib.length - 1]
    d.canvas.height = d.fib[d.fib.length - 2]
  }
  getFibArr(end) {
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
  setPos() {
    const d = this.d
  }
  render() {
    const d = this.d
    const {gd} = d
    let cx = d.fib[d.fib.length - 2]
    let cy = d.fib[d.fib.length - 2]

    for (let len = d.fib.length, i = len - 1; i > 1; i--) {
      const _i = (len - i + 1) % 4
      const deg = _i * 90
      const r = d.fib[i - 1]

      gd.beginPath()
      gd.lineTo(cx, cy)
      gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      gd.closePath()
      gd.stroke()

      switch (_i) {
        case 0:
          // 右
          cy += d.fib[i - 3]
          break
        case 1:
          // 下
          cx -= d.fib[i - 3]
          break
        case 2:
          // 左
          cy -= d.fib[i - 3]
          break
        case 3:
          // 上
          cx += d.fib[i - 3]
          break
      }
    }
  }
}

class Algo {
  constructor(d = {}) {
    this.d = d

    d.type = {
      list: [
        {name: '斐波那契数列', cons: Fib, startFn: 'create'},
        // {name: '分形图 - FractalTree', cons: FractalTree, startFn: 'renderTree', args: [-90, -10, 30, 0]},
        // {name: '分形图 - FractalTree', cons: FractalTree, startFn: 'renderTree', args: [-90, 20, -20, 0]},
        // {name: '分形图 - KoachSnowflake', cons: KoachSnowflake, startFn: 'create'},
        // {name: '分形图 - SierpinskiTriangle', cons: SierpinskiTriangle, startFn: 'create'},
        // {name: '分形图 - Sierpinski', cons: Sierpinski, startFn: 'create'},
        // {name: '分形图 - Vicsek', cons: Vicsek, startFn: 'create'},
        // {name: 'Trie', cons: Trie, startFn: 'create'},
        // {name: '红黑树 (L&R)', cons: RBTree, startFn: 'create'},
        // {name: 'AVL树', cons: AVLTree, startFn: 'create'},
        // {name: '二分搜索树-镜像反转', cons: BinarySearch, startFn: 'create'},
        // {name: '线段树 - R', cons: SegmentTree, startFn: 'createR'},
        // {name: '线段树 - L', cons: SegmentTree, startFn: 'createL'},
        // {name: '最大堆-shiftUp', cons: MaxHeap, startFn: 'createByShiftUp'},
        // {name: '最大堆-heapify', cons: MaxHeap, startFn: 'heapify'},
        // {name: '三路排序', cons: QuickSort3, startFn: 'startSort'},
        // {name: '双路排序', cons: QuickSort2, startFn: 'startSort'},
        // {name: '单路排序', cons: QuickSort, startFn: 'startSort'},
        // {name: '归并排序', cons: MergeSort, startFn: 'startSort'},
        // {name: '插入排序', cons: InsertionSort, startFn: 'startSort'},
        // {name: '选择排序', cons: SelectionSort, startFn: 'startSort'},
      ]
    }

    d.cons = {
      list: [],
      map: {},
    }

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section>
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
    let randArr = [].rnd(len, 1)
    randArr = randArr.map(n => new Item(n))

    nodeList.querySelectorAll('canvas').forEach((canvas, idx) => {
      const typeItem = d.type.list[idx]
      // console.time(typeItem.cons.name)
      const o = new typeItem.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        color: Algo.color,
        conf: Algo.conf,
        typeItem: typeItem,
      })

      d.cons.list.push(o)
      d.cons.map[typeItem.name] = o
      o[typeItem.startFn](typeItem.args)
      o.setPos()
      o.render()
      o.log && o.log()
      // console.timeEnd(typeItem.cons.name)
    })
  }
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
  Item,
  Common,
  Sort,
  Heap,
  Tree,
  Fractal,
  SelectionSort,
  InsertionSort,
  MergeSort,
  QuickSort,
  QuickSort2,
  QuickSort3,
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
  Algo
}

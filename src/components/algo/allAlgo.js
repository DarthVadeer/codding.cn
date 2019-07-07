class Node {
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
  constructor(d= {}) {
    this.d = d

    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  renderNode(node, arg = {}) {
    if (!node) return

    const d = this.d
    const {gd} = d
    const itemWidth = node.width || arg.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = node.height || arg.itemHeight || d.itemHeight || d.conf.itemHeight
    const x = arg.itemWidth ? node.x : node.x - (itemWidth - (d.itemWidth || d.conf.itemWidth)) / 2

    gd.save()
    gd.beginPath()
    gd.globalAlpha = .75
    gd.rect(x + 1, node.y, itemWidth - 2, itemHeight)
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.font = d.conf.font
    gd.fillStyle = d.color.white
    gd.fillText(node.n, x + itemWidth / 2, node.y + itemHeight / 2)

    if ('balanceFactor' in node) {
      gd.textBaseline = 'bottom'
      gd.textAlign = 'center'
      gd.fillStyle = d.color.black

      ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, node.x + itemWidth / 2, (idx - arr.length + 1) * itemHeight + node.y)
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
  SelectionSort() {
    const d = this.d

    for (let i = 0, len = d.arr.length; i < len; i++) {
      let minIndex = i

      d.arr[i].fromIndex = i

      for (let j = i + 1; j < len; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = d.color.green

        if (d.arr[j].n < d.arr[minIndex].n) {
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
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  InsertionSort() {
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
  MergeSort() {
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
          d.arr[k] = aux[j++ - l]
        } else if (j > r) {
          d.arr[k] = aux[i++ - l]
        } else if (aux[i - l].n <= aux[j - l].n) {
          d.arr[k] = aux[i++ - l]
        } else {
          d.arr[k] = aux[j++ - l]
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
  QuickSort1() {
    const d = this.d

    const quickSort = (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let j = l

      for (let i = l + 1; i <= r; i++) {
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
  QuickSort2() {
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
  QuickSort3() {
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
  setPos() {
    const d = this.d

    d.steps.forEach((row, stair) => {
      row.forEach((node, idx) => {
        if (!node) return
        node.x = idx * d.conf.itemWidth
        node.y = stair * d.conf.levelHeight
      })
    })

    d.contentHeight = (d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderLine = () => {
      d.steps.last().forEach((node, idx) => {
        if (!node) return

        let stair = d.steps.length

        gd.beginPath()

        while (--stair > -1) {
          const _node = d.steps[stair][node.fromIndex]
          if (!_node) continue
          node = _node
          gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
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
    d.contentWidth = Math.pow(2, d.level - 1) * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.contentHeight = (d.level - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
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
  setPos() {
    const d = this.d
    let count = 0

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

    const renderLine = () => {
      for (let i = d.branchIndex; i > -1; i--) {
        const node = d.arr[i]
        const nodeL = d.arr[i * 2 + 1]
        const nodeR = d.arr[i * 2 + 2]

        gd.beginPath()
        nodeL && gd.lineTo(nodeL.x + d.conf.itemWidth / 2, nodeL.y + d.conf.itemHeight / 2)
        gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
        nodeR && gd.lineTo(nodeR.x + d.conf.itemWidth / 2, nodeR.y + d.conf.itemHeight / 2)
        gd.stroke()
      }
    }

    const renderNode = () => {
      d.arr.forEach((node, idx) => {
        this.renderNode(node)
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

class SegmentTree extends Heap {
  constructor() {
    super(...arguments)

    const d = this.d

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 1) / 2)

    d.contentWidth = Math.pow(2, d.level - 1) * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'

    d.contentHeight = (d.level - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  createL() {
    const d = this.d

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

class Tree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.paddingTop = 60
    d.paddingH = 30
  }
  Binary(arg = {}) {
    const d = this.d

    const add = (node, item) => {
      if (!node) return item

      if (item.n > node.n) {
        node.r = add(node.r, item)
      } else if (item.n < node.n) {
        node.l = add(node.l, item)
      } else {
        // ===
      }

      return node
    }

    d.arr.clone().forEach((node, idx) => {
      node.fillStyle = d.color.blue
      d.root = add(d.root, node)
    })
    
    delete d.paddingH
  }
  BinaryFlip(arg = {}) {
    const d = this.d

    this.Binary(arg)
    d.paddingH = 30
    d.root2 = this.flip(clone(d.root))
  }
  AVL() {
    const d = this.d

    d.paddingTop = 100
    d.paddingH = d.conf.paddingH
    d.levelHeight = 60
    d.itemWidth = 50

    const add = (node, item) => {
      if (!node) return item

      if (item.n > node.n) {
        node.r = add(node.r, item)
      } else if (item.n < node.n) {
        node.l = add(node.l, item)
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

    d.arr.clone().forEach((node, idx) => {
      node.fillStyle = d.color.blue
      node.h = 1
      node.balanceFactor = 0
      d.root = add(d.root, node)
    })
  }
  RB() {
    const d = this.d

    const addL = (node, item) => {
      if (!node) return item

      if (item.n > node.n) {
        node.r = addL(node.r, item)
      } else if (item.n < node.n) {
        node.l = addL(node.l, item)
      } else {
        // ===
      }

      if (!this.isRed(node.l) && this.isRed(node.r)) {
        node = this.leftRotate(node)
      }

      if (this.isRed(node.l) &&　this.isRed(node.l.l)) {
        node = this.rightRotate(node)
      }

      if (this.isRed(node.l) && this.isRed(node.r)) {
        this.flipColors(node)
      }

      return node
    }

    const addR = (node, item) => {
      if (!node) return item

      if (item.n > node.n) {
        node.r = addR(node.r, item)
      } else if (item.n < node.n) {
        node.l = addR(node.l, item)
      } else {
        // ===
      }

      if (this.isRed(node.l) && !this.isRed(node.r)) {
        node = this.rightRotate(node)
      }

      if (this.isRed(node.r) &&　this.isRed(node.r.r)) {
        node = this.leftRotate(node)
      }

      if (this.isRed(node.l) && this.isRed(node.r)) {
        this.flipColors(node)
      }

      return node
    }

    d.arr.clone().forEach((node, idx) => {
      node.fillStyle = d.color.red
      d.root = addL(d.root, node)
      d.root.fillStyle = d.color.black
    })

    d.arr.clone().forEach((node, idx) => {
      node.fillStyle = d.color.red
      d.root2 = addR(d.root2, node)
      d.root2.fillStyle = d.color.black
    })
  }
  getHeight(node) {
    return node ? node.h : 0
  }
  getBalanceFactor(node) {
    return node ? this.getHeight(node.l) - this.getHeight(node.r) : 0
  }
  isRed(node) {
    const d = this.d
    return node ? node.fillStyle === d.color.red : false
  }
  flipColors(node) {
    const d = this.d
    node.fillStyle = d.color.red
    node.l.fillStyle = node.r.fillStyle = d.color.black
  }
  leftRotate(x) {
    const d = this.d
    const y = x.r

    x.r = y.l
    y.l = x

    if ('balanceFactor' in x) {
      x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
      y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

      x.balanceFactor = this.getBalanceFactor(x)
      y.balanceFactor = this.getBalanceFactor(y)
    } else {
      y.fillStyle = x.fillStyle
      x.fillStyle = d.color.red
    }

    return y
  }
  rightRotate(x) {
    const d = this.d
    const y = x.l

    x.l = y.r
    y.r = x

    if ('balanceFactor' in x) {
      x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
      y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

      x.balanceFactor = this.getBalanceFactor(x)
      y.balanceFactor = this.getBalanceFactor(y)
    } else {
      y.fillStyle = x.fillStyle
      x.fillStyle = d.color.red
    }

    return y
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
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    const levelHeight = d.levelHeight || d.conf.levelHeight

    d.iLeft = 0
    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + (d.paddingH || d.conf.paddingH) * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.contentHeight = 0

    d.arr.forEach((node, idx) => {
      node.x = idx * d.conf.itemWidth
      node.y = 0
    })

    const setPos = (node, depth) => {
      if (!node) return

      setPos(node.l, depth + 1)
      node.x = d.iLeft
      d.iLeft += itemWidth / 2
      node.y = depth * levelHeight + d.paddingTop
      setPos(node.r, depth + 1)

      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (node.l && node.r) {
        node.x = (node.l.x + node.r.x) / 2
      }
    }

    const updateCoord = (node) => {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

      node.x += d.translateX
    }

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      setPos(rootNode, 0)
      d.iLeft += itemWidth / 2
      idx === 0 && d.root2 && (d.iLeft += itemWidth / 2)
    })

    d.translateX = (d.contentWidth - d.iLeft) / 2
    !d.root2 && (d.translateX += itemWidth / 4)

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      updateCoord(rootNode)
    })

    d.canvas.height = (d.contentHeight + itemHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderLine = (node) => {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
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
    gd.translate((d.paddingH || d.conf.paddingH), d.conf.paddingV)
    d.arr.forEach(node => this.renderNode(node, {itemWidth: d.conf.itemWidth}))
    ;[d.root, d.root2].forEach((rootNode, idx) => {
      renderLine(rootNode)
      renderNode(rootNode)
    })
    gd.restore()
  }
}

class Trie extends Common {
  create() {
    const d = this.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda new news`
    d.arr = d.str.toLowerCase().match(/\w+/g) || []
    d.root = new Node('root', {map: {}, isWord: false})
    d.arr.forEach((str, idx) => {
      let node = d.root

      for (let i = 0, len = str.length; i < len; i++) {
        const c = str[i]
        node = node.map[c] = node.map[c] || new Node(c, {map: {}, isWord: i === len - 1})
        node.fillStyle = d.color[node.isWord ? 'blue' : 'black']
      }
    })

    d.row = 3
    d.steps = []
    d.strArr = d.str.split(/\s+/g)
    d.lenStep = Math.ceil(d.strArr.length / d.row)
    d.paddingTop = d.row * d.conf.itemHeight + d.conf.paddingV

    for (let i = 0; i < d.strArr.length; i += d.lenStep) {
      d.steps.push(d.strArr.slice(i, i + d.lenStep).join(' '))
    }

    d.gd.font = d.conf.font
    d.textWidth = d.gd.measureText(d.steps[0]).width
  }
  setPos() {
    const d = this.d

    d.iLeft = 0
    d.contentHeight = 0

    const setPos = (node, depth) => {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        setPos(node.map[key], depth + 1)
      })

      node.x = d.iLeft
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.contentHeight = Math.max(d.contentHeight, node.y + d.conf.itemHeight)

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
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        const _node = node.map[key]

        gd.beginPath()
        gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
        gd.lineTo(_node.x + d.conf.itemWidth / 2, _node.y + d.conf.itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()

        renderLine(_node)
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
    d.steps.forEach((str, idx) => {
      gd.textBaseline = 'top'
      gd.textAlign = 'left'
      gd.font = d.conf.font
      gd.fillText(str, (d.contentWidth - d.textWidth) / 2, idx * d.conf.itemHeight)
    })
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}

class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.depth = 4
    d.renderCount = 0
    d.contentWidth = 600
    d.contentHeight = 600
    d.canvas.width = d.contentWidth * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = d.contentHeight * d.conf.scale
  }
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
  Fib(arg = {}) {
    this.d = Object.assign(this.d, arg)

    const d = this.d
    const {canvas, gd} = d

    d.fib = this.getFibList(15)
    d.contentWidth = d.fib[d.fib.length - 1]
    d.contentHeight = d.fib[d.fib.length - 2]

    canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    canvas.style.width = canvas.width / d.conf.scale + 'px'
    canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale

    let cx = d.fib[d.fib.length - 2]
    let cy = d.fib[d.fib.length - 2]

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)

    for (let len = d.fib.length, i = len - 1; i > 2; i--) {
      const _i = (len - i + 1) % 4
      const deg = _i * 90
      const r = d.fib[i - 1]

      ++d.renderCount
      gd.beginPath()
      if (d.isRenderAux) {
        gd.lineTo(cx, cy)
        gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
        gd.lineTo(cx, cy)
        gd.closePath()
      } else {
        gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      }
      gd.stroke()

      switch (_i) {
        case 0:
          cy += d.fib[i - 3]
          break
        case 1:
          cx -= d.fib[i - 3]
          break
        case 2:
          cy -= d.fib[i - 3]
          break
        case 3:
          cx += d.fib[i - 3]
          break
      }
    }

    gd.restore()
  }
  Vicsek() {
    const d = this.d
    const {gd} = d

    d.dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 1) {
        // 到达极限 -> 绘制
        ++d.renderCount
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
      } else {
        // 递归
        ++depth
        side /= 3
        d.dir.forEach((item, idx) => {
          render(x + side * item[1], y + side * item[0], side, depth)
        })
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  Sierpinski() {
    const d = this.d
    const {gd} = d

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 2) return

      ++depth
      side /= 3

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            // 绘制
            ++d.renderCount
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            // 递归
            render(x + j * side, y + i * side, side, depth)
          }
        }
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  SierpinskiTriangle() {
    const d = this.d
    const {gd} = d

    d.depth = 6

    const render = (x1, y1, side, depth) => {
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side * Math.cos(d2a(-60))
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth >= d.depth || side < 2) {
        // 递归到底 -> 绘制
        ++d.renderCount
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = d.color.cyan
        gd.fill()
      } else {
        ++depth
        side /= 2
        render(x1, y1, side, depth)
        render(x1 + side, y1, side, depth)
        render(x1 + side / 2, (y1 + y3) / 2, side, depth)
      }
    }

    const space = (d.contentHeight - d.contentHeight * Math.sin(d2a(60))) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, d.contentHeight - space, d.contentWidth, 0)
    gd.restore()
  }
  KoachSnowflake() {
    const d = this.d
    const {canvas, gd} = d

    d.depth = 5

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
        ++d.renderCount
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
    render(d.contentWidth * .1, d.contentHeight / 3.72, d.contentWidth * .8, 0, 0)
    gd.restore()

    const _canvas = canvas.cloneNode()
    // document.body.insertBefore(_canvas, document.body.children[0])
    _canvas.getContext('2d').drawImage(
      canvas,
      0, 0, canvas.width, canvas.height
    )

    gd.clearRect(0, 0, canvas.width, canvas.height)
    new Array(3).fill().forEach((_, idx, arr) => {
      const deg = 360 / arr.length * idx

      gd.save()
      gd.translate(canvas.width / 2, canvas.height / 2)
      gd.rotate(d2a(deg))
      gd.drawImage(
        _canvas,
        0, 0, canvas.width, canvas.height,
        -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height,
      )
      gd.restore()
    })
  }
  FractalTree(arg = {}) {
    const d = this.d
    const {canvas, gd} = d

    d.depth = arg.depth || 12

    const render = (x1, y1, side, deg, depth) => {
      if (depth >= d.depth || side < 2) return

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      ++d.renderCount
      ++depth
      side *= .8

      render(x2, y2, side, deg + (arg.degL || -15), depth)
      render(x2, y2, side, deg + (arg.degR || 15), depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(
      d.contentWidth / 2 + (arg.translateX || 0),
      d.contentHeight + (arg.translateY || 0),
      arg.side || 100,
      -90,
      0
    )
    gd.restore()
  }
  NearOne() {
    const d = this.d
    const {gd} = d
    const fillStyle = rgba(
      0x00,
      0xBC,
      0xD4,
      1
    )
    
    d.depth = 8

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 1) return

      const isH = depth % 2 === 0
      const w = side / (isH ? 2 : 1)

      gd.beginPath()
      gd.rect(x, y, w, side)
      fillStyle.a = (d.depth - depth) / d.depth
      gd.fillStyle = fillStyle.toString()
      gd.fill()
      
      gd.strokeStyle = d.color.black
      gd.stroke()

      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.font = (side / 10) + 'px Arial'
      gd.fillStyle = d.color.black
      gd.fillText('1/' + Math.pow(2, depth + 1), x + w / 2, y + side / 2)

      ++depth
      isH ? 
      render(x + side / 2, y + side / 2, side / 2, depth) :
      render(x, y - side, side, depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  setPos() {
    const d = this.d
  }
  render() {
    const d = this.d
  }
  /*log() {
    const d = this.d
    console.log('%c renderCount ' + d.renderCount, 'color: red', d.typeItem.name)
  }*/
}

class Maze extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.isRenderVisited = true
    d.itemWidth = 6
    d.mazeData = typeof mazeData ===  "undefined" ? require('./mazeData').default : mazeData
    d.mazeData = d.mazeData.split('\n').map(row => row.split('').map(c => new Node(c)))
    d.contentWidth = d.mazeData[0].length * d.itemWidth
    d.contentHeight = d.mazeData.length * d.itemWidth
    d.canvas.width = d.contentWidth
    d.canvas.style.width = ''
    d.canvas.height = d.contentHeight
    d.wall = '#'
    d.road = ' '
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
  }
  inArea(y, x) {
    return (
      y >= 0 && y < this.d.mazeData.length && 
      x >= 0 && x < this.d.mazeData[0].length
    )
  }
  findPath(p) {
    const d = this.d

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
  }
  dfs1() {
    const d = this.d

    const dfs = (p) => {
      const node = d.mazeData[p.y][p.x]

      node.visited = true
      node.isPath = true

      if (p.x === d.exit.x && p.y === d.exit.y) return true

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          if (dfs({x: newX, y: newY})) {
            return true
          }
        }
      }

      node.isPath = false
      return false
    }

    dfs(d.enter)
  }
  dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()

      const node = d.mazeData[p.y][p.x]

      node.visited = true
      node.isPath = true

      if (p.x === d.exit.x && p.y === d.exit.y) break

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

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

      node.isPath = false
    }

    this.findPath(p)
  }
  bfs() {
    const d = this.d
    const queue = [d.enter]
    let p

    while (queue.length > 0) {
      p = queue.shift()

      const node = d.mazeData[p.y][p.x]

      node.visited = true
      node.isPath = true

      if (p.x === d.exit.x && p.y === d.exit.y) break

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

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

      node.isPath = false
    }

    this.findPath(p)
  }
  generateInit() {
    const d = this.d

    d.row = 71
    d.col = 71

    d.mazeData = new Array(d.row).fill().map((_, idxRow) => {
      return new Array(d.col).fill().map((_, idxCol) => {
        return new Node(idxRow % 2 === 1 && idxCol % 2 === 1 ? d.road : d.wall)
      })
    })

    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    d.isRenderVisited = false
    d.canvas.width = d.col * d.itemWidth
    d.canvas.height = d.row * d.itemWidth
    d.mazeData[d.enter.y][d.enter.x].n = d.road
    d.mazeData[d.exit.y][d.exit.x].n = d.road
  }
  generateDfs1() {
    const d = this.d

    this.generateInit()

    const dfs = (p) => {
      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          dfs({
            x: newX,
            y: newY,
          })
        }
      }
    }

    dfs({x: 1, y: 1})
  }
  generateDfs2() {
    const d = this.d
    const stack = [{x: 1, y: 1}]

    this.generateInit()

    while (stack.length > 0) {
      const p = stack.pop()

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0] * 2
        const newX = p.x + d.dir[i][1] * 2

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited
        ) {
          stack.push({x: newX, y: newY})
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
        }
      }
    }
  }
  generateBfs() {
    const d = this.d
    const queue = [{x: 1, y: 1}]

    this.generateInit()

    while (queue.length > 0) {
      const p = queue.shift()

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0] * 2
        const newX = p.x + d.dir[i][1] * 2

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited
        ) {
          queue.push({x: newX, y: newY})
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
        }
      }
    }
  }
  generateRand() {
    const d = this.d
    const queue = [{x: 1, y: 1}]

    this.generateInit()

    while (queue.length > 0) {
      const p = queue[Math.random() < .5 ? 'pop' : 'shift']()
      // const p = queue.pop()

      for (let i = 0; i < 4; i++) {
        const newY = p.y + d.dir[i][0] * 2
        const newX = p.x + d.dir[i][1] * 2

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited
        ) {
          queue[Math.random() < .5 ? 'unshift' : 'push']({x: newX, y: newY})
          // queue.push({x: newX, y: newY})
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
        }
      }
    }

    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.visited = false
      })
    })
    this.bfs()

    /*console.log(d.mazeData.map((row) => {
      return row.map((node) => {
        return node.n
      }).join('')
    }).join('\n'))*/
  }
  setPos() {
    const d = this.d
  }
  render() {
    const d = this.d
    const {gd} = d

    d.mazeData.forEach((row, stair) => {
      row.forEach((node, idx) => {
        gd.beginPath()
        gd.rect(idx * d.itemWidth, stair * d.itemWidth, d.itemWidth, d.itemWidth)
        gd.fillStyle = d.color[node.n === '#' ? 'blue' : (node.isPath ? 'red' : (node.visited ? (d.isRenderVisited ? 'yellow' : 'white') : 'white'))]
        gd.fill()
      })
    })
  }
}

class Algo {
  constructor(d = {}) {
    this.d = d

    const allAlgo = {
      Maze, Fractal, Trie, Tree, SegmentTree, Heap, Sort
    }

    d.cons = {
      map: {}
    }

    d.type = {
      list: [
        {name: '迷宫创建 - 随机队列', cons: 'Maze', startFn: 'generateRand', arg: {}},
        {name: '迷宫创建 - 广度优先 - 非递归', cons: 'Maze', startFn: 'generateBfs', arg: {}},
        {name: '迷宫创建 - 深度优先 - 非递归', cons: 'Maze', startFn: 'generateDfs2', arg: {}},
        {name: '迷宫创建 - 深度优先 - 递归', cons: 'Maze', startFn: 'generateDfs1', arg: {}},
        {name: '迷宫寻路 - 广度优先 - 非递归', cons: 'Maze', startFn: 'bfs', arg: {}},
        {name: '迷宫寻路 - 深度优先 - 非递归', cons: 'Maze', startFn: 'dfs2', arg: {}},
        {name: '迷宫寻路 - 深度优先 - 递归', cons: 'Maze', startFn: 'dfs1', arg: {}},
        {name: '分形图 - 1/2 + 1/4 ... 1/n ≈ 1', cons: 'Fractal', startFn: 'NearOne', arg: {}},
        {name: '分形图 - FractalTree', cons: 'Fractal', startFn: 'FractalTree', arg: {side: 120, translateX: -80, degL: -5, degR: 20}},
        {name: '分形图 - FractalTree', cons: 'Fractal', startFn: 'FractalTree', arg: {side: 120}},
        {name: '分形图 - KoachSnowflake', cons: 'Fractal', startFn: 'KoachSnowflake', arg: {}},
        {name: '分形图 - SierpinskiTriangle', cons: 'Fractal', startFn: 'SierpinskiTriangle', arg: {}},
        {name: '分形图 - Sierpinski', cons: 'Fractal', startFn: 'Sierpinski', arg: {}},
        {name: '分形图 - Vicsek', cons: 'Fractal', startFn: 'Vicsek', arg: {}},
        {name: '分形图 - 斐波那契数列', cons: 'Fractal', startFn: 'Fib', arg: {}},
        {name: 'Trie', cons: 'Trie', startFn: 'create', arg: {}},
        {name: '红黑树', cons: 'Tree', startFn: 'RB', arg: {}},
        {name: 'AVL树', cons: 'Tree', startFn: 'AVL', arg: {}},
        {name: '二分搜索树 - 镜像反转', cons: 'Tree', startFn: 'BinaryFlip', arg: {}},
        {name: '二分搜索树', cons: 'Tree', startFn: 'Binary', arg: {}},
        {name: '线段树 - R', cons: 'SegmentTree', startFn: 'createR', arg: {}},
        {name: '线段树 - L', cons: 'SegmentTree', startFn: 'createL', arg: {}},
        {name: '最大堆 - shiftUp', cons: 'Heap', startFn: 'createByShiftUp', arg: {}},
        {name: '最大堆 - heapify', cons: 'Heap', startFn: 'heapify', arg: {}},
        {name: '三路快排 - QuickSort3', cons: 'Sort', startFn: 'QuickSort3', arg: {}},
        {name: '双路快排 - QuickSort2', cons: 'Sort', startFn: 'QuickSort2', arg: {}},
        {name: '单路快排 - QuickSort1', cons: 'Sort', startFn: 'QuickSort1', arg: {}},
        {name: '归并排序 - MergeSort', cons: 'Sort', startFn: 'MergeSort', arg: {}},
        {name: '插入排序 - InsertionSort', cons: 'Sort', startFn: 'InsertionSort', arg: {}},
        {name: '选择排序 - SelectionSort', cons: 'Sort', startFn: 'SelectionSort', arg: {}},
      ]
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
    let randArr = [].rnd(len, 1, len * 5)
    // randArr = new Array(len).fill().map((_, idx) => idx)
    randArr = randArr.map(n => new Node(n))

    document.querySelectorAll('#box-algo > .list canvas').forEach((canvas, idx) => {
      const typeItem = d.type.list[idx]
      // console.time(typeItem.name)
      const o = new allAlgo[typeItem.cons]({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        conf: Algo.conf,
        color: Algo.color,
        typeItem,
      })

      d.cons.map[typeItem.startFn] = o
      o[typeItem.startFn](typeItem.arg)
      o.setPos()
      o.render()
      o.log && o.log()
      // console.timeEnd(typeItem.name)
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
  // scale: devicePixelRatio,
  scale: 2,
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
  blueGrey: '#607D8B',
  grey: '#9E9E9E',
  black: '#000000',
  white: '#FFFFFF',
}

export default {
  Node,
  Common,
  Sort,
  Heap,
  SegmentTree,
  Tree,
  Trie,
  Fractal,
  Maze,
  Algo
}
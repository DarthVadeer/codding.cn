class Node {
  constructor(n, o) {
    o = {
      n,
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
  }
  renderNode(node, o = {}) {
    if (!node) return

    const d = this.d
    const {gd} = d
    const itemWidth = node.width || o.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = node.height || o.itemHeight || d.itemHeight || d.conf.itemHeight
    const x = node.width ? node.x - (o.itemWidth || d.itemWidth || d.conf.itemWidth) / 2 : node.x

    gd.save()
    gd.globalAlpha = .8
    gd.beginPath()
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
      gd.fillStyle = d.color.black

      ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, node.x + itemWidth / 2, (idx - arr.length + 1) * 16 + node.y)
      })
    }
  }
}

class Sort extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.arr.forEach(node => node.strokeStyle = randColor().toString())
    d.steps = [d.arr.clone()]
  }
  SelectionSort() {
    const d = this.d
  
    for (let i = 0, len = d.arr.length; i < len; i++) {
      let minIndex = i

      for (let j = i + 1; j < len; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = d.color.green

        if (d.arr[j].n < d.arr[minIndex].n) {
          minIndex = j
        }
      }

      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = d.color.orange
      d.arr[minIndex].fillStyle = d.color.blue
      d.arr.swap(i, minIndex)
      d.steps.push(
        Array(i).fill().concat(
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

    for (let i = 0, len = d.arr.length; i < len; i++) {
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
        Array(j).fill().concat(
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

    const mergeSort = (l, r) => {
      if (l >= r) return

      const mid = l + parseInt((r - l) / 2)
      mergeSort(l, mid)
      mergeSort(mid + 1, r)

      const aux = Array(r - l + 1).fill()

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
        } else if (aux[i - l].n < aux[j - l].n) {
          d.arr[k] = aux[i++ - l]
        } else {
          d.arr[k] = aux[j++ - l]
        }
      }

      const fillStyle = d.color[l === 0 && r === d.arr.length - 1 ? 'blue' : 'green']

      d.steps.push(
        Array(l).fill().concat(
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

      for (let i = l; i <= r; i++) d.arr[i].fromIndex = i

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
        Array(l).fill().concat(
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

      for (let i = l; i <= r; i++) d.arr[i].fromIndex = i

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
        Array(l).fill().concat(
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

      for (let i = l; i <= r; i++) d.arr[i].fromIndex = i

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
        Array(l).fill().concat(
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

    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.contentHeight = (d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    const renderLine = () => {
      d.steps.forEach((row, stair) => {
        stair > 0 && row.forEach((from, idx) => {
          if (!from) return

          let _stair = stair
          let to

          while (!to) {
            to = d.steps[--_stair][from.fromIndex]
          }

          gd.beginPath()
          gd.lineTo(from.x + itemWidth / 2 + .5, from.y + itemHeight / 2)
          gd.lineTo(to.x + itemWidth / 2 + .5, to.y + itemHeight / 2)
          gd.strokeStyle = from.strokeStyle
          gd.stroke()
        })
      })
    }

    const renderNode = () => {
      d.steps.forEach((row, stair) => {
        row.forEach((node, idx) => {
          this.renderNode(node)
        })
      })
    }

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)
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
  shiftUp(k) {
    const d = this.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[j].n > d.arr[k].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
  SegmentTreeL() {
    const d = this.d

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.gd.font = d.conf.font

    const create = (treeIndex, l, r) => {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + parseInt((r - l) / 2)
      create(treeIndex * 2 + 1, l, mid)
      create(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].width = Math.max(d.conf.itemWidth, d.gd.measureText(d.arr[treeIndex].n).width + 10)
      d.arr[treeIndex].fillStyle = d.color.blue
    }

    create(0, 0, d.n)
  }
  SegmentTreeR() {
    const d = this.d

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.gd.font = d.conf.font

    const create = (treeIndex, l, r) => {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      create(treeIndex * 2 + 1, l, mid - 1)
      create(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].width = Math.max(d.conf.itemWidth, d.gd.measureText(d.arr[treeIndex].n).width + 10)
      d.arr[treeIndex].fillStyle = d.color.blue
    }

    create(0, 0, d.n)
  }
  setPos() {
    const d = this.d
    let count = 0

    d.contentWidth = Math.pow(2, d.level - 1) * d.conf.itemWidth
    d.contentHeight = (d.level - 1) * d.conf.levelHeight + d.conf.itemHeight
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale

    for (let i = 0; i < d.level; i++) {
      const n = Math.pow(2, i)
      const perW = d.contentWidth / n

      for (let j = 0; j < n && count + j < d.arr.length; j++) {
        const index = count + j
        const node = d.arr[index]

        node.x = perW * j + perW / 2 - d.conf.itemWidth / 2
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
        gd.strokeStyle = d.color.black
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

class Tree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.paddingTop = 60
  }
  Binary() {
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
  }
  BinaryFlip() {
    const d = this.d

    const flip = (node) => {
      if (!node) return

      flip(node.l)
      flip(node.r)

      const t = node.l
      node.l = node.r
      node.r = t
    }

    this.Binary()
    d.root2 = clone(d.root)
    flip(d.root2)
  }
  AVL() {
    const d = this.d

    d.paddingTop = 100
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

      const balanceFactor = getBalanceFactor(node)

      if (Math.abs(balanceFactor) > 1) {
        if (balanceFactor > 0) {
          if (getBalanceFactor(node.l) < 0) {
            node.l = leftRotate(node.l)
          }
          node = rightRotate(node)
        } else {
          if (getBalanceFactor(node.r) > 0) {
            node.r = rightRotate(node.r)
          }
          node = leftRotate(node)
        }
      }

      node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1
      node.balanceFactor = getBalanceFactor(node)

      return node
    }

    const getHeight = (node) => {
      return node ? node.h : 0
    }

    const getBalanceFactor = (node) => {
      return node ? getHeight(node.l) - getHeight(node.r) : 0
    }

    const leftRotate = (x) => {
      const y = x.r

      x.r = y.l
      y.l = x

      x.h = Math.max(getHeight(x.l), getHeight(x.r)) + 1
      y.h = Math.max(getHeight(y.l), getHeight(y.r)) + 1

      x.balanceFactor = getBalanceFactor(x)
      y.balanceFactor = getBalanceFactor(y)

      return y
    }

    const rightRotate = (x) => {
      const y = x.l

      x.l = y.r
      y.r = x

      x.h = Math.max(getHeight(x.l), getHeight(x.r)) + 1
      y.h = Math.max(getHeight(y.l), getHeight(y.r)) + 1

      x.balanceFactor = getBalanceFactor(x)
      y.balanceFactor = getBalanceFactor(y)

      return y
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

      if (!isRed(node.l) && isRed(node.r)) {
        node = leftRotate(node)
      }

      if (isRed(node.l) && isRed(node.l.l)) {
        node = rightRotate(node)
      }

      if (isRed(node.l) && isRed(node.r)) {
        flipColors(node)
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

      if (isRed(node.l) && !isRed(node.r)) {
        node = rightRotate(node)
      }

      if (isRed(node.r) && isRed(node.r.r)) {
        node = leftRotate(node)
      }

      if (isRed(node.l) && isRed(node.r)) {
        flipColors(node)
      }

      return node
    }

    const isRed = (node) => {
      return node ? node.fillStyle === d.color.red : false
    }

    const flipColors = (node) => {
      node.l.fillStyle = node.r.fillStyle = d.color.black
      node.fillStyle = d.color.red
    }

    const leftRotate = (x) => {
      const y = x.r

      x.r = y.l
      y.l = x

      y.fillStyle = x.fillStyle
      x.fillStyle = d.color.red

      return y
    }

    const rightRotate = (x) => {
      const y = x.l

      x.l = y.r
      y.r = x

      y.fillStyle = x.fillStyle
      x.fillStyle = d.color.red

      return y
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
  setPos() {
    const d = this.d
    const levelHeight = d.levelHeight || d.conf.levelHeight
    const itemWidth = d.itemWidth || d.conf.itemWidth

    d.iLeft = 0
    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.contentHeight = 0

    d.arr.forEach((node, idx) => {
      node.x = idx * d.conf.itemWidth
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

    function updateCoord(node) {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)
      node.x += d.translateX
    }

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      setPos(rootNode, 0)
      rootNode && (d.iLeft += itemWidth / 2)
    })

    d.translateX = (d.contentWidth - d.iLeft) / 2

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      updateCoord(rootNode)
    })

    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.scale
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

class Trie extends Common {
  create() {
    const d = this.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda new news`
    d.words = d.str.toLowerCase().match(/\w+/g)
    d.root = new Node('root', {map: {}, isWord: false})

    d.row = 3
    d.paddingTop = d.row * 18 + 10
    d.strArr = d.str.split(/\s+/g)
    d.lenStep = Math.ceil(d.strArr.length / d.row)
    d.steps = []
    d.gd.font = d.conf.font

    for (let i = 0; i < d.strArr.length; i += d.lenStep) {
      d.steps.push(d.strArr.slice(i, i + d.lenStep).join(' '))
    }

    d.textWidth = d.steps.map(str => d.gd.measureText(str).width).max()
    d.words.forEach((word, idx) => {
      let node = d.root

      for (let i = 0, len = word.length; i < len; i++) {
        const c = word[i]
        node = node.map[c] = node.map[c] || new Node(c, {map: {}, isWord: i === len - 1})
        node.isWord && (node.fillStyle = d.color.blue)
      }
    })
  }
  setPos() {
    const d = this.d

    d.iLeft = 0
    d.contentHeight = 0

    const setPos = (node, depth) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        setPos(node.map[k], depth + 1)
      })

      node.x = d.iLeft
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.contentHeight = Math.max(d.contentHeight, node.y + d.conf.itemHeight)

      if (keys.length > 0) {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      } else {
        d.iLeft += d.conf.itemWidth
      }
    }

    setPos(d.root, 0)

    d.contentWidth = d.iLeft
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    gd.font = d.conf.font

    const renderText = () => {
      d.steps.forEach((str, idx) => {
        gd.textAlign = 'left'
        gd.textBaseline = 'top'
        gd.fillStyle = d.color.black
        gd.fillText(str, (d.contentWidth - d.textWidth) / 2, idx * 18)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        renderLine(node.map[k])
        const _node = node.map[k]

        gd.beginPath()
        gd.lineTo(node.x + itemWidth / 2 + .5, node.y + itemHeight / 2)
        gd.lineTo(_node.x + itemWidth / 2 + .5, _node.y + itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      })
    }

    const renderNode = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        renderNode(node.map[k])
      })

      this.renderNode(node)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderText()
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}

class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.contentWidth = 600
    d.contentHeight = 600

    d.canvas.width = d.contentWidth * d.conf.scale
    d.canvas.height = d.contentHeight * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  NearOne() {
    const d = this.d
    const {gd} = d
    const fillStyle = {
      r: 0,
      g: 170,
      b: 255,
      a: 1,
    }
    fillStyle.toString = () => {
      return 'rgba(' + fillStyle.r + ',' + fillStyle.g + ',' + fillStyle.b + ',' + fillStyle.a + ')'
    }

    d.depth = 10

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) return

      const even = depth % 2 === 0
      const w = even ? side / 2 : side

      gd.beginPath()
      gd.rect(x, y, w, side)
      fillStyle.a = (d.depth - depth) / d.depth
      gd.fillStyle = fillStyle.toString()
      gd.fill()
      gd.strokeStyle = d.color.black
      gd.stroke()

      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.fillStyle = d.color.black
      gd.font = w / 5 + 'px Arial'
      gd.fillText('1/' + Math.pow(2, depth + 1), x + w / 2, y + side / 2)

      if (even) {
        // 偶数
        side /= 2
        x += side
        y = side
      } else {
        // 奇数
        y = 0
      }

      render(x, y, side, depth + 1)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, 600, 0)
    gd.restore()
  }
  Fib() {
    const d = this.d
    const {gd} = d

    const getFib = (end) => {
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

    d.fib = getFib(15)

    d.canvas.width = (d.fib[d.fib.length - 1] + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.fib[d.fib.length - 2] + d.conf.paddingV * 2) * d.conf.scale

    let cx = d.fib[d.fib.length - 2]
    let cy = d.fib[d.fib.length - 2]

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    for (let len = d.fib.length, i = len - 1; i > 1; i--) {
      const _i = (d.fib.length - i + 1) % 4
      const deg = _i * 90
      const r = d.fib[i - 1]
      gd.beginPath()
      gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      gd.strokeStyle = d.color.black
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
    const dir = [
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ]

    d.depth = 5

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 2) {
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      side /= 3
      depth++

      for (let i = 0; i < dir.length; i++) {
        render(x + side * dir[i][0], y + side * dir[i][1], side, depth)
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

    d.depth = 5

    const render = (x, y, side, depth) => {
      depth++
      side /= 3

      if (depth >= d.depth) return

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            render(x + side * j, y + side * i, side, depth)
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
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.fillStyle = d.color.cyan
        gd.fill()
      } else {
        side /= 2
        depth++

        render(x1, y1, side, depth)
        render(x1 + side, y1, side, depth)
        render(x1 + side / 2, (y1 + y3) / 2, side, depth)
      }
    }

    let space = (d.contentHeight + d.contentHeight * Math.sin(d2a(-60))) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, d.contentWidth - space, d.contentWidth, 0)
    gd.restore()
  }
  KoachSnowflake() {
    const d = this.d
    const {gd} = d
    const _canvas = d.canvas.cloneNode()
    const _gd = _canvas.getContext('2d')
    _canvas.style.background = 'wheat'
    // document.body.insertBefore(_canvas, document.body.children[0])

    const render = (x1, y1, side, deg, depth) => {
      side /= 3
      ++depth

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth >= d.depth || side < 2) {
        _gd.beginPath()
        _gd.lineTo(x1, y1)
        _gd.lineTo(x2, y2)
        _gd.lineTo(x3, y3)
        _gd.lineTo(x4, y4)
        _gd.lineTo(x5, y5)
        _gd.strokeStyle = d.color.blue
        _gd.stroke()
      } else {
        render(x1, y1, side, deg, depth)
        render(x2, y2, side, deg - 60, depth)
        render(x3, y3, side, deg + 60, depth)
        render(x4, y4, side, deg, depth)
      }
    }

    const w = d.contentWidth
    const h = d.contentHeight

    _gd.save()
    _gd.scale(d.conf.scale, d.conf.scale)
    render(w * .1, d.contentHeight / 3.71, d.contentWidth * .8, 0)
    _gd.restore()

    Array(3).fill().forEach((_, idx, arr) => {
      const deg = idx * (360 / arr.length)

      gd.save()
      gd.scale(d.conf.scale, d.conf.scale)
      gd.translate(w / 2, h / 2)
      gd.rotate(d2a(deg))
      gd.drawImage(
        _canvas,
        -w / 2, -h / 2, w, h
      )
      gd.restore()
    })
  }
  FractalTree(arg) {
    const d = this.d
    const {gd} = d
    const w = d.contentWidth
    const h = d.contentHeight

    d.depth = 12

    const render = (x1, y1, side, deg, depth) => {
      side *= .8
      ++depth

      if (depth > d.depth || side < 2) return

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      render(x2, y2, side, deg + (arg.degL || -15), depth)
      render(x2, y2, side, deg + (arg.degR || 15), depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(w / 2 + (arg.translateX || 0), h + (arg.translateY || 0), arg.side || 140, -90, 0)
    gd.restore()
  }
  setPos() {}
  render() {}
}

const mazeData =  `#######################################################################
        #     # #   # #     # # # # #           # # # # # # # # # # # #
# ### ####### # # ### ### ### # # # # ### # ##### # # # # # # # # # # #
#   #   # # # # #     # # #       #     # #                 # # # #   #
# ### ### # # # # ##### # # ### ### ####### # ### ####### ### # # # ###
# #             #     #   #   #       #   # #   #     # #     # # #   #
##### ##### # ### ####### # ##### ##### ##### # ### ### ### ### # # ###
#       # # #       #   #       #         # # # # #       #           #
### # ### ### # ##### ### ####### ### ##### ##### ### ##### ### #######
#   #       # #         # #     #   #   # #     #   #   #     #       #
##### ######### ### # ### # ##### ### ### # ##### ######### ### #######
# #         #     # #         # #   # #       # # #   # #     #       #
# ### # ####### # ### # # ##### ####### ### ### # # ### ### ### # # ###
#     #       # #   # # #   #     # # #   # #       #   # #   # # #   #
# # # # # ############### ### ##### # # ####### ### ### # ######### ###
# # # # #     # # #   #     #     #         # # #   # #     # # #     #
# # # ### ##### # ### ### ### ##### ######### ##### # # ##### # ### # #
# # # #     # #     # #               #     # # # # #           # # # #
# # ### # ### # ##### ### # ####### ### ##### # # # # ####### ### ### #
# #   # #         #     # #       #         # #         #   #       # #
### ### # # ### ##### ##### ####### # ####### ##### ##### ##### ##### #
#     # # #   # # # # #           # #     #     # # # # #   # # #   # #
# # ####### ##### # # ### # # ####### # ##### ### # # # # ### ### #####
# # #           #   # #   # #     # # # #   #         #   # #   #   # #
### ### ### # ##### # ### # # # ### ####### # ##### ##### # # ### ### #
#     # #   #     #     # # # #   #   # # #       #   #     # #     # #
# # ####### # # ##### ### ##### ### ### # # ####### ####### # # ##### #
# # #       # #     #   # # # #   # # #           #     #   #     #   #
# ####### # # # # ### ##### # ##### # # ####### ### ####### # ##### ###
# #       # # # #               #       # #   #   #   # # #   # #     #
# ##### # ##### # # # # ##### ### ### ### # ####### ### # # ### # #####
# # #   # #     # # # #     # #     #         # #             # #   # #
### ##### # # # ############### ##### # # ##### ### ##### # ### # ### #
#   #     # # #     # # # #         # # #         #     # #         # #
### ### # # # # # ### # # ### ########### # ### ### ####### ### # ### #
#       # # # # #           #   # #     # #   # #   # # #     # #     #
### # # ### # # # # ##### ### ### ### ##### ######### # ### ##### # # #
#   # # # # # # # #   # # # # # # #   # #         #     # #     # # # #
# # # ### ##### ### ### ### # # # ### # ### ### ####### # ########### #
# # # #         #         #         #         #   # # #   # #   # #   #
### ##### # # ##### ### ### ### # ### # # # ####### # ### # # ### ### #
#   #     # # #       #   #   # #   # # # #   # # # #   # #     #   # #
####### # ### ### # ### ### ##### # ####### ### # # # ### # ##### #####
# # # # #   # #   # #           # #     #                     #     # #
# # # ### ########### # # ########### ##### ##### # ############# ### #
#             # # # # # #       # # # #         # #     # # # # # # # #
# # # # # ##### # # ### # # ##### # ####### # ##### ##### # # # # # # #
# # # # # # #         # # #     #       #   # # #       # # # # # # # #
# # ### ### ### ### ### ### ####### ########### ### ##### # # # # # # #
# # #     # # # # # # # #       #   # # #                             #
####### ### # # # ### ### # # ##### # # ##### # # # ### ### ##### ### #
#                 #     # # #   #     # # #   # # #   #   #     #   # #
### ### ### # ##### ##### ########### # # ### ##### # # # # # ### #####
#   #     # #   # #   # # # # # #               # # # # # # #   #     #
### ### ##### ### # ### ### # # ##### # # # # ### ##### # # # ### #####
#     # #                 #       #   # # # #         # # # # #       #
### ### ### # # # ##### ### ### ##### # ##### ######### ##### ### # # #
#     # #   # # #     #       #     # # #           #       # #   # # #
# # ##### ### ### # # # # ##### ##### # # # # ######### # ########### #
# # # #   #     # # # # #     #     # # # # #     # # # #   # # # # # #
# ### ### ### # # ######### ############# # # # ### # ### ### # # # ###
#   #       # # #   # # # #     #   # #   # # #   #     #           # #
# # # # # ####### ### # # ### ### ### ### # ### ### ##### ####### ### #
# # # # #       #           #           # # #         #     # # #     #
# ### # # # # ### # ### ##### # ####### ####### ### ##### ### # #######
# #   # # # #   # #   #     # #   #   # # #       #     #       # # # #
### # ####### ##### ### ####### ### ##### ### # ### ##### ### ### # # #
#   #   #         # # # # #           #       # #     #     #         #
# # # ##### # # ##### ### ### # # # ##### # # ##### ##### # # # ##### #
# # # #     # #             # # # #   #   # #     #     # # # #     #  
#######################################################################`

class Maze extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.isRenderVisited = true
    d.itemWidth = 8
    d.itemHeight = 8
    d.road = ' '
    d.wall = '#'
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    d.mazeData = (typeof mazeData === "undefined" ? require('./mazeData.js').default : mazeData).split('\n').map(row => row.split('').map(s => new Node(s)))
    d.contentWidth = d.mazeData[0].length * d.itemWidth
    d.contentHeight = d.mazeData.length * d.itemWidth
    d.canvas.width = d.contentWidth
    d.canvas.height = d.contentHeight
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    // d.mazeData[d.enter.y][d.enter.x].isPath = true
    // d.mazeData[d.exit.y][d.exit.x].isPath = true
  }
  inArea(y, x) {
    const d = this.d

    return (
      x >= 0 && x < d.mazeData[0].length &&
      y >= 0 && y < d.mazeData.length
    )
  }
  _inArea(y, x) {
    const d = this.d

    return (
      x >= 1 && x < d.mazeData[0].length - 1 &&
      y >= 1 && y < d.mazeData.length - 1
    )
  }
  dfsAll() {
    const d = this.d

    const dfs = (p) => {
      const node = d.mazeData[p.y][p.x]

      node.isPath = true
      node.visited = true

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
  dfs1() {
    const d = this.d
    const dfs = (p) => {
      const node = d.mazeData[p.y][p.x]

      node.isPath = true
      node.visited = true

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
  findPath(p) {
    const d = this.d

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
  }
  dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()
      d.mazeData[p.y][p.x].visited = true

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
    }

    this.findPath(p)
  }
  bfs() {
    const d = this.d
    const queue = [d.enter]
    let p

    while (queue.length > 0) {
      p = queue.shift()
      d.mazeData[p.y][p.x].visited = true

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
    }

    this.findPath(p)
  }
  generate() {
    const d = this.d

    d.isRenderVisited = false
    d.row = 71
    d.col = 71

    d.mazeData = Array(d.row).fill().map((_, idxRow) => {
      return Array(d.col).fill().map((_, idxCol) => {
        return new Node(idxRow % 2 === 1 && idxCol % 2 === 1 ? d.road : d.wall)
      })
    })

    d.contentWidth = d.mazeData[0].length * d.itemWidth
    d.contentHeight = d.mazeData.length * d.itemWidth
    d.canvas.width = d.contentWidth
    d.canvas.height = d.contentHeight
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }

    d.mazeData[d.enter.y][d.enter.x].n = d.road
    d.mazeData[d.exit.y][d.exit.x].n = d.road
  }
  generateDfs1() {
    this.generate()

    const d = this.d

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

    dfs({
      x: 1,
      y: 1,
    })
  }
  generateDfs2() {
    this.generate()

    const d = this.d
    const stack = [{x: 1, y: 1}]

    while (stack.length > 0) {
      const p = stack.pop()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          stack.push({
            x: newX,
            y: newY,
          })
        }
      }
    }
  }
  generateBfs() {
    this.generate()

    const d = this.d
    const queue = [{x: 1, y: 1}]

    while (queue.length > 0) {
      const p = queue.shift()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          queue.push({
            x: newX,
            y: newY,
          })
        }
      }
    }
  }
  generateRand() {
    this.generate()

    const d = this.d
    const queue = [{x: 1, y: 1}]

    while (queue.length > 0) {
      const p = queue[Math.random() < .5 ? 'shift' : 'pop']()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road

          for (let j = 0; j < 4; j++) {
            const _y = newY + d.dir[j][1]
            const _x = newX + d.dir[j][0]

            if (Math.random() < .02 && this._inArea(_y, _x)) {
              d.mazeData[_y][_x].n = d.road
            }
          }

          queue[Math.random() < .5 ? 'unshift' : 'push']({
            x: newX,
            y: newY,
          })
        }
      }
    }

    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.visited = false
      })
    })

    d.isRenderVisited = false
    this.dfs1()
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
        gd.fillStyle = d.color[(node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited && d.isRenderVisited ? 'yellow' : 'white')))]
        gd.fill()
      })
    })
  }
}

class Algo {
  constructor(d = {}) {
    this.d = d

    d.type = {
      list: [
        {name: '迷宫创建 - 随机队列', cons: Maze, startFn: 'generateRand', arg: {}},
        {name: '迷宫创建 - 广度优先 - 非递归', cons: Maze, startFn: 'generateBfs', arg: {}},
        {name: '迷宫创建 - 深度优先 - 非递归', cons: Maze, startFn: 'generateDfs2', arg: {}},
        {name: '迷宫创建 - 深度优先 - 递归', cons: Maze, startFn: 'generateDfs1', arg: {}},
        {name: '迷宫求解 - 广度优先 - 非递归', cons: Maze, startFn: 'bfs', arg: {}},
        {name: '迷宫求解 - 深度优先 - 非递归', cons: Maze, startFn: 'dfs2', arg: {}},
        {name: '迷宫求解 - 深度优先 - 递归', cons: Maze, startFn: 'dfs1', arg: {}},
        {name: '分形图 - FractalTree', cons: Fractal, startFn: 'FractalTree', arg: {}},
        {name: '分形图 - KoachSnowflake', cons: Fractal, startFn: 'KoachSnowflake', arg: {}},
        {name: '分形图 - SierpinskiTriangle', cons: Fractal, startFn: 'SierpinskiTriangle', arg: {}},
        {name: '分形图 - Sierpinski', cons: Fractal, startFn: 'Sierpinski', arg: {}},
        {name: '分形图 - Vicsek', cons: Fractal, startFn: 'Vicsek', arg: {}},
        {name: '分形图 - 斐波那契数列', cons: Fractal, startFn: 'Fib', arg: {}},
        {name: '分形图 - 1/2 + 1/4 + ... + 1/n ≈ 1', cons: Fractal, startFn: 'NearOne', arg: {}},
        {name: 'Trie', cons: Trie, startFn: 'create', arg: {}},
        {name: '红黑树', cons: Tree, startFn: 'RB', arg: {}},
        {name: 'AVL树', cons: Tree, startFn: 'AVL', arg: {}},
        {name: '二分搜索树 - 镜像反转', cons: Tree, startFn: 'BinaryFlip', arg: {}},
        {name: '二分搜索树', cons: Tree, startFn: 'Binary', arg: {}},
        {name: '线段树 - R', cons: Heap, startFn: 'SegmentTreeR', arg: {}},
        {name: '线段树 - L', cons: Heap, startFn: 'SegmentTreeL', arg: {}},
        {name: '最大堆 - shiftUp', cons: Heap, startFn: 'createByShiftUp', arg: {}},
        {name: '最大堆 - heapify', cons: Heap, startFn: 'heapify', arg: {}},
        {name: '三路快排', cons: Sort, startFn: 'QuickSort3', arg: {}},
        {name: '双路快排', cons: Sort, startFn: 'QuickSort2', arg: {}},
        {name: '单路快排', cons: Sort, startFn: 'QuickSort1', arg: {}},
        {name: '归并排序', cons: Sort, startFn: 'MergeSort', arg: {}},
        {name: '插入排序', cons: Sort, startFn: 'InsertionSort', arg: {}},
        {name: '选择排序', cons: Sort, startFn: 'SelectionSort', arg: {}},
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

    const canvasList = nodeList.getElementsByTagName('canvas')
    const len = 20
    let randArr = [].rnd(len, 1, len * 5)
    // randArr = Array(len).fill().map((_, idx) => idx + 1)
    // randArr = Array(len).fill().map((_, idx) => len - idx)
    randArr = randArr.map(n => new Node(n))

    d.type.list.forEach((typeItem, idx) => {
      console.time(typeItem.startFn)
      const canvas = canvasList[idx]
      const o = new typeItem.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        conf: Algo.conf,
        color: Algo.color,
        typeItem,
      })

      o[typeItem.startFn](typeItem.arg)
      o.setPos()
      o.render()
      console.timeEnd(typeItem.startFn)
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
  scale: devicePixelRatio,
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
  Tree,
  Trie,
  Fractal,
  Maze,
  Algo
}
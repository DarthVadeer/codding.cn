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
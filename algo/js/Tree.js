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
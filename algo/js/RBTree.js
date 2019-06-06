class RBTree extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.red
      d.root = me.addL(d.root, item)
      d.root.fillStyle = d.color.black
    })

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.red
      d.root2 = me.addR(d.root2, item)
      d.root2.fillStyle = d.color.black
    })
  }
  addR(node, item) {
    const me = this
    const d = me.d

    if (!node) return item

    if (item.n < node.n) {
      node.l = this.addR(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.addR(node.r, item)
    } else {
      // ===
    }

    if (me.isRed(node.l) && !me.isRed(node.r)) {
      node = me.rightRotate(node)
    }

    if (me.isRed(node.r) && me.isRed(node.r.r)) {
      node = me.leftRotate(node)
    }

    if (me.isRed(node.r) && me.isRed(node.l)) {
      me.flipColors(node)
    }

    return node
  }
  addL(node, item) {
    const me = this
    const d = me.d

    if (!node) return item

    if (item.n < node.n) {
      node.l = this.addL(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.addL(node.r, item)
    } else {
      // ===
    }

    if (me.isRed(node.r) && !me.isRed(node.l)) {
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
  isRed(node) {
    const d = this.d
    return node ? node.fillStyle === d.color.red : false
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
    node.l.fillStyle = d.color.black
    node.r.fillStyle = d.color.black
  }
  setPos() {
    const me = this
    const d = me.d
    const {canvas, gd, conf} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()

    d.level = -1
    d.iLeft = 0
    d.iHeight = 0
    
    function setPos(node) {
      if (!node) return

      d.level++
      setPos(node.l)
      node.x = d.iLeft
      d.iLeft += itemWidth / 2
      node.y = d.level * levelHeight
      setPos(node.r)
      d.level--

      if (node.l && node.r) {
        node.x = (node.l.x + node.r.x) / 2
      }
    }

    function updateCoord(node) {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

      node.x += (canvas.width / devicePixelRatio - d.iLeft) / 2
      node.y += d.sceneTopSpace + conf.sceneSpace
      d.iHeight = Math.max(d.iHeight, node.y)
    }

    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return

      setPos(rootNode)
      d.iLeft += idx === arr.length - 1 ? itemWidth / 2 : itemWidth
    })
    
    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return

      updateCoord(rootNode)
    })
    
    canvas.height = (d.iHeight + itemHeight + d.conf.sceneSpace) * devicePixelRatio
  }
  render() {
    const me = this
    const d = me.d
    const {gd} = d
    const itemWidth = this.getItemWidth()
    const itemHeight = this.getItemHeight()
    const levelHeight = this.getLevelHeight()

    function renderLine(node) {
      if (!node) return

      renderLine(node.l)
      renderLine(node.r)

      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
      gd.strokeStyle = d.color.def
      gd.stroke()
    }

    function renderNode(node) {
      if (!node) return

      renderNode(node.l)
      renderNode(node.r)

      me.renderNode(node)
    }

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)
    gd.save()
    gd.scale(devicePixelRatio, devicePixelRatio)
    me.renderArr()
    ;[d.root, d.root2].forEach((rootNode, idx, arr) => {
      if (!rootNode) return

      renderLine(rootNode)
      renderNode(rootNode)
    })
    gd.restore()

  }
}
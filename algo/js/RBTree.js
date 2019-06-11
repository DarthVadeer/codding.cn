class RBTree extends Tree {
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
    const d = me.d

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
    const d = me.d
    
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
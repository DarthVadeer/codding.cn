class RBTree extends Tree {
  create() {
    const d = this.d

    d.arr.clone().forEach((node) => {
      node.fillStyle = d.color.red
      d.root = this.addL(d.root, node)
      d.root.fillStyle = d.color.black
    })

    d.arr.clone().forEach((node) => {
      node.fillStyle = d.color.red
      d.root2 = this.addR(d.root2, node)
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
    const d = this.d
    return node ? node.fillStyle === d.color.red : false
  }
  flipColors(node) {
    const d = this.d
    node.fillStyle = d.color.red
    node.l.fillStyle = 
    node.r.fillStyle = d.color.black
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
}
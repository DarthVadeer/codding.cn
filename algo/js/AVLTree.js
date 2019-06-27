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
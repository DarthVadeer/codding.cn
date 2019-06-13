class AVLTree extends Tree {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.paddingTop = 60
    d.itemWidth = 46
    d.levelHeight = 60
  }
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.h = 1
      node.balanceFactor = 0
      node.fillStyle = Node.color.blue
      d.root = me.add(d.root, node)
    })
  }
  add(node, item) {
    const me = this

    if (!node) return item

    if (item.n < node.n) {
      node.l = me.add(node.l, item)
    } else if (item.n > node.n) {
      node.r = me.add(node.r, item)
    } else {
      // ===
    }

    const balanceFactor = me.getBalanceFactor(node)

    if (Math.abs(balanceFactor) > 1) {
      if (balanceFactor > 0) {
        // 左边高
        if (me.getBalanceFactor(node.l) < 0) {
          node.l = me.leftRotate(node.l)
        }
        node = me.rightRotate(node)
      } else {
        // 右边高
        if (me.getBalanceFactor(node.r) > 0) {
          node.r = me.rightRotate(node.r)
        }
        node = me.leftRotate(node)
      }
    }

    node.h = Math.max(me.getHeight(node.l), me.getHeight(node.r)) + 1
    node.balanceFactor = me.getBalanceFactor(node)

    return node
  }
  getHeight(node) {
    return node ? node.h : 0
  }
  getBalanceFactor(node) {
    return this.getHeight(node.l) - this.getHeight(node.r)
  }
  leftRotate(x) {
    const me = this
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(me.getHeight(x.l), me.getHeight(x.r)) + 1
    y.h = Math.max(me.getHeight(y.l), me.getHeight(y.r)) + 1
    x.balanceFactor = me.getBalanceFactor(x)

    return y
  }
  rightRotate(x) {
    const me = this
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(me.getHeight(x.l), me.getHeight(x.r)) + 1
    y.h = Math.max(me.getHeight(y.l), me.getHeight(y.r)) + 1
    x.balanceFactor = me.getBalanceFactor(x)

    return y
  }
}
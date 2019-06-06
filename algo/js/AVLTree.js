class AVLTree extends Tree {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 40
    d.levelHeight = 60
    d.sceneTopSpace = 80
    d.canvas.width = (d.arr.length * me.getItemWidth() + d.conf.sceneSpace * 2) * devicePixelRatio
    d.canvas.style.width = d.canvas.width / devicePixelRatio + 'px'

    d.arr.forEach((node, idx, arr) => {
      node.x = idx * d.itemWidth + d.conf.sceneSpace
      node.y = d.conf.sceneSpace
    })
  }
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.blue
      item.h = 1
      item.balanceFactor = 0
      d.root = me.add(d.root, item)
    })
  }
  add(node, item) {
    const me = this

    if (!node) return item

    if (item.n < node.n) {
      node.l = this.add(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.add(node.r, item)
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
  leftRotate(x) {
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    // y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
  rightRotate(x) {
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    // y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
  getHeight(node) {
    return node ? node.h : 0
  }
  getBalanceFactor(node) {
    return node ? this.getHeight(node.l) - this.getHeight(node.r) : 0
  }
}
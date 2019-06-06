class BinarySearch extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((item, idx, arr) => {
      item.fillStyle = d.color.blue
      d.root = me.add(d.root, item)
    })
  }
  add(node, item) {
    if (!node) return item

    if (item.n < node.n) {
      node.l = this.add(node.l, item)
    } else if (item.n > node.n) {
      node.r = this.add(node.r, item)
    } else {
      // ===
    }

    return node
  }
}
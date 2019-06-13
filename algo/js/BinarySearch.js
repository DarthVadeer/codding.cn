class BinarySearch extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
      d.root = me.add(d.root, node)
    })

    d.root2 = me.flip(clone(d.root))
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

    return node
  }
}
class BinarySearch extends Tree {
  create() {
    const d = this.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
      d.root = this.add(d.root, node)
    })

    d.root2 = clone(d.root)
    this.flip(d.root2)
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
  flip(node) {
    if (!node) return

    this.flip(node.l)
    this.flip(node.r)

    const t = node.l
    node.l = node.r
    node.r = t
  }
}
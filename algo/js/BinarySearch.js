class BinarySearch extends Tree {
  create() {
    const d = this.d

    d.arr.clone().forEach((node) => {
      node.fillStyle = d.color.blue
      d.root = this.add(d.root, node)
    })

    d.root2 = this.flip(clone(d.root))
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

    return node
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
}
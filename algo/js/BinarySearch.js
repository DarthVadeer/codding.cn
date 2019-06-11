class BinarySearch extends Tree {
  create() {
    const me = this
    const d = me.d

    d.arr.clone().forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
      d.root = me.add(d.root, node)
    })

    d.root2 = clone(d.root)
    me.flip(d.root2)
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
  flip(node) {
    const me = this
    
    if (!node) return

    me.flip(node.l)
    me.flip(node.r)

    const t = node.l
    node.l = node.r
    node.r = t
  }
}
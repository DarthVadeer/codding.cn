class BinarySearchFlip extends BinarySearch {
  create() {
    const me = this
    const d = me.d

    super.create()

    function flip(node) {
      if (!node) return

      flip(node.l)
      flip(node.r)

      const t = node.l
      node.l = node.r
      node.r = t
    }

    d.root2 = clone(d.root)
    flip(d.root2)
  }
}
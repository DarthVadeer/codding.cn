class SegmentTree extends Heap {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 38
    d.len = 10
    d.level = Math.ceil(Math.log(d.len + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.canvas.width = (Math.pow(2, d.level - 1) * d.itemWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio
  }
  createL() {
    const me = this
    const d = me.d

    function createL(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = Node.color.blue
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      createL(treeIndex * 2 + 1, l, mid)
      createL(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + ', ' + r + ']'
      d.arr[treeIndex].fillStyle = Node.color.blue
    }

    createL(0, 0, d.len)
  }
  createR() {
    const me = this
    const d = me.d

    function createR(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = Node.color.blue
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      createR(treeIndex * 2 + 1, l, mid - 1)
      createR(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].fillStyle = Node.color.blue
    }

    createR(0, 0, d.len)
  }
}
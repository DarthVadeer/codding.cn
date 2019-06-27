class SegmentTree extends Heap {
  constructor() {
    super(...arguments)

    const d = this.d

    d.n = 5
    d.itemWidth = 46
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Item(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
  }
  createL() {
    const d = this.d

    function createL(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].fillStyle = d.color.blue
        d.arr[treeIndex].n = '[' + l + ']'
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      createL(treeIndex * 2 + 1, l, mid)
      createL(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].fillStyle = d.color.blue
      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
    }

    createL(0, 0, d.n)
  }
  createR() {
    const d = this.d

    function createR(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].fillStyle = d.color.blue
        d.arr[treeIndex].n = '[' + l + ']'
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      createR(treeIndex * 2 + 1, l, mid - 1)
      createR(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].fillStyle = d.color.blue
      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
    }

    createR(0, 0, d.n)
  }
}
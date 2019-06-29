class SegmentTree extends Heap {
  createL() {
    const d = this.d

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)

    const createL = (treeIndex, l, r) => {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      createL(treeIndex * 2 + 1, l, mid)
      createL(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.gd.font = d.conf.font
      d.arr[treeIndex].width = Math.max(d.conf.itemWidth, d.gd.measureText(d.arr[treeIndex].n).width + 10)
      d.arr[treeIndex].fillStyle = d.color.blue
    }

    createL(0, 0, d.n)
  }
  createR() {
    const d = this.d

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map(_ => new Node(null))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)

    const createR = (treeIndex, l, r) => {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      createR(treeIndex * 2 + 1, l, mid - 1)
      createR(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.gd.font = d.conf.font
      d.arr[treeIndex].width = Math.max(d.conf.itemWidth, d.gd.measureText(d.arr[treeIndex].n).width + 10)
      d.arr[treeIndex].fillStyle = d.color.blue
    }

    createR(0, 0, d.n)
  }
}
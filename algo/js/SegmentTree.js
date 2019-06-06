class SegmentTree extends Heap {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.itemWidth = 45

    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

    d.len = 11
    d.level = Math.ceil(Math.log(d.len) / Math.log(2)) + 1
    d.arr = new Array(Math.pow(2, d.level) - 1).fill().map((_, idx) => {
      return new Node(null)
    })
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.canvas.width = (Math.pow(2, d.level - 1) * itemWidth + d.conf.sceneSpace * 2) * devicePixelRatio
    d.canvas.style.width = d.canvas.width / devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * levelHeight + itemHeight + d.conf.sceneSpace * 2 + d.sceneTopSpace) * devicePixelRatio
  }
  createL() {
    const me = this
    const d = me.d

    function create(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.floor((r - l) / 2)
      create(treeIndex * 2 + 1, l, mid)
      create(treeIndex * 2 + 2, mid + 1, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].fillStyle = d.color.blue
    }
    create(0, 0, d.len - 1)
  }
  createR() {
    const me = this
    const d = me.d

    function create(treeIndex, l, r) {
      if (l >= r) {
        d.arr[treeIndex].n = '[' + l + ']'
        d.arr[treeIndex].fillStyle = d.color.blue
        return
      }

      const mid = l + Math.ceil((r - l) / 2)
      create(treeIndex * 2 + 1, l, mid - 1)
      create(treeIndex * 2 + 2, mid, r)

      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].fillStyle = d.color.blue
    }
    create(0, 0, d.len - 1)
  }
}
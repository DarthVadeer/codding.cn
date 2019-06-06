class MaxHeap extends Heap {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

    d.raw = d.arr.clone()
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.canvas.width = (Math.pow(2, d.level - 1) * itemWidth + d.conf.sceneSpace * 2) * devicePixelRatio
    d.canvas.style.width = d.canvas.width / devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * levelHeight + itemHeight + d.conf.sceneSpace * 2 + d.sceneTopSpace) * devicePixelRatio
  }
  heapify() {
    const me = this
    const d = me.d
    
    for (let i = d.branchIndex; i > -1; i--) {
      me.shiftDown(i)
    }
  }
  createByShiftUp(k) {
    const me = this
    const d = me.d
    const {arr} = d

    for (let i = 1; i < arr.length; i++) {
      me.shiftUp(i)
    }
  }
  shiftUp(k) {
    const me = this
    const d = me.d
    const {arr} = d

    while (k > 0) {
      let j = parseInt(k / 2)

      if (arr[j].n > arr[k].n) break

      arr.swap(j, k)
      k = j
    }
  }
  shiftDown(k) {
    const me = this
    const d = me.d
    const {arr} = d

    while (k * 2 + 1 < arr.length) {
      let j = k * 2 + 1

      if (j + 1 < arr.length && arr[j + 1].n > arr[j].n) j++

      if (arr[k].n > arr[j].n) break

      arr.swap(j, k)
      k = j
    }
  }
}
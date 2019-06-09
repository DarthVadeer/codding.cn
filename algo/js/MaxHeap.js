class MaxHeap extends Heap {
  constructor() {
    super(...arguments)

    const d = this.d

    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.canvas.width = (Math.pow(2, d.level - 1) * d.conf.itemWidth + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = ((d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
    d.branchIndex = parseInt((d.arr.length - 2) / 2)

    d.arr.forEach((node, idx, arr) => {
      node.fillStyle = Node.color.blue
    })
  }
  heapify() {
    const d = this.d
    
    for (let i = d.branchIndex; i > -1; i--) {
      this.shiftDown(i)
    }
  }
  createByShiftUp(l) {
    const d = this.d

    for (let i = 1; i < d.arr.length; i++) {
      this.shiftUp(i)
    }
  }
  shiftUp(k) {
    const d = this.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[k].n <= d.arr[j].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
  shiftDown(k) {
    const d = this.d

    while (k * 2 + 1 < d.arr.length) {
      let j = k * 2 + 1

      if (j + 1 < d.arr.length && d.arr[j + 1].n > d.arr[j].n) j++

      if (d.arr[k].n >= d.arr[j].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
}
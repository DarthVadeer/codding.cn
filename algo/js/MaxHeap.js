class MaxHeap extends Heap {
  heapify() {
    const d = this.d

    for (let i = d.branchIndex; i > -1; i--) {
      this.shiftDown(i)
    }
  }
  createByShiftUp() {
    const d = this.d
    const len = d.arr.length

    for (let i = 1; i < len; i++) {
      this.shiftUp(i)
    }
  }
  shiftUp(k) {
    const d = this.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      if (d.arr[j].n > d.arr[k].n) break

      d.arr.swap(j, k)
      k = j
    }
  }
  shiftDown(k) {
    const d = this.d
    const len = d.arr.length

    while (k * 2 + 1 < len) {
      let j = k * 2 + 1

      if (j + 1 < len && d.arr[j + 1].n > d.arr[j].n) j++

      if (d.arr[k].n > d.arr[j].n) break

      d.arr.swap(k, j)
      k = j
    }
  }
}
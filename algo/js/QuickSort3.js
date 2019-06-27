class QuickSort3 extends Sort {
  startSort() {
    const d = this.d

    function quickSort(l, r) {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let lt = l
      let gt = r + 1
      let i = l + 1

      while (i < gt) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.green
          d.arr.swap(i, lt + 1)
          lt++
          i++
        } else if (d.arr[i].n > v) {
          d.arr[i].fillStyle = d.color.orange
          d.arr.swap(i, gt - 1)
          gt--
        } else {
          d.arr[i].fillStyle = d.color.purple
          i++
        }
      }

      d.arr[l].fillStyle = d.color.blue
      d.arr.swap(l, lt)

      d.steps.push(
        new Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )

      quickSort(l, lt - 1)
      quickSort(gt, r)
    }

    quickSort(0, d.arr.length - 1)
    d.steps.push(
      d.arr.clone().map((item, idx) => {
        item.fromIndex = idx
        item.fillStyle = d.color.blue
        return item
      })
    )
  }
}
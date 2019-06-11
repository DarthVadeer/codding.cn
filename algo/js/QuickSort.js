class QuickSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    function quickSort(l, r) {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let j = l

      for (let i = l + 1; i <= r; i++) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = Node.color.red
          d.arr.swap(i, j + 1)
          j++
        } else {
          d.arr[i].fillStyle = Node.color.orange
        }
      }

      d.arr[l].fillStyle = Node.color.blue
      d.arr.swap(l, j)

      d.steps.push(
        new Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )

      quickSort(l, j - 1)
      quickSort(j + 1, r)
    }

    quickSort(0, d.arr.length - 1)
    
    d.steps.push(d.arr.clone().map((node, idx) => {
      node.fillStyle = Node.color.blue
      node.fromIndex = idx
      return node
    }))
  }
}
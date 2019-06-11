class QuickSort2 extends Sort {
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
      let i = l + 1
      let j = r

      while (true) {
        while (i <= r && d.arr[i].n < v) {
          d.arr[i].fillStyle = Node.color.red
          i++
        }
        while (j > l && d.arr[j].n > v) {
          d.arr[j].fillStyle = Node.color.orange
          j--
        }
        if (i > j) break
        d.arr.swap(i, j)
        d.arr[i].fillStyle = Node.color.red
        d.arr[j].fillStyle = Node.color.orange
        i++
        j--
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
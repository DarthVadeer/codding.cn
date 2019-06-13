class SelectionSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    for (let i = 0; i < d.arr.length; i++) {
      let minIndex = i

      d.arr[i].fromIndex = i

      for (let j = i + 1; j < d.arr.length; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = Node.color.green
        if (d.arr[j].n < d.arr[minIndex].n) {
          minIndex = j
        }
      }

      d.arr.swap(i, minIndex)
      d.arr[minIndex].fillStyle = Node.color.orange
      d.arr[i].fillStyle = Node.color.blue
      d.steps.push(
        new Array(i).fill().concat(
          d.arr.slice(i, d.arr.length).clone()
        )
      )
    }

    d.steps.push(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = Node.color.blue
        return node
      })
    )
  }
}
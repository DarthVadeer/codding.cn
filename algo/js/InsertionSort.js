class InsertionSort extends Sort {
  startSort() {
    const me = this
    const d = me.d

    for (let i = 1; i < d.arr.length; i++) {
      let j = i
      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = Node.color.orange

      for (; j > 0; j--) {
        d.arr[j - 1].fromIndex = j - 1
        d.arr[j - 1].fillStyle = Node.color.green

        if (d.arr[j].n >= d.arr[j - 1].n) break

        d.arr.swap(j, j - 1)
      }

      d.steps.push(
        new Array(j).fill().concat(
          d.arr.slice(j, i + 1).clone()
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
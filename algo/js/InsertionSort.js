class InsertionSort extends Sort {
  startSort() {
    const d = this.d

    for (let i = 1, len = d.arr.length; i < len; i++) {
      let j = i

      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = d.color.blue

      for (; j > 0; j--) {
        d.arr[j - 1].fromIndex = j - 1
        d.arr[j - 1].fillStyle = d.color.green

        if (d.arr[j].n < d.arr[j - 1].n) {
          d.arr.swap(j, j - 1)
        } else {
          break
        }
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
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
}
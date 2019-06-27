class SelectionSort extends Sort {
  startSort() {
    const d = this.d

    for (let i = 0, len = d.arr.length; i < len; i++) {
      let minIndex = i

      d.arr[i].fromIndex = i

      for (let j = i + 1; j < len; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = d.color.green

        if (d.arr[minIndex].n > d.arr[j].n) {
          minIndex = j
        }
      }

      d.arr[i].fillStyle = d.color.orange
      d.arr[minIndex].fillStyle = d.color.blue
      d.arr.swap(i, minIndex)

      d.steps.push(
        new Array(i).fill().concat(
          d.arr.slice(i, len).clone()
        )
      )
    }

    d.steps.push(
      d.arr.clone().map((item, idx) => {
        item.fromIndex = idx
        item.fillStyle = d.color.blue
        return item
      })
    )
  }
}
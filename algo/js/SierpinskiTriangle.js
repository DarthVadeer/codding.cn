class SierpinskiTriangle extends Fractal {
  create() {
    
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    let count = 0

    function render(x1, y1, c, depth) {
      depth++

      const x2 = x1 + c
      const y2 = y1

      const x3 = (x1 + x2) / 2
      const h = c * Math.sin(d2a(-60))
      const y3 = h + y1

      if (c < 1 || depth > d.depth) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = Node.color.blue
        gd.fill()
        return
      }

      ++count
      render(x1, y1, c / 2, depth)
      render(x1 + c / 2, y1, c / 2, depth)
      render(x1 + c / 4, y1 + h / 2, c / 2, depth)
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)
    render(0, canvas.height - canvas.height * .07, canvas.width, 0)
    // console.log(me.constructor.name, count)
  }
}
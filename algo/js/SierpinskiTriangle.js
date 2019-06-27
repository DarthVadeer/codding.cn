class SierpinskiTriangle extends Fractal {
  render() {
    const d = this.d
    const {canvas, gd} = d

    const render = (x1, y1, side, depth) => {
      ++d.countRender
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side * Math.cos(d2a(-60))
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth >= d.maxDepth) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = d.color.green
        gd.fill()
        return
      }

      side /= 2
      ++depth

      const h = y1 - y3
      render(x1, y1, side, depth)
      render(x1 + side, y1, side, depth)
      render(x1 + side / 2, y1 - h / 2, side, depth)
    }

    const h = canvas.height
    render(0, h - (h + h * Math.sin(d2a(-60))) / 2, h, 0)
  }
}
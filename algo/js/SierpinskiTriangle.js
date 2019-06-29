class SierpinskiTriangle extends Fractal {
  create() {
    const d = this.d
    const {gd} = d

    d.depth = 5

    const render = (x1, y1, side, depth) => {
      ++d.countLoop

      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side * Math.cos(d2a(-60))
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth >= d.depth || side < 4) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.fillStyle = d.color.cyan
        gd.fill()
      } else {
        ++depth
        side /= 2
        render(x1, y1, side, depth)
        render(x1 + side, y1, side, depth)
        render(x1 + side / 2, (y1 + y3) / 2, side, depth)
      }
    }

    let space = d.contentHeight
    space = space * Math.sin(d2a(60))
    space = (d.contentHeight - space) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, d.contentHeight - space, d.contentWidth, 0)
    gd.restore()
  }
}
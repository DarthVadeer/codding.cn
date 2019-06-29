class SierpinskiTriangle extends Fractal {
  create() {
    const d = this.d
    const {gd} = d

    d.depth = 6

    const render = (x1, y1, side, depth) => {
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side * Math.cos(d2a(-60))
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth >= d.depth) {
        ++d.renderCount
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = d.color.cyan
        gd.fill()
        return
      } else {
        side /= 2
        ++depth

        render(x1, y1, side, depth)
        render(x1 + side, y1, side, depth)
        render(x1 + side / 2, (y1 + y3) / 2, side, depth)
      }
    }

    let translateY = d.contentHeight
    translateY = translateY * Math.sin(d2a(-60))
    translateY = (d.contentHeight + translateY) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(0, d.contentHeight - translateY, d.contentWidth, 0)
    gd.restore()
  }
}
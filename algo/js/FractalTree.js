class FractalTree extends Fractal {
  create(arg = {}) {
    const d = this.d
    const {canvas, gd} = d

    d.depth = arg.depth || 9

    const render = async (x1, y1, side, deg, degL, degR, depth) => {
      if (depth >= d.depth || side < 3) return
      ++d.countLoop

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      ++depth
      side *= .8

      render(x2, y2, side, deg + degL, degL, degR, depth)
      render(x2, y2, side, deg + degR, degL, degR, depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(
      d.contentWidth / 2 + (arg.translateX || 0),
      d.contentHeight,
      arg.side || 125,
      -90,
      arg.degL || -15,
      arg.degR || 15,
      0
    )
    gd.restore()
  }
}
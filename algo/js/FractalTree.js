class FractalTree extends Fractal {
  render() {}
  renderTree(args) {
    const d = this.d
    const {canvas, gd} = d

    d.maxDepth = 10
    d.canvas.height -= 120 * d.conf.devicePixelRatio

    const render = (x1, y1, side, deg, degL, degR, depth) => {
      if (depth >= d.maxDepth || side < 2) return

      ++d.countRender

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      render(x2, y2, side * .75, deg + degL, degL, degR, depth + 1)
      render(x2, y2, side * .75, deg + degR, degL, degR, depth + 1)
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    render(d.contentWidth / 2, canvas.height / d.conf.devicePixelRatio, 120, ...args)
    gd.restore()
  }
}
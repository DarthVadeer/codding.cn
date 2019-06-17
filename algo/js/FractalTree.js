class FractalTree extends Fractal {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.maxDepth = 10
    d.depth = 7
    d.canvas.width *= 2.2
    d.canvas.height *= .6
    d.canvas.style.width = ''
  }
  create() {

  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    function renderLine(x1, y1, side, deg, degL, degR, depth) {
      if (side < 2 || depth > d.depth) return

      const x2 = x1 + side * Math.sin(d2a(deg))
      const y2 = y1 - side * Math.cos(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.stroke()

      ++depth
      renderLine(x2, y2, side * .7, deg + degL, degL, degR, depth)
      renderLine(x2, y2, side * .7, deg + degR, degL, degR, depth)
    }

    const steps = [
      {degL: -30, degR: 10, left: 0},
      {degL: -20, degR: 20, left: 0},
      {degL: -10, degR: 50, left: 0},
      {degL: -90, degR: 90, left: 0},
    ]

    const space = 100
    const perW = (canvas.width - space * 2) / steps.length

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    steps.forEach((item, idx, arr) => {
      gd.save()
      gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
      renderLine((idx === arr.length - 1 ? canvas.width - 140 : idx * perW + perW / 2 + 50) / d.conf.devicePixelRatio, canvas.height / d.conf.devicePixelRatio, 90, 0, item.degL, item.degR, 0)
      gd.restore()
    })
  }
}
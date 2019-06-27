class Vicsek extends Fractal {
  constructor() {
    super(...arguments)

    const d = this.d
    d.maxDepth = 4
  }
  render() {
    const d = this.d
    const {canvas, gd} = d
    const dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    const render = (x, y, side, depth) => {
      ++d.countRender

      if (depth >= d.maxDepth) {
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      side /= 3
      dir.forEach((item, idx) => {
        render(x + side * item[1], y + side * item[0], side, depth + 1)
      })
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}
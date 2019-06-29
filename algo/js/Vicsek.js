class Vicsek extends Fractal {
  create() {
    const d = this.d
    const {gd} = d
    const dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    d.depth = 4

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) {
        ++d.renderCount
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      side /= 3
      ++depth

      dir.forEach((item, idx) => {
        render(x + item[1] * side, y + item[0] * side, side, depth)
      })
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}
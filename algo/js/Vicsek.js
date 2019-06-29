class Vicsek extends Fractal {
  create() {
    const d = this.d
    const {gd} = d

    d.depth = 4
    d.dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    const render = (x, y, side, depth) => {
      if (side < 2 || depth >= d.depth) {
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      ++d.countLoop
      ++depth
      side /= 3

      for (let i = 0; i < d.dir.length; i++) {
        const item = d.dir[i]
        render(x + item[1] * side, y + item[0] * side, side, depth)
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}
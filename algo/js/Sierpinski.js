class Sierpinski extends Fractal {
  create() {
    const d = this.d
    const {gd} = d

    d.depth = 4

    const render = (x, y, side, depth) => {
      if (side < 2 || depth >= d.depth) return

      ++d.countLoop
      ++depth
      side /= 3

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            render(x + j * side, y + i * side, side, depth)
          }
        }
      }

      depth++
      side /= 3
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}
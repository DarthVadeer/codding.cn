class Sierpinski extends Fractal {
  constructor() {
    super(...arguments)

    const d = this.d
    d.maxDepth = 4
  }
  render() {
    const d = this.d
    const {gd} = d

    const render = (x, y, side, depth) => {
      if (depth >= d.maxDepth) return

      side /= 3
      ++d.countRender
      ++depth

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
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}
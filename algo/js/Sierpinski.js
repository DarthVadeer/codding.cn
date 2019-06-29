class Sierpinski extends Fractal {
  create() {
    const d = this.d
    const {gd} = d

    d.depth = 4

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) return

      side /= 3

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i == 1 && j === 1) {
            ++d.renderCount
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            render(x + side * j, y + side * i, side, depth + 1)
          }
        }
      }
    }

    
    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
}
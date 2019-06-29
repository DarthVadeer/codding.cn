class KoachSnowflake extends Fractal {
  create() {
    const d = this.d
    const {canvas, gd} = d
    const _canvas = canvas.cloneNode()
    const _gd = _canvas.getContext('2d')

    // document.body.insertBefore(_canvas, document.body.children[0])

    d.depth = 5

    const render = (x1, y1, side, deg, depth) => {
      ++depth
      ++d.countLoop
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth >= d.depth || side < 3) {
        _gd.beginPath()
        _gd.lineTo(x1, y1)
        _gd.lineTo(x2, y2)
        _gd.lineTo(x3, y3)
        _gd.lineTo(x4, y4)
        _gd.lineTo(x5, y5)

        _gd.strokeStyle = d.color.blue
        _gd.stroke()
      } else {
        render(x1, y1, side, deg, depth)
        render(x2, y2, side, deg - 60, depth)
        render(x3, y3, side, deg + 60, depth)
        render(x4, y4, side, deg, depth)
      }
    }

    _gd.save()
    _gd.scale(d.conf.scale, d.conf.scale)
    render(d.contentWidth * .1, d.contentHeight / 3.72, d.contentWidth * .8, 0, 0)
    _gd.restore()

    new Array(3).fill().forEach((_, idx, arr) => {
      const deg = 360 / arr.length * idx
      gd.save()
      gd.translate(d.canvas.width / 2, d.canvas.height / 2)
      gd.rotate(d2a(deg))
      gd.drawImage(
        _canvas,
        0, 0, d.canvas.width, d.canvas.height,
        -d.canvas.width / 2, -d.canvas.height / 2, d.canvas.width, d.canvas.height,
      )
      gd.restore()
    })
  }
}
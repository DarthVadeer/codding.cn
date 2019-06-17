class KoachSnowflake extends Fractal {
  create() {
    // console.log('Vicsek create')
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const dir = {
      '0-0': 1,
      '0-2': 1,
      '1-1': 1,
      '2-0': 1,
      '2-2': 1,
    }
    const _canvas = canvas.cloneNode()
    const _gd = _canvas.getContext('2d')
    let count = 0

    _canvas.width *= .7

    function renderOne(x1, y1, side, deg, depth) {
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 - side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 - side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 - side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 - side * Math.sin(d2a(deg))

      ++count
      ++depth
      if (depth >= d.depth || side < 1) {
        _gd.beginPath()
        _gd.lineTo(x1, y1)
        _gd.lineTo(x2, y2)
        _gd.lineTo(x3, y3)
        _gd.lineTo(x4, y4)
        _gd.lineTo(x5, y5)
        _gd.strokeStyle = Node.color.blue
        _gd.stroke()
      } else {
        renderOne(x1, y1, side, deg + 0, depth)
        renderOne(x2, y2, side, deg - 60, depth)
        renderOne(x3, y3, side, deg + 60, depth)
        renderOne(x4, y4, side, deg + 0, depth)
      }
    }

    function renderFull() {
      new Array(3).fill().forEach((_, idx, arr) => {
        const deg = idx * 120

        gd.save()
        gd.translate(canvas.width / 2, canvas.height / 2)
        gd.rotate(d2a(deg))
        gd.drawImage(
          _canvas,
          0, 0, _canvas.width, _canvas.height,
          -_canvas.width / 2, _canvas.width * .287, _canvas.width, _canvas.height,
        )
        gd.restore()

      })
    }

    gd.clearRect(0, 0, canvas.width, canvas.height)
    renderOne(0, 0, _canvas.width, 0, 0)

    renderFull()

    // console.log(me.constructor.name, count)
  }
}
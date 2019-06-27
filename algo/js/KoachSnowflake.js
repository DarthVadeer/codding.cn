class KoachSnowflake extends Fractal {
  render() {
    const d = this.d
    const {canvas, gd} = d
    // d.maxDepth = 2

    const render = (x1, y1, side, deg, depth) => {
      ++d.countRender
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth >= d.maxDepth || side < 5) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.lineTo(x4, y4)
        gd.lineTo(x5, y5)
        gd.strokeStyle = d.color.blue
        gd.stroke()
      } else {
        ++depth
        render(x1, y1, side, deg, depth)
        render(x2, y2, side, deg - 60, depth)
        render(x3, y3, side, deg + 60, depth)
        render(x4, y4, side, deg, depth)
      }
    }

    const side = d.contentWidth * .8 * d.conf.devicePixelRatio
    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    render(d.canvas.width * .1, side / 2, side, 0, 0)
    gd.restore()

    const img = new Image()
    img.onload = (e) => {
      gd.fillStyle = d.color.white
      gd.fillRect(0, 0, canvas.width, canvas.height)

      const len = 3
      const deg = 360 / len
      new Array(len).fill().map((_, idx) => {
        const _deg = idx * deg
        gd.save()
        gd.translate(canvas.width / 2, canvas.height / 2)
        gd.rotate(d2a(_deg))
        gd.drawImage(
          img,
          0, 0, img.width, img.height,
          -img.width / 2, -img.height / 1.585, img.width, img.height
        )
        gd.restore()
      })
    }
    canvas.toBlob((blob) => {
      const src = URL.createObjectURL(blob)
      img.src = src
    })
  }
}
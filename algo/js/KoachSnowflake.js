class KoachSnowflake extends Fractal {
  create() {
    const d = this.d
    const {canvas, gd} = d

    const render = (x1, y1, side, deg, depth) => {
      ++depth
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth >= d.depth) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.lineTo(x4, y4)
        gd.lineTo(x5, y5)
        gd.strokeStyle = d.color.blue
        gd.stroke()
      } else {
        render(x1, y1, side, deg, depth)
        render(x2, y2, side, deg - 60, depth)
        render(x3, y3, side, deg + 60, depth)
        render(x4, y4, side, deg, depth)
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    render(d.contentWidth * .1, d.contentHeight / 3.71, d.contentWidth * .8, 0, 0)
    gd.restore()

    d.canvas.toBlob((blob) => {
      const src = URL.createObjectURL(blob)
      const img = new Image()

      img.onload = () => {
        const len = 3
        const deg = 360 / len

        gd.clearRect(0, 0, canvas.width, canvas.height)

        new Array(len).fill().forEach((_, idx) => {
          const _deg = deg * idx

          gd.save()
          gd.translate(
            (d.contentWidth / 2 + d.conf.paddingH) * d.conf.scale,
            (d.contentHeight / 2 + d.conf.paddingV) * d.conf.scale
          )
          gd.rotate(d2a(_deg))
          gd.drawImage(
            img,
            0, 0, img.width, img.height,
            -img.width / 2, -img.height / 2, img.width, img.height
          )
          gd.restore()
          this.onready && this.onready()
        })
      }

      img.src = src
    })
  }
}
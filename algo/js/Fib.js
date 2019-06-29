class Fib extends Fractal {
  getFibList(end) {
    const result = []
    let a = 1
    let b = 1

    for (let i = 0; i < end; i++) {
      result.push(a)
      const t = b
      b += a
      a = t
    }

    return result
  }
  renderLine(arg = {}) {
    const d = this.d
    const {canvas, gd} = d
    const fib = this.getFibList(15)
    let cx = fib[fib.length - 2]
    let cy = fib[fib.length - 2]

    d.canvas.width = (fib[fib.length - 1] + d.conf.paddingH) * d.conf.scale
    d.canvas.height = (fib[fib.length - 2] + d.conf.paddingV) * d.conf.scale

    const renderLine = () => {
      for (let len = fib.length, i = len - 1; i > 2; i--) {
        const _i = (len - i + 1) % 4
        const r = fib[i - 1]
        const deg = _i * 90

        gd.beginPath()

        if (arg.isRenderAux) {
          gd.lineTo(cx, cy)
          gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
          gd.closePath()
        } else {
          gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
        }
        
        gd.strokeStyle = d.color.indigo
        gd.stroke()

        switch (_i) {
          case 0:
            cy += fib[i - 3]
            break
          case 1:
            cx -= fib[i - 3]
            break
          case 2:
            cy -= fib[i - 3]
            break
          case 3:
            cx += fib[i - 3]
            break
        }
      }
    }

    d.canvas.width += d.conf.paddingH * 2
    d.canvas.height += d.conf.paddingV * 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    gd.restore()
  }
}
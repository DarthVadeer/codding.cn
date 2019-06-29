class Fib extends Fractal {
  create(arg = {}) {
    const d = this.d
    const {canvas, gd} = d
    const fib = this.getFibList(15)
    let cx = fib[fib.length - 2]
    let cy = fib[fib.length - 2]

    canvas.width = (fib[fib.length - 1] + d.conf.paddingH * 2) * d.conf.scale
    canvas.style.width = canvas.width / d.conf.scale + 'px'
    canvas.height = (fib[fib.length - 2] + d.conf.paddingV * 2) * d.conf.scale

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    for (let len = fib.length, i = len - 1; i > -1; i--) {
      const _i = (len - i + 1) % 4
      const deg = _i * 90
      const r = fib[i - 1]

      gd.beginPath()
      gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      gd.strokeStyle = d.color.black
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
    gd.restore()
  }
  getFibList(end) {
    let result = []
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
}
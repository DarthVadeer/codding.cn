class Fib extends Common {
  constructor() {
    super(...arguments)
  }
  create() {
    const d = this.d
    d.fib = this.getFibArr(15)
    d.canvas.width = d.fib[d.fib.length - 1]
    d.canvas.height = d.fib[d.fib.length - 2]
  }
  getFibArr(end) {
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
  setPos() {
    const d = this.d
  }
  render() {
    const d = this.d
    const {gd} = d
    let cx = d.fib[d.fib.length - 2]
    let cy = d.fib[d.fib.length - 2]

    for (let len = d.fib.length, i = len - 1; i > 1; i--) {
      const _i = (len - i + 1) % 4
      const deg = _i * 90
      const r = d.fib[i - 1]

      gd.beginPath()
      gd.lineTo(cx, cy)
      gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      gd.closePath()
      gd.stroke()

      switch (_i) {
        case 0:
          // 右
          cy += d.fib[i - 3]
          break
        case 1:
          // 下
          cx -= d.fib[i - 3]
          break
        case 2:
          // 左
          cy -= d.fib[i - 3]
          break
        case 3:
          // 上
          cx += d.fib[i - 3]
          break
      }
    }
  }
}
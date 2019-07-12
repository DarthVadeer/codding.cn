class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.contentWidth = 600
    d.contentHeight = 600

    d.canvas.width = d.contentWidth * d.conf.scale
    d.canvas.height = d.contentHeight * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  NearOne() {
    const d = this.d
    const {gd} = d
    const fillStyle = {
      r: 0,
      g: 170,
      b: 255,
      a: 1,
    }
    fillStyle.toString = () => {
      return 'rgba(' + fillStyle.r + ',' + fillStyle.g + ',' + fillStyle.b + ',' + fillStyle.a + ')'
    }

    d.depth = 10

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) return

      const even = depth % 2 === 0
      const w = even ? side / 2 : side

      gd.beginPath()
      gd.rect(x, y, w, side)
      fillStyle.a = (d.depth - depth) / d.depth
      gd.fillStyle = fillStyle.toString()
      gd.fill()
      gd.strokeStyle = d.color.black
      gd.stroke()

      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.fillStyle = d.color.black
      gd.font = w / 5 + 'px Arial'
      gd.fillText('1/' + Math.pow(2, depth + 1), x + w / 2, y + side / 2)

      if (even) {
        // 偶数
        side /= 2
        x += side
        y = side
      } else {
        // 奇数
        y = 0
      }

      render(x, y, side, depth + 1)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, 600, 0)
    gd.restore()
  }
  Fib() {
    const d = this.d
    const {gd} = d

    const getFib = (end) => {
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

    d.fib = getFib(15)

    d.canvas.width = (d.fib[d.fib.length - 1] + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.fib[d.fib.length - 2] + d.conf.paddingV * 2) * d.conf.scale

    let cx = d.fib[d.fib.length - 2]
    let cy = d.fib[d.fib.length - 2]

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    for (let len = d.fib.length, i = len - 1; i > 1; i--) {
      const _i = (d.fib.length - i + 1) % 4
      const deg = _i * 90
      const r = d.fib[i - 1]
      gd.beginPath()
      gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      gd.strokeStyle = d.color.black
      gd.stroke()

      switch (_i) {
        case 0:
          cy += d.fib[i - 3]
          break
        case 1:
          cx -= d.fib[i - 3]
          break
        case 2:
          cy -= d.fib[i - 3]
          break
        case 3:
          cx += d.fib[i - 3]
          break
      }
    }
    gd.restore()
  }
  Vicsek() {
    const d = this.d
    const {gd} = d
    const dir = [
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ]

    d.depth = 5

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 2) {
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      side /= 3
      depth++

      for (let i = 0; i < dir.length; i++) {
        render(x + side * dir[i][0], y + side * dir[i][1], side, depth)
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  Sierpinski() {
    const d = this.d
    const {gd} = d

    d.depth = 5

    const render = (x, y, side, depth) => {
      depth++
      side /= 3

      if (depth >= d.depth) return

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            render(x + side * j, y + side * i, side, depth)
          }
        }
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  SierpinskiTriangle() {
    const d = this.d
    const {gd} = d

    d.depth = 6

    const render = (x1, y1, side, depth) => {
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side * Math.cos(d2a(-60))
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth >= d.depth || side < 2) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.fillStyle = d.color.cyan
        gd.fill()
      } else {
        side /= 2
        depth++

        render(x1, y1, side, depth)
        render(x1 + side, y1, side, depth)
        render(x1 + side / 2, (y1 + y3) / 2, side, depth)
      }
    }

    let space = (d.contentHeight + d.contentHeight * Math.sin(d2a(-60))) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, d.contentWidth - space, d.contentWidth, 0)
    gd.restore()
  }
  KoachSnowflake() {
    const d = this.d
    const {gd} = d
    const _canvas = d.canvas.cloneNode()
    const _gd = _canvas.getContext('2d')
    _canvas.style.background = 'wheat'
    // document.body.insertBefore(_canvas, document.body.children[0])

    const render = (x1, y1, side, deg, depth) => {
      side /= 3
      ++depth

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth >= d.depth || side < 2) {
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

    const w = d.contentWidth
    const h = d.contentHeight

    _gd.save()
    _gd.scale(d.conf.scale, d.conf.scale)
    render(w * .1, d.contentHeight / 3.71, d.contentWidth * .8, 0)
    _gd.restore()

    Array(3).fill().forEach((_, idx, arr) => {
      const deg = idx * (360 / arr.length)

      gd.save()
      gd.scale(d.conf.scale, d.conf.scale)
      gd.translate(w / 2, h / 2)
      gd.rotate(d2a(deg))
      gd.drawImage(
        _canvas,
        -w / 2, -h / 2, w, h
      )
      gd.restore()
    })
  }
  FractalTree(arg) {
    const d = this.d
    const {gd} = d
    const w = d.contentWidth
    const h = d.contentHeight

    d.depth = 12

    const render = (x1, y1, side, deg, depth) => {
      side *= .8
      ++depth

      if (depth > d.depth || side < 2) return

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      render(x2, y2, side, deg + (arg.degL || -15), depth)
      render(x2, y2, side, deg + (arg.degR || 15), depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(w / 2 + (arg.translateX || 0), h + (arg.translateY || 0), arg.side || 140, -90, 0)
    gd.restore()
  }
  setPos() {}
  render() {}
}
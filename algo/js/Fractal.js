class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.depth = 4
    d.renderCount = 0
    d.contentWidth = 600
    d.contentHeight = 600
    d.canvas.width = d.contentWidth * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = d.contentHeight * d.conf.scale
  }
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
  Fib(arg = {}) {
    this.d = Object.assign(this.d, arg)

    const d = this.d
    const {canvas, gd} = d

    d.fib = this.getFibList(15)
    d.contentWidth = d.fib[d.fib.length - 1]
    d.contentHeight = d.fib[d.fib.length - 2]

    canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    canvas.style.width = canvas.width / d.conf.scale + 'px'
    canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale

    let cx = d.fib[d.fib.length - 2]
    let cy = d.fib[d.fib.length - 2]

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)

    for (let len = d.fib.length, i = len - 1; i > 2; i--) {
      const _i = (len - i + 1) % 4
      const deg = _i * 90
      const r = d.fib[i - 1]

      ++d.renderCount
      gd.beginPath()
      if (d.isRenderAux) {
        gd.lineTo(cx, cy)
        gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
        gd.lineTo(cx, cy)
        gd.closePath()
      } else {
        gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      }
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

    d.dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 1) {
        // 到达极限 -> 绘制
        ++d.renderCount
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
      } else {
        // 递归
        ++depth
        side /= 3
        d.dir.forEach((item, idx) => {
          render(x + side * item[1], y + side * item[0], side, depth)
        })
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

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 2) return

      ++depth
      side /= 3

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            // 绘制
            ++d.renderCount
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            // 递归
            render(x + j * side, y + i * side, side, depth)
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
        // 递归到底 -> 绘制
        ++d.renderCount
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = d.color.cyan
        gd.fill()
      } else {
        ++depth
        side /= 2
        render(x1, y1, side, depth)
        render(x1 + side, y1, side, depth)
        render(x1 + side / 2, (y1 + y3) / 2, side, depth)
      }
    }

    const space = (d.contentHeight - d.contentHeight * Math.sin(d2a(60))) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, d.contentHeight - space, d.contentWidth, 0)
    gd.restore()
  }
  KoachSnowflake() {
    const d = this.d
    const {canvas, gd} = d

    d.depth = 5

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
        ++d.renderCount
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
    render(d.contentWidth * .1, d.contentHeight / 3.72, d.contentWidth * .8, 0, 0)
    gd.restore()

    const _canvas = canvas.cloneNode()
    // document.body.insertBefore(_canvas, document.body.children[0])
    _canvas.getContext('2d').drawImage(
      canvas,
      0, 0, canvas.width, canvas.height
    )

    gd.clearRect(0, 0, canvas.width, canvas.height)
    new Array(3).fill().forEach((_, idx, arr) => {
      const deg = 360 / arr.length * idx

      gd.save()
      gd.translate(canvas.width / 2, canvas.height / 2)
      gd.rotate(d2a(deg))
      gd.drawImage(
        _canvas,
        0, 0, canvas.width, canvas.height,
        -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height,
      )
      gd.restore()
    })
  }
  FractalTree(arg = {}) {
    const d = this.d
    const {canvas, gd} = d

    d.depth = arg.depth || 12

    const render = (x1, y1, side, deg, depth) => {
      if (depth >= d.depth || side < 2) return

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      ++d.renderCount
      ++depth
      side *= .8

      render(x2, y2, side, deg + (arg.degL || -15), depth)
      render(x2, y2, side, deg + (arg.degR || 15), depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(
      d.contentWidth / 2 + (arg.translateX || 0),
      d.contentHeight + (arg.translateY || 0),
      arg.side || 100,
      -90,
      0
    )
    gd.restore()
  }
  NearOne() {
    const d = this.d
    const {gd} = d
    const fillStyle = rgba(
      0x00,
      0xBC,
      0xD4,
      1
    )
    
    d.depth = 8

    const render = (x, y, side, depth) => {
      if (depth >= d.depth || side < 1) return

      const isH = depth % 2 === 0
      const w = side / (isH ? 2 : 1)

      gd.beginPath()
      gd.rect(x, y, w, side)
      fillStyle.a = (d.depth - depth) / d.depth
      gd.fillStyle = fillStyle.toString()
      gd.fill()
      
      gd.strokeStyle = d.color.black
      gd.stroke()

      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.font = (side / 10) + 'px Arial'
      gd.fillStyle = d.color.black
      gd.fillText('1/' + Math.pow(2, depth + 1), x + w / 2, y + side / 2)

      ++depth
      isH ? 
      render(x + side / 2, y + side / 2, side / 2, depth) :
      render(x, y - side, side, depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  setPos() {
    const d = this.d
  }
  render() {
    const d = this.d
  }
  /*log() {
    const d = this.d
    console.log('%c renderCount ' + d.renderCount, 'color: red', d.typeItem.name)
  }*/
}
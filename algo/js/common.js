class Node {
  constructor(n, o) {
    this.n = n

    o = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      fillStyle: Algo.color.black,
      strokeStyle: Algo.color.black,
      ...o,
    }

    for (let key in o) {
      this[key] = o[key]
    }
  }
}

class Common {
  constructor(d= {}) {
    this.d = d

    d.timerAni = 0
    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  updatePos(node) {
    if (!node) return true

    let vx = (node.tx - node.x) / 12
    let vy = (node.ty - node.y) / 12

    vx = vx > 0 ? Math.ceil(vx) : Math.floor(vx)
    vy = vy > 0 ? Math.ceil(vy) : Math.floor(vy)

    node.x += vx
    node.y += vy

    return vx === 0 && vy === 0
  }
  renderNode(node, arg = {}) {
    if (!node) return

    const d = this.d
    const {gd} = d
    const itemWidth = node.width || arg.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = node.height || arg.itemHeight || d.itemHeight || d.conf.itemHeight
    const x = arg.itemWidth ? node.x : node.x - (itemWidth - (d.itemWidth || d.conf.itemWidth)) / 2

    gd.save()
    gd.beginPath()
    gd.globalAlpha = .75
    gd.rect(x + 1, node.y, itemWidth - 2, itemHeight)
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.font = d.conf.font
    gd.fillStyle = d.color.white
    gd.fillText(node.n, x + itemWidth / 2, node.y + itemHeight / 2)

    if ('balanceFactor' in node) {
      gd.textBaseline = 'bottom'
      gd.textAlign = 'center'
      gd.fillStyle = d.color.black

      ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, node.x + itemWidth / 2, (idx - arr.length + 1) * itemHeight + node.y)
      })
    }
  }
}
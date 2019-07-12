class Node {
  constructor(n, o) {
    o = {
      n,
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
  constructor(d = {}) {
    this.d = d
  }
  renderNode(node, o = {}) {
    if (!node) return

    const d = this.d
    const {gd} = d
    const itemWidth = node.width || o.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = node.height || o.itemHeight || d.itemHeight || d.conf.itemHeight
    const x = node.width ? node.x - (o.itemWidth || d.itemWidth || d.conf.itemWidth) / 2 : node.x

    gd.save()
    gd.globalAlpha = .8
    gd.beginPath()
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
      gd.fillStyle = d.color.black

      ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, node.x + itemWidth / 2, (idx - arr.length + 1) * 16 + node.y)
      })
    }
  }
}
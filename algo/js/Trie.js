class Trie extends Common {
  create() {
    const d = this.d

    //  your app's user interface. The framework, gestures cat dog deer pan panda
    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    d.strArr = d.str.toLowerCase().match(/\w+/g)
    d._strArr = d.str.split(/\s+/g)
    d.root = new Node('root', {map: {}, isWord: false})
    d.steps = []
    d.row = 3
    d.lenStep = Math.ceil(d._strArr.length / d.row)
    d.paddingTop = d.row * d.conf.lineHeight + d.conf.paddingV

    for (let i = 0; i < d._strArr.length; i += d.lenStep) {
      d.steps.push(d._strArr.slice(i, i + d.lenStep).clone())
    }

    d.gd.font = d.conf.font
    d.strWidth = d.gd.measureText(d.steps.first().join(' ')).width

    d.strArr.forEach((str, idx) => {
      let node = d.root

      for (let i = 0, len = str.length; i < len; i++) {
        const c = str[i]
        node = node.map[c] = node.map[c] || new Node(c, {map: {}, isWord: i === len - 1})
        node.fillStyle = d.color[node.isWord ? 'blue' : 'black']
      }
    })
  }
  setPos() {
    const d = this.d
    d.iLeft = 0
    d.contentHeight = 0

    function setPos(node, depth) {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        setPos(node.map[key], depth + 1)
      })

      node.x = d.iLeft
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (keys.length === 0) {
        d.iLeft += d.conf.itemWidth
      } else {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      }
    }

    setPos(d.root, 0)
    d.contentWidth = d.iLeft
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {canvas, gd} = d

    const renderStr = () => {
      gd.textBaseline = 'top'
      gd.font = d.conf.font
      d.steps.forEach((row, idx) => {
        const str = row.join(' ')
        gd.fillText(str, (d.contentWidth - d.strWidth) / 2, idx * d.conf.lineHeight)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        const _node = node.map[key]

        renderLine(_node)

        gd.beginPath()
        gd.lineTo(node.x + d.conf.itemWidth / 2 + .5, node.y + d.conf.itemHeight / 2)
        gd.lineTo(_node.x + d.conf.itemWidth / 2 + .5, _node.y + d.conf.itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      })
    }

    const renderNode = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        renderNode(node.map[key])
      })

      this.renderNode(node)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderStr()
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}
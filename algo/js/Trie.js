class Trie extends Common {
  create() {
    const d = this.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    d.strArr = d.str.split(/\s+/g)
    d.steps = []
    d.arr = d.str.toLowerCase().match(/\w+/g)
    d.root = new Node('root', {map: {}, isWord: false, width: 50})
    d.row = 3
    d.lenRow = Math.ceil(d.strArr.length / d.row)
    d.paddingTop = d.row * d.conf.itemHeight + d.conf.paddingV

    for (let i = 0; i < d.strArr.length; i += d.lenRow) {
      d.steps.push(
        d.arr.slice(i, i + d.lenRow)
      )
    }

    d.gd.font = d.conf.font
    d.textWidth = d.gd.measureText(d.steps[0].join(' ')).width

    d.arr.forEach((str, idx) => {
      let node = d.root

      for (let i = 0, len = str.length; i < len; i++) {
        let c = str[i]
        node = node.map[c] = node.map[c] || new Node(c, {map: {}, isWord: i === len - 1})
        node.fillStyle = d.color[node.isWord ? 'blue' : 'black']
      }
    })
  }
  setPos() {
    const d = this.d

    d.contentWidth = 0
    d.contentHeight = 0

    function setPos(node, depth) {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        setPos(node.map[key], depth + 1)
      })

      node.x = d.contentWidth
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (keys.length > 0) {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      } else {
        d.contentWidth += d.conf.itemWidth
      }
    }

    setPos(d.root, 0)
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderText = () => {
      gd.fillStyle = d.color.black
      gd.font = d.conf.font
      gd.textBaseline = 'top'

      d.steps.forEach((row, idx) => {
        const str = row.join(' ')
        gd.fillText(str, (d.contentWidth - d.textWidth) / 2, idx * d.conf.itemHeight)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx) => {
        const _node = node.map[key]

        renderLine(_node)

        gd.beginPath()
        gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
        gd.lineTo(_node.x + d.conf.itemWidth / 2, _node.y + d.conf.itemHeight / 2)
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
    renderText(d.root)
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}
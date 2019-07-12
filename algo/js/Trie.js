class Trie extends Common {
  create() {
    const d = this.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda new news`
    d.words = d.str.toLowerCase().match(/\w+/g)
    d.root = new Node('root', {map: {}, isWord: false})

    d.row = 3
    d.paddingTop = d.row * 18 + 10
    d.strArr = d.str.split(/\s+/g)
    d.lenStep = Math.ceil(d.strArr.length / d.row)
    d.steps = []
    d.gd.font = d.conf.font

    for (let i = 0; i < d.strArr.length; i += d.lenStep) {
      d.steps.push(d.strArr.slice(i, i + d.lenStep).join(' '))
    }

    d.textWidth = d.steps.map(str => d.gd.measureText(str).width).max()
    d.words.forEach((word, idx) => {
      let node = d.root

      for (let i = 0, len = word.length; i < len; i++) {
        const c = word[i]
        node = node.map[c] = node.map[c] || new Node(c, {map: {}, isWord: i === len - 1})
        node.isWord && (node.fillStyle = d.color.blue)
      }
    })
  }
  setPos() {
    const d = this.d

    d.iLeft = 0
    d.contentHeight = 0

    const setPos = (node, depth) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        setPos(node.map[k], depth + 1)
      })

      node.x = d.iLeft
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.contentHeight = Math.max(d.contentHeight, node.y + d.conf.itemHeight)

      if (keys.length > 0) {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      } else {
        d.iLeft += d.conf.itemWidth
      }
    }

    setPos(d.root, 0)

    d.contentWidth = d.iLeft
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.scale
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.conf.itemWidth
    const itemHeight = d.conf.itemHeight

    gd.font = d.conf.font

    const renderText = () => {
      d.steps.forEach((str, idx) => {
        gd.textAlign = 'left'
        gd.textBaseline = 'top'
        gd.fillStyle = d.color.black
        gd.fillText(str, (d.contentWidth - d.textWidth) / 2, idx * 18)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        renderLine(node.map[k])
        const _node = node.map[k]

        gd.beginPath()
        gd.lineTo(node.x + itemWidth / 2 + .5, node.y + itemHeight / 2)
        gd.lineTo(_node.x + itemWidth / 2 + .5, _node.y + itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      })
    }

    const renderNode = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        renderNode(node.map[k])
      })

      this.renderNode(node)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderText()
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}
class Trie extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    d.strArr = d.str.toLowerCase().match(/\w+/g) || []
    d.root = new Item('root', {map: {}, isWord: false})

    d.lineHeight = 14 * 1.5
    d.row = 3
    d.steps = []
    d.lenStep = Math.ceil(d.strArr.length / d.row)

    for (let i = 0, len = d.strArr.length; i < len; i += d.lenStep) {
      d.steps.push(d.strArr.slice(i, i + d.lenStep).join(' '))
    }

    d.paddingTop = d.row * d.lineHeight + d.conf.paddingV
    d.gd.font = d.conf.font
    d.textWidth = d.gd.measureText(d.steps[0]).width
  }
  create() {
    const d = this.d

    d.strArr.forEach((word, idx) => {
      let node = d.root

      for (let i = 0, len = word.length; i < len; i++) {
        const c = word[i]
        node = node.map[c] = node.map[c] || new Item(c, {map: {}, isWord: i === len - 1})
        node.isWord && (node.fillStyle = d.color.blue)
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
    d.canvas.width = (d.contentWidth + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2 + d.conf.itemHeight) * d.conf.devicePixelRatio
  }
  render() {
    const d = this.d
    const {gd, canvas} = d

    const renderText = () => {
      gd.font = d.conf.font
      gd.fillStyle = d.color.black

      d.steps.forEach((str, idx) => {
        ++d.countRender
        gd.fillText(str, (d.contentWidth - d.textWidth) / 2, idx * d.lineHeight + d.conf.paddingV)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      ++d.countRender
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

    const renderItem = (node) => {
      const keys = Object.keys(node.map)

      ++d.countRender
      keys.forEach((key, idx) => {
        renderItem(node.map[key])
      })

      this.renderItem(node)
    }

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderText()
    renderLine(d.root)
    renderItem(d.root)
    gd.restore()
  }
}
class Trie extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    d.arr = d.str.toLowerCase().match(/\w+/g) || []
    d.strArr = []
    d.root = new Node('root', {map: {}})
  }
  create() {
    const me = this
    const d = me.d
    const arrStr = d.str.split(/\s+/)
    const step = Math.ceil(arrStr.length / 3)
    
    for (let i = 0; i < arrStr.length; i += step) {
      d.strArr.push(
        arrStr.slice(i, i + step).join(' ')
      )
    }

    d.arr.forEach((str, idx, arr) => {
      me.add(str)
    })
  }
  add(str) {
    const me = this
    const d = me.d
    let node = d.root

    for (let i = 0; i < str.length; i++) {
      const c = str[i]

      node.map[c] = node.map[c] || new Node(c, {map: {}})
      node = node.map[c]
    }

    node.isWord = true
    node.fillStyle = Node.color.blue
  }
  setPos() {
    const me = this
    const d = me.d

    d.level = -1
    d.iLeft = 0
    d.iHeight = 0

    function setPos(node) {
      const keys = Object.keys(node.map)

      d.level++
      keys.forEach((key, idx, arr) => {
        setPos(node.map[key])
      })
      node.x = d.iLeft
      node.y = d.level * d.conf.levelHeight + d.strArr.length * 20 + d.conf.paddingV
      d.iHeight = Math.max(d.iHeight, node.y)
      d.level--

      if (keys.length === 0) {
        d.iLeft += d.conf.itemWidth
      } else {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      }
    }

    setPos(d.root)
    d.canvas.width = (d.iLeft + d.conf.paddingH * 2) * d.conf.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.conf.devicePixelRatio + 'px'
    d.canvas.height = (d.iHeight + d.conf.itemHeight + d.conf.paddingV * 2) * d.conf.devicePixelRatio
  }
  render() {
    const me = this
    const d = me.d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const {canvas, gd} = d

    function renderLine(node) {
      const keys = Object.keys(node.map)

      keys.forEach((key, idx, arr) => {
        const _node = node.map[key]
        renderLine(_node)

        gd.beginPath()
        gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
        gd.lineTo(_node.x + itemWidth / 2, _node.y + itemHeight / 2)
        gd.strokeStyle = Node.color.black
        gd.stroke()
      })
      
      me.renderNode(node)
    }

    function renderNode(node) {
      const keys = Object.keys(node.map)

      me.renderNode(node)

      keys.forEach((key, idx, arr) => {
        renderNode(node.map[key])
      })
    }

    gd.save()
    gd.scale(d.conf.devicePixelRatio, d.conf.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)

    gd.save()
    gd.font = d.conf.fontLg
    gd.translate((canvas.width / d.conf.devicePixelRatio - d.conf.paddingH * 2 - gd.measureText(d.strArr[0]).width) / 2, 0)
    d.strArr.forEach((str, idx, arr) => {
      gd.textBaseline = 'top'
      gd.fillStyle = Node.color.black
      gd.fillText(str, 0, idx * 20)
    })
    gd.restore()

    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}
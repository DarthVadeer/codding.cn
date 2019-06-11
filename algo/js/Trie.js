class Trie extends Common {
  constructor() {
    super(...arguments)

    const me = this
    const d = me.d

    // d.str = 'cat dog deer panda pan'
    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda`
    // d.str = `Create your own custom views that conform to the View protocol, and compose them with SwiftUI views for displaying text, images, and custom shapes using stacks, lists, and more. Apply powerful modifiers to built-in views and your own views to customize their rendering and interactivity. Share code between apps on multiple platforms with views and controls that adapt to their context and presentation.`
    d.arr = d.str.toLowerCase().match(/\w+/g) || []
    d.root = {
      x: 0,
      y: 0,
      isWord: false,
      map: {}
    }
  }
  create() {
    const me = this
    const d = me.d

    d.arr.forEach((str, idx, arr) => {
      let curNode = d.root

      for (let i = 0, len = str.length; i < len; i++) {
        const k = str[i]

        if (!curNode.map[k]) {
          curNode.map[k] = {
            x: 0,
            y: 0,
            isWord: false,
            map: {}
          }
        }

        curNode = curNode.map[k]
      }

      curNode.isWord = true
    })
  }
  setPos() {
    const me = this
    const d = me.d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()
    const levelHeight = me.getLevelHeight()

    {
      d.textArr = []
      const arr = d.str.split(/\s+/g) || []
      let textLevel = 3
      let textLen = Math.ceil(arr.length / textLevel)

      for (let i = 0; i < textLevel; i++) {
        d.textArr.push(arr.slice(i * textLen, (i + 1) * textLen))
      }
    }

    d.level = -1
    d.iLeft = 0
    d.iHeight = 0

    function setPos(node) {
      if (!node) return

      const keys = Object.keys(node.map)
      // .sort((a, b) => a.localeCompare(b))

      d.level++
      keys.forEach((key, idx, arr) => {
        setPos(node.map[key], key)
      })

      node.x = keys.length > 0 ? (node.map[keys.first()].x + node.map[keys.last()].x) / 2 : d.iLeft
      node.y = d.level * levelHeight + d.textArr.length * 18 + 20
      d.iHeight = Math.max(d.iHeight, node.y)

      keys.length === 0 && (d.iLeft += itemWidth * 1)
      d.level--
    }

    setPos(d.root, 'root')

    d.canvas.width = (d.iLeft + d.conf.paddingH * 2) * d.devicePixelRatio
    d.canvas.style.width = d.canvas.width / d.devicePixelRatio + 'px'
    d.canvas.height = (d.iHeight + itemHeight + d.conf.paddingV * 2) * d.devicePixelRatio
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const itemWidth = me.getItemWidth()
    const itemHeight = me.getItemHeight()

    d.level = 0
    d.iLeft = 0

    function renderLine(node) {
      if (!node) return

      const keys = Object.keys(node.map)

      keys.forEach((key, idx, arr) => {
        const to = node.map[key]
        renderLine(to, key)

        gd.beginPath()
        gd.lineTo(node.x + itemWidth / 2 + .5, node.y + itemHeight / 2)
        gd.lineTo(to.x + itemWidth / 2 + .5, to.y + itemHeight / 2)
        gd.strokeStyle = Node.color.black
        gd.stroke()
      })
    }

    function renderNode(node, nodeName) {
      if (!node) return

      const keys = Object.keys(node.map)

      keys.forEach((key, idx, arr) => {
        renderNode(node.map[key], key)
      })

      gd.save()
      gd.globalAlpha = .75
      gd.beginPath()
      gd.rect(node.x + 1, node.y, itemWidth - 2, itemHeight)
      gd.fillStyle = Node.color[node.isWord ? 'blue' : 'black']
      gd.fill()
      gd.restore()

      gd.fillStyle = Node.color.white
      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.font = d.conf.font
      gd.fillText(nodeName, node.x + itemWidth / 2, node.y + itemHeight / 2)
    }

    gd.fillStyle = Node.color.white
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.devicePixelRatio, d.devicePixelRatio)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    
    {
      gd.fillStyle = Node.color.black
      gd.font = d.conf.fontLg
      gd.textAlign = 'left'
      gd.textBaseline = 'top'
      
      let translateX = ((canvas.offsetWidth - d.conf.paddingH * 2) - gd.measureText(d.textArr[0]).width) / 2

      d.textArr.forEach((arr, idx) => {
        const str = arr.join(' ')
        gd.fillText(str, translateX, idx * 18)
      })
    }

    renderLine(d.root, 'root')
    renderNode(d.root, 'root')
    gd.restore()
  }
}
{
  Array.prototype.first = function() {
    return this[0]
  }

  Array.prototype.last = function() {
    return this[this.length - 1]
  }

  class BrainMap {
    constructor(d = {}) {
      const me = this
      me.d = d
      d.devicePixelRatio = devicePixelRatio === 1 ? 2 : devicePixelRatio
      // d.devicePixelRatio = devicePixelRatio
      d.itemHeight = 32
      d.levelHeight = 90
      d.font = '14px Arial'
      d.map = {}
      d.mapById = {}
      d.translateX = 0
      d.translateY = 0

      me.dataOrg()
      me.resize()
    }
    dataOrg() {
      const me = this
      const d = me.d

      d.data.forEach((node, idx, arr) => {
        node.id = idx + 1
        node.isShowChild = 1
        node.fillStyle = '#fff'
        node.x = 0
        node.y = 0
        d.map[node.pid] = d.map[node.pid] || []
        d.map[node.pid].push(node)
        d.mapById[node.id] = node
      })

      d.root = d.map[0][0]
    }
    getSibling(node) {
      const me = this
      return me.d.map[node.pid] || []
    }
    getChildren(node) {
      const me = this
      return me.d.map[node.id] || []
    }
    toggleNode(item) {
      const me = this
      const d = me.d

      item.isShowChild = !item.isShowChild

      function toggleNode(node) {
        if (node !== item) {
          node.x = item.tx + item.width / 2 - node.width / 2
          node.y = item.ty
        }

        me.getChildren(node).forEach((node, idx, arr) => {
          toggleNode(node)
        })
      }

      toggleNode(item)
      me.setPos()
    }
    resize() {
      const me = this
      const d = me.d
      const {canvas, gd} = d

      canvas.width = (canvas.offsetWidth) * d.devicePixelRatio
      canvas.height = (canvas.offsetHeight) * d.devicePixelRatio
      d.cx = canvas.offsetWidth / 2
      d.cy = canvas.offsetHeight / 2

      me.setPos()
    }
    setPos() {
      const me = this
      const d = me.d
      const {canvas, gd} = d
      let translateX = 0

      d.level = 0
      d.iLeft = 0
      d.iHeight = 0
      gd.font = d.font

      function setPos(node) {
        const sibling = d.map[node.id] || []

        node.width = Math.ceil(gd.measureText(node.name).width + 15)

        d.level++
        node.isShowChild && sibling.forEach((_node, idx, arr) => {
          setPos(_node, node)
        })

        node.tx = parseInt(d.iLeft)
        node.ty = d.level * d.levelHeight
        d.iHeight = Math.max(d.iHeight, node.y)

        if (sibling.length === 0 || !node.isShowChild) {
          d.iLeft += node.width + 15
          
          if (node === me.getSibling(node).last()) {
            let nodeP = d.mapById[node.pid]
            let iMaxWidth = 0

            while (nodeP) {
              iMaxWidth = Math.max(iMaxWidth, me.getChildren(nodeP).reduce((total, node) => total += node.width, 0))
              if (nodeP.width > iMaxWidth) {
                const children = me.getChildren(nodeP)
                const nodeL = children.first()
                const nodeR = children.last()
                d.iLeft = parseInt((nodeL.tx + nodeR.tx + nodeR.width) / 2 + nodeP.width / 2 + 20)
              }

              nodeP = d.mapById[nodeP.pid]
            }
          }
        }

        if (sibling.length > 0 && node.isShowChild) {
          const nodeL = sibling.first()
          const nodeR = sibling.last()
          node.tx = parseInt((nodeL.tx + nodeR.tx + nodeR.width) / 2 - node.width / 2)
        }

        d.level--
      }

      function updateCoord(node) {
        const list = d.map[node.id] || []

        node.tx += translateX

        node.isShowChild && list.forEach((_node, idx, arr) => {
          updateCoord(_node, node)
        })
      }

      setPos(d.root)

      translateX = parseInt(canvas.offsetWidth / 2 - d.root.tx - d.root.width / 2)
      updateCoord(d.root)

      d.data.forEach((item, idx, arr) => {
        console.log(item.tx, item.ty)
      })
    }
    nextFrame() {
      const me = this
      const d = me.d

      function updatePos(node) {
        let vx = (node.tx - node.x) / 10
        let vy = (node.ty - node.y) / 10

        vx = Math[vx > 0 ? 'ceil' : 'floor'](vx)
        vy = Math[vy > 0 ? 'ceil' : 'floor'](vy)

        node.x += vx
        node.y += vy

        node.isShowChild && me.getChildren(node).forEach((node, idx, arr) => {
          updatePos(node)
        })
      }

      updatePos(d.root)
      me.render()
    }
    render(e) {
      const me = this
      const d = me.d
      const {canvas, gd} = d
      let isCapture = false

      function renderLine(from) {
        const list = d.map[from.id] || []

        if (!from.isShowChild) return

        for (let i = 0; i < list.length; i++) {
          const to = list[i]

          list.forEach((to, idx, arr) => {
            const fromX = from.x + from.width / 2
            const fromY = from.y + d.itemHeight / 2
            const toX = to.x + to.width / 2
            const toY = to.y + d.itemHeight / 2

            gd.beginPath()
            gd.lineTo(fromX, fromY)
            gd.bezierCurveTo(
              fromX, fromY + d.levelHeight / 2,
              toX, toY - d.levelHeight / 2,
              toX, toY,
            )
            gd.strokeStyle = '#666'
            gd.stroke()

            renderLine(to)
          })
        }
      }

      function renderNode(node) {
        const list = d.map[node.id] || []

        gd.beginPath()
        gd.rect(node.x, node.y, node.width, d.itemHeight)
        gd.fillStyle = !node.isShowChild ? '#eee' : node.fillStyle
        gd.fill()
        gd.strokeStyle = '#ccc'
        gd.stroke()

        if (e && gd.isPointInPath((e.clientX || e.changedTouches[0].clientX) * d.devicePixelRatio, (e.clientY || e.changedTouches[0].clientY) * d.devicePixelRatio) && !isCapture) {
          isCapture = true
          me.toggleNode(node)
        }

        gd.fillStyle = '#333'
        gd.textAlign = 'center'
        gd.textBaseline = 'middle'
        gd.font = d.font
        gd.fillText(node.name, node.x + node.width / 2, node.y + d.itemHeight / 2)

        node.isShowChild && list.forEach((_node, idx, arr) => {
          renderNode(_node)
        })
      }

      gd.fillStyle = '#fff'
      gd.fillRect(0, 0, canvas.width, canvas.height)
      gd.save()
      gd.translate(d.translateX, d.translateY)
      {
        gd.save()
        gd.scale(d.devicePixelRatio, d.devicePixelRatio)
        renderLine(d.root)
        renderNode(d.root)
        gd.restore()
      }
      gd.restore()
    }
  }

  const c = document.getElementById('c')
  window.brainMap = new BrainMap({
    canvas: c,
    gd: c.getContext('2d'),
    data: [
      {"id": 1, "pid": 0, "name": "算法与数据结构"},
      {"id": 2, "pid": 1, "name": "排序"},
      {"id": 3, "pid": 1, "name": "树"},
      {"id": 4, "pid": 2, "name": "选择排序"},
      {"id": 5, "pid": 2, "name": "插入排序"},
      {"id": 6, "pid": 2, "name": "归并排序"},
      {"id": 7, "pid": 2, "name": "快速排序"},
      {"id": 8, "pid": 3, "name": "二分搜索树"},
      {"id": 9, "pid": 3, "name": "二叉堆"},
      {"id": 10, "pid": 3, "name": "AVL树"},
      {"id": 11, "pid": 3, "name": "红黑树"},
      {"id": 12, "pid": 3, "name": "线段树"},
      {"id": 12, "pid": 7, "name": "快速排序"},
      {"id": 12, "pid": 7, "name": "双路快排"},
      {"id": 12, "pid": 7, "name": "三路快排"},
    ]
  })

  window.addEventListener('resize', brainMap.resize.bind(brainMap), false)

  function loopDraw() {
    requestAnimationFrame(() => {
      brainMap.nextFrame()
      loopDraw()
    })
  }
  loopDraw()

  c.onmousedown = c.ontouchstart = function(e) {
    // e.preventDefault()

    const d = brainMap.d
    const originX = d.translateX / d.devicePixelRatio
    const originY = d.translateY / d.devicePixelRatio
    const x1 = e.clientX || e.targetTouches[0].clientX
    const y1 = e.clientY || e.targetTouches[0].clientY
    let isMoved = false

    document.onmousemove = document.ontouchmove = function(e) {
      const x2 = e.clientX || e.targetTouches[0].clientX
      const y2 = e.clientY || e.targetTouches[0].clientY
      
      d.translateX = (x2 - x1 + originX) * d.devicePixelRatio
      d.translateY = (y2 - y1 + originY) * d.devicePixelRatio

      isMoved = x1 !== x2 || y1 !== y2
    }
    document.onmouseup = function(e) {
      document.onmousemove = 
      document.onmouseup = null

      if (!isMoved) {
        brainMap.render(e)
      }
    }
  }
}
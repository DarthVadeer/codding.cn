<template>
  <div class="web-ftp">
    <div class="flex-layout">
      <div class="gray-title">
        <div class="fr btn-box">
          <button class="btn btn-primary btn-xs"
            @click="exec($event, '打开文件夹')"
          >打开文件夹</button>
          <button class="btn btn-primary btn-xs"
            @click="exec($event, '自动排版')"
          >自动排版</button>
          <button class="btn btn-danger btn-xs"
            @click="exec($event, '删除')"
          >删除</button>
        </div>
        <div class="ellipsis">
          <i class="glyphicon glyphicon-info-sign" style="top: 2px;"></i>
          <span>快捷操作</span>
        </div>
      </div>
      <div class="auto-flex web-ftp-body">
        <div class="dir-list"
          @mousedown="handleMouseDown"
          @contextmenu.prevent="exec($event, '显示右键菜单')"
          @dblclick="dblclickOpenDir($event)"
          @dragstart="handleDragstart"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <section
            v-for="(dirItem, idx) in r.dir.list"
            :key="dirItem.k"
            :data-key="dirItem.k"
            :style="dirItem.style"
            :class="['dir-el', {cur: idx === r.dir.cur}, 'flex-layout']"
            :data-idx="idx"
          >
            <div class="dir-title">
              <div class="inc-input">
                <input type="text" class="path-input"
                  :value="dirItem.path"
                  @keydown.stop.enter="$root.isRouterPush = true; dirItem.path = $event.target.value; $event.target.blur()"
                >
              </div>
              <div class="inc-icon">
                <i class="glyphicon glyphicon-pencil"></i>
                <i class="glyphicon glyphicon-remove"></i>
              </div>
            </div>
            <div class="dir-body auto-flex">
              <div class="space" v-if="(dir.map[dirItem.path] || {}).msg">
                <div class="alert alert-danger">{{(dir.map[dirItem.path] || {}).msg}}</div>
              </div>
              <ul class="file-list" v-else>
                <li class="file-item"
                  v-for="(item, idx) in dir.map[dirItem.path]"
                  :data-idx="idx"
                  :data-is-dir="item.isDir"
                  :data-main-type="item.mainType"
                >
                  <i
                    :class="['glyphicon']"
                  ></i>
                  <div class="file-name line-2">{{item.name}}</div>
                </li>
              </ul>
            </div>
            <div class="resize">
              <div class="line">
                <div class="l"></div>
                <div class="t"></div>
                <div class="r"></div>
                <div class="b"></div>
              </div>
              <div class="corner">
                <div class="lt"></div>
                <div class="rt"></div>
                <div class="rb"></div>
                <div class="lb"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div class="select-rect" ref="selectRect" style="display: none;"></div>
    
    <div class="fix-menu"
      ref="fixMenu"
      v-if="fixMenu.isShow"
      :style="{left: fixMenu.style.l + 'px', top: fixMenu.style.t + 'px', 'z-index': r.dir.zIndex + 1}"
    >
      <ul>
        <li
          v-for="(item, idx) in fixMenu.list"
          :cmd="item"
          @click="exec($event, item)"
        >{{item}}</li>
      </ul>
    </div>

    <transition name="fade">
      <div class="mask mask-open-dir"
        v-if="dir.open.isShow"
        @click="dir.open.isShow = false"
      >
        <div class="inner" @click.stop>
          <div class="gray-title">
            <div class="fr">
              <i class="glyphicon glyphicon-remove"
                @click="dir.open.isShow = false"
              ></i>
            </div>
            <div class="mid ellipsis">打开文件夹</div>
          </div>
          <form class="space" @submit.prevent="exec($event, 'do打开文件夹')">
            <table class="table-form">
              <tr>
                <td>
                  <input type="text" class="form-control" placeholder="打开文件夹"
                    v-model="dir.open.path"
                  >
                </td>
              </tr>
              <tr>
                <td>
                  <span class="ib" style="margin-right: 15px;">自动转换 。->. OR 、->/</span>
                  <toggle
                    v-model="r.dir.isReplaceCharacter"
                  ></toggle>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="submit" value="确定" class="btn btn-success btn-block">
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'webFtp',
  data() {
    return {
      ini: {
        uploadMaxFilesize: 0,
      },
      fixMenu: {
        isShow: false,
        style: {
          l: 100,
          t: 100,
        },
        list: []
      },
      dUpload: {
        isShow: 0,
        sizeTotal: 0,
        sizeUploaded: 0,
        sizeCur: 0,
        countTotal: 0,
        countUpload: 0,
        curName: '',
      },
      dir: {
        open: {
          isShow: false,
          path: '',
        },
        new: {
          isShow: false,
          isRename: false,
          isFileMove: false,
          isDir: false,
          dirFrom: '',
          dirTo: '',
          name: '',
        },
        map: {},
        mapSelected: {},
      },
    }
  },
  methods: {
    handleDrop(e) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dirEl = e.target.closest('.dir-el')
      
      r.dir.cur = parseInt(dirEl.dataset.idx)
      vm.getFileFromDataTransfer(e.dataTransfer, me.upload.bind(me))
    },
    async upload(files, cb) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dUpload = me.dUpload
      const filesNotUpload = []
      
      files = files.filter((file) => {
        const isSizeAllow = file.size <= me.ini.uploadMaxFilesize
        if (!isSizeAllow) {
          filesNotUpload.push(file)
        }
        return isSizeAllow
      })

      if (filesNotUpload.length > 0) {
        vm.alert('单文件上传最大不得超过：' + me.ini.uploadMaxFilesize.toSize() + '<br />' + filesNotUpload.map(f => '上传失败： ' + f.name).join('<br />'))
      }

      if (files.length === 0) {
        console.warn('没有可以上传的文件')
        return
      }

      for (let i = 0; i < files.length; i++) {
        await new Promise((next) => {
          const file = files[i]

          dUpload.sizeTotal = files.reduce((total, file) => total += file.size, 0)

          vm.ajax({
            method: 'POST',
            url: './api/webFtp.php',
            data: {
              a: 'upload',
              path: me.curPath + file.fullPath,
              file,
            },
            onprogress(e) {
              dUpload.sizeCur = e.loaded
              console.log(dUpload.sizeCur + dUpload.sizeUploaded, dUpload.sizeTotal, (dUpload.sizeCur + dUpload.sizeUploaded) / dUpload.sizeTotal)
            },
            succ(data) {
              console.log('upload succ: ' + file.name)
              dUpload.sizeCur = 0
              doNext()
            },
            fail(e) {
              console.log('upload err : ' + file.name, e)
              doNext()
            }
          })

          function doNext() {
            dUpload.sizeUploaded += file.size
            next()
          }
        })
      }
    },
    exec(e, action) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dir = me.dir
      const curPath = me.curPath
      let data = {}

      switch (action) {
        case '自动排版':
          {
            const dw = document.querySelector('.web-ftp .dir-list').clientWidth - 10
            const col = Math.floor(dw / 350)
            const size = parseInt(dw / col) - 10
            let row = -1

            vm.isRouterPush = true
            r.dir.list.forEach((v, idx) => {
              const style = v.style

              idx % col === 0 && row++
              style.width = style.height = size + 'px'
              style.left = idx % col * (size + 10) + 10 + 'px'
              style.top = row * (size + 10) + 10 + 'px'
            })

            me.$nextTick(() => {
              vm.isRouterPush = false
            })
          }
          break
        case '新建文件夹':
        case '新建文件':
          if (curPath) {
            e.stopPropagation()
            dir.new.isShow = true
            dir.new.isRename = false
            dir.new.isDir = action === '新建文件夹'
            dir.new.isFileMove = false
            dir.new.name = ''
            dir.new.dirFrom = ''
            dir.open.isShow = false
            me.fixMenu.isShow = false
          }
          break
        case '重命名':
          {
            const node = document.querySelector('.web-ftp .dir-el.cur li[draggable=true] .file-name')
            if (!node) break

            e.stopPropagation()
            dir.new.isShow = true
            dir.new.isRename = true
            dir.new.isFileMove = false
            dir.new.name = node.innerText
            dir.open.isShow = false
            me.fixMenu.isShow = false
            me.$nextTick(() => {
              const node = document.querySelector('.web-ftp .mask-operate-dir .form-control')
              node.focus()
              node.value.indexOf('.') > -1 ?
              node.setSelectionRange(0, node.value.lastIndexOf('.')) :
              node.select()
            })
          }
          break
        case 'do操作文件(夹)':
          dir.new.name = dir.new.name.trim()

          if (dir.new.isFileMove) {
            // 文件移动
            data = {
              a: 'rename',
              isFileMove: true,
              dirFrom: dir.new.dirFrom,
              dirTo: curPath,
              names: dir.new.names,
            }

            if (dir.map[curPath].msg) {
              console.log(dir.map[curPath].msg)
              break
            }
          } else {
            if (dir.new.isRename) {
              // 重命名
              data = {
                a: 'rename',
                dirFrom: curPath,
                dirTo: curPath,
                newName: dir.new.name,
                names: JSON.stringify(me.getSelectedFiles()),
                isUpdateExtension: r.dir.isUpdateExtension || '',
              }
            } else {
              // 新建文件(夹)
              data = {
                a: 'make' + (dir.new.isDir ? 'Dir' : 'File'),
                path: curPath,
                name: dir.new.name,
              }
            }
          }

          vm.get('./api/webFtp.php', data, (data) => {
            dir.new.isShow = false
            me.$delete(dir.map, dir.new.dirFrom)
            me.$delete(dir.mapSelected, dir.new.dirFrom)
            me.$delete(dir.map, curPath)
            me.$delete(dir.mapSelected, curPath)
            me.forceOpenDir()
          })
          break
        case '打开':
          console.log('打开')
          break
        case '打开文件夹':
          dir.new.isShow = false
          dir.open.isShow = true
          dir.open.path = ''
          me.fixMenu.isShow = false
          break
        case 'do打开文件夹':
          dir.open.path = me.correctPath(dir.open.path)
          vm.isRouterPush = true
          r.dir.zIndex++
          r.dir.list.push({
            path: dir.open.path,
            k: r.dir.zIndex,
            style: {
              width: '400px',
              height: '400px',
              left: '30px',
              top: '30px',
              zIndex: r.dir.zIndex,
            }
          })
          r.dir.cur = r.dir.list.length - 1
          // me.openDir(dir.open.path)
          dir.open.isShow = 0
          break
        case '批量打开文件夹':
          {
            const dirEl = document.querySelector('.web-ftp .dir-el.cur')
            const lis = [].slice.call(document.querySelectorAll('.web-ftp .dir-el.cur li[data-is-dir=true][draggable=true]'))

            if (lis.length > 0) {
              const delDir = r.dir.list.splice(r.dir.cur, 1)[0]
              const pos = {
                left: dirEl.offsetLeft,
                top: dirEl.offsetTop,
              }

              vm.isRouterPush = true
              lis.forEach((li, idx, arr) => {
                ++r.dir.zIndex
                r.dir.list.splice(r.dir.cur + idx, 0, {
                  path: me.correctPath(delDir.path + '/' + li.children[1].innerHTML),
                  k: r.dir.zIndex,
                  style: {
                    width: delDir.style.width,
                    height: delDir.style.height,
                    left: pos.left + idx * 26 + 'px',
                    top: pos.top + idx * 26 + 'px',
                    zIndex: r.dir.zIndex,
                  }
                })
              })
            }
          }
          break
        case '全选':
          if (document.activeElement.nodeName.toLowerCase() !== 'input') {
            e.preventDefault()
            ;[].slice.call(document.querySelectorAll('.web-ftp .dir-el.cur .file-list li')).forEach((li) => {
              li.draggable = true
            })
          }
          break
        case '复制':
          console.log('复制')
          break
        case '剪切':
          console.log('剪切')
          break
        case '粘贴':
          console.log('粘贴')
          break
        case '选中路径':
          {
            const node = document.querySelector('.web-ftp .dir-el.cur .dir-title .path-input')
            node.focus()
            node.select()
          }
          break
        case '删除':
          vm.get('./api/webFtp.php', {
            a: 'fileDelete',
            path: curPath,
            names: JSON.stringify(me.getSelectedFiles())
          }, (data) => {
            me.forceOpenDir()
          })
          break
        case '下载':
          console.log('下载')
          break
        case '下载zip':
          console.log('下载zip')
          break
        case '上传文件':
          console.log('上传文件')
          break
        case '上传文件夹':
          console.log('上传文件夹')
          break
        case '显示右键菜单':
          {
            const fixMenu = me.fixMenu
            fixMenu.isShow = true
            fixMenu.style.l = e.clientX
            fixMenu.style.t = e.clientY
            fixMenu.list = []

            if (e.target.closest('[draggable=true]')) {
              fixMenu.list = [
                // '打开',
                // '复制',
                // '剪切',
                // '删除',
                '重命名',
                '下载',
              ]
            } else {
              fixMenu.list = [
                '新建文件夹',
                '新建文件',
                '上传文件',
                '上传文件夹',
              ]
            }

            me.$nextTick(() => {
              const node = me.$refs.fixMenu
              const pos = node.getBoundingClientRect()

              if (pos.right > window.innerWidth) {
                node.style.left = window.innerWidth - pos.width - 5 + 'px'
              }

              if (pos.bottom > window.innerHeight) {
                node.style.top = window.innerHeight - pos.height - 5 + 'px'
              }
            })
          }
          break
        case '关闭面板':
          vm.isRouterPush = true
          r.dir.list.splice(r.dir.cur, 1)
          !(r.dir.cur >= 0 && r.dir.cur < r.dir.list.length) && (r.dir.cur = 0)
          break
        default:
          console.log('未处理的 action: ', action, e)
          break
      }
    },
    correctPath(path) {
      const me = this
      const root = me.$root
      const r = root.router
      
      r.dir.isReplaceCharacter && (path = path.replace('。', '.').replace('、', '/'))
      path = path.replace(/(\\|\/)+/g, '/').replace(/\/$/, '')
      return path
    },
    async loopOpenDir() {
      const me = this
      const vm = me.$root
      const r = vm.router
      const list = r.dir.list

      for (let i = 0; i < list.length; i++) {
        await new Promise((succ, err) => {
          me.openDir(list[i].path, succ)
        })
      }
    },
    openDir(path, cb) {
      const me = this
      const vm = me.$root
      const dir = me.dir

      if (dir.map[path]) {
        cb && cb()
        return
      }

      vm.$set(dir.map, path, [])
      vm.get('./api/webFtp.php', {
        a: 'openDir',
        path,
      }, (list) => {
        const dirs = []
        let group = {}

        list.forEach((item, idx, arr) => {
          item.type = vm.getFileType(item.name)
          item.mainType = vm.mapIcon[item.type] || ''

          if (item.isDir) {
            dirs.push(item)
          } else {
            group[item.type] = group[item.type] || []
            group[item.type].push(item)
          }
        })

        dirs.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })

        group = Object.keys(group).map((type) => {
          return {
            type,
            arr: group[type].sort((a, b) => {
              return a.name.localeCompare(b.name)
            })
          }
        }).sort((a, b) => a.type.localeCompare(b.type)).map(v => v.arr)

        dir.map[path] = dirs.concat(Array.prototype.concat.apply([], group))
        cb && cb()
      }, (xhr, data) => {
        vm.$set(dir.map, path, data)
        cb && cb()
      })

      dir.new.isShow = false
    },
    dblclickOpenDir(e) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dirEl = e.target.closest('.dir-el')
      const li = e.target.closest('.dir-el li')
      const curPath = me.curPath

      if (!li || !li.dataset.isDir) return

      vm.isRouterPush = true
      r.dir.list[r.dir.cur].path = curPath + '/' + li.innerText
    },
    handleDragstart(e) {

    },
    handleMouseDown(e) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dir = me.dir
      const select = me.$refs.select
      const target = e.target

      const webFtpBody = target.closest('.web-ftp-body')
      const dirEl = target.closest('.dir-el')
      const fileList = dirEl.getElementsByClassName('file-list')[0]
      const dirTitle = target.closest('.dir-title')
      const dirList = target.closest('.dir-list')
      const dirBody = target.closest('.dir-body')
      const resize = target.closest('.resize')

      const x1 = e.clientX + webFtpBody.scrollLeft
      const y1 = e.clientY + webFtpBody.scrollTop
      const originX = dirEl.offsetLeft
      const originY = dirEl.offsetTop

      const dirIdx = r.dir.cur = parseInt(dirEl.dataset.idx)
      const rDir = r.dir.list[dirIdx]

      r.dir.cur = parseInt(dirEl.dataset.idx)
      rDir.style.zIndex = ++r.dir.zIndex

      if (e.target === document.activeElement) return

      document.activeElement.blur()

      if (dirTitle) {
        startDrag(e)
      } else if (resize) {
        startResize(e)
      } else if (target.closest('.file-list')) {
        startSelect(e)
      }

      function startDrag(e) {
        let _dirEl = dirEl
        let _rDir = rDir

        e.preventDefault()

        if (e.altKey) {
          vm.isRouterPush = true
          _rDir = vm.clone(_rDir)
          _rDir.k = ++r.dir.zIndex
          _rDir.style.zIndex = r.dir.zIndex
          r.dir.cur++
          r.dir.list.splice(r.dir.cur, 0, _rDir)
          vm.$nextTick(() => {
            _dirEl = dirList.children[r.dir.cur]
            _dirEl.style.transition = 'none'
          })
        } else {
          _dirEl.style.transition = 'none'
        }

        document.onmousemove = (e) => {
          const x2 = e.clientX + webFtpBody.scrollLeft
          const y2 = e.clientY + webFtpBody.scrollTop

          let x = x2 - x1 + originX
          let y = y2 - y1 + originY

          x = x < 0 ? 0 : x
          y = y < 0 ? 0 : y

          _dirEl.style.left = x + 'px'
          _dirEl.style.top = y + 'px'
        }

        document.onmouseup = (e) => {
          document.onmousemove =
          document.onmouseup = null

          vm.isRouterPush = true
          _dirEl.style.transition = ''
          _rDir.style.left = _dirEl.offsetLeft + 'px'
          _rDir.style.top = _dirEl.offsetTop + 'px'
        }
      }

      function startResize(e) {
        const originW = dirEl.offsetWidth
        const originH = dirEl.offsetHeight
        const sClass = e.target.className
        const isL = sClass.indexOf('l') > -1
        const isT = sClass.indexOf('t') > -1
        const iMin = 300
        const attr = ({
          'l': ['left', 'width'],
          't': ['top', 'height'],
          'r': ['width'],
          'b': ['height'],
          'lt': ['left', 'top', 'width', 'height'],
          'rt': ['top', 'width', 'height'],
          'rb': ['width', 'height'],
          'lb': ['left', 'width', 'height'],
        })[sClass]

        dirEl.style.transition = 'none'

        document.onmousemove = (e) => {
          const o = {}
          const x2 = e.clientX + webFtpBody.scrollLeft
          const y2 = e.clientY + webFtpBody.scrollTop

          const disX = x2 - x1
          const disY = y2 - y1

          o.left = disX + originX
          o.top = disY + originY
          o.width = (isL ? -disX : disX) + originW
          o.height = (isT ? -disY : disY) + originH

          if (o.left < 0 && isL) {
            o.width += o.left
            o.left = 0
          }

          if (o.top < 0 && isT) {
            o.height += o.top
            o.top = 0
          }

          if (o.width < iMin) {
            isL && (o.left -= iMin - o.width)
            o.width = iMin
          }

          if (o.height < iMin) {
            isT && (o.top -= iMin - o.height)
            o.height = iMin
          }

          attr.forEach((attr) => {
            dirEl.style[attr] = o[attr] + 'px'
          })
        }

        document.onmouseup = (e) => {
          document.onmousemove = document.onmouseup = null
          dirEl.style.transition = ''
          vm.isRouterPush = true
          rDir.style.width = dirEl.offsetWidth + 'px'
          rDir.style.height = dirEl.offsetHeight + 'px'
          rDir.style.left = dirEl.offsetLeft + 'px'
          rDir.style.top = dirEl.offsetTop + 'px'
        }
      }

      function startSelect(e) {
        const pos = dirBody.getBoundingClientRect()
        const _x1 = e.clientX + dirBody.scrollLeft - pos.left
        const _y1 = e.clientY + dirBody.scrollTop - pos.top
        const selectRect = dirBody.appendChild(me.$refs.selectRect)
        const curLi = target.closest('li')
        const oldLi = me.oldLi || fileList.children[0]
        const lis = Array.prototype.slice.call(fileList.children).map((li) => {
          return {
            l: li.offsetLeft,
            t: li.offsetTop,
            r: li.offsetLeft + li.offsetWidth,
            b: li.offsetTop + li.offsetHeight,
            ctrlSign: e.ctrlKey ? li.draggable : undefined,
            shiftSign: e.shiftKey ? li.draggable : undefined,
            li,
          }
        })
        let isMoved = false

        document.onmouseup = null

        if (target.closest('li[draggable=true]')) {
          if (e.ctrlKey) {
            document.onmouseup = fnUp
          } else if (e.shiftKey) {

          } else {
            document.onmouseup = selectOne
          }
        } else if (['glyphicon', 'file-name'].some(v => target.classList.contains(v))) {
          if (e.ctrlKey) {
            curLi.draggable = true
          } else if (e.shiftKey) {
            selectRange()
          } else {
            selectOne()
          }
        } else {
          e.preventDefault()
          document.onmousemove = fnMove
          document.onmouseup = fnUp
        }

        function selectOne() {
          lis.forEach(item => item.li.draggable = false)

          if (curLi) {
            curLi.draggable = true
            me.oldLi = curLi
          }
        }

        function selectRange() {
          const _start = parseInt(oldLi.dataset.idx)
          const _end = parseInt(curLi.dataset.idx)
          const start = Math.min(_start, _end)
          const end = Math.max(_start, _end)

          lis.forEach((v, idx) => {
            v.li.draggable = idx.inRange(start, end)
          })

          me.oldLi = document.querySelector('.web-ftp .dir-el.cur li[draggable=true]')
        }

        function fnMove(e) {
          const x2 = e.clientX
          const y2 = e.clientY

          const startX = _x1
          const startY = _y1
          const endX = x2 + dirBody.scrollLeft - pos.left
          const endY = y2 + dirBody.scrollTop - pos.top

          let l = Math.min(startX, endX)
          let t = Math.min(startY, endY)
          let w = Math.abs(startX - endX)
          let h = Math.abs(startY - endY)
          let r = l + w
          let b = t + h

          isMoved = x1 !== x2 || y1 !== y2
          isMoved && (selectRect.style.display = '')

          if (!isMoved) return

          if (l < 0) {
            w += l
            l = 0
          }

          if (t < 0) {
            h += t
            t = 0
          }

          if (w > dirBody.scrollWidth - l) {
            w = dirBody.scrollWidth - l
          }

          if (h > dirBody.scrollHeight - t) {
            h = dirBody.scrollHeight - t
          }

          selectRect.style.left = l + 'px'
          selectRect.style.top = t + 'px'
          selectRect.style.width = w + 'px'
          selectRect.style.height = h + 'px'

          lis.forEach((item) => {
            const li = item.li
            const isColl = !(
              item.l > r ||
              item.r < l ||
              item.t > b ||
              item.b < t
            )
            
            if (e.ctrlKey) {
              li.draggable = isColl ? !item.ctrlSign : item.ctrlSign
            } else if (e.shiftKey) {
              li.draggable = isColl || item.shiftSign
              isColl && delete item.shiftSign
            } else {
              li.draggable = isColl
            }
          })

          clearTimeout(me.timerScrollDir)

          if (e.clientY < pos.top ||e.clientY > pos.bottom) {
            const isScrollToTop = e.clientY < pos.top
            let dis = isScrollToTop ? e.clientY - pos.top : e.clientY - pos.bottom

            dis /= 5
            dis = dis > 0 ? Math.ceil(dis) : Math.floor(dis)
            dirBody.scrollTop += dis
            me.timerScrollDir = setTimeout(() => {
              fnMove(e)
            }, 13)
          }
        }

        function fnUp(e) {
          document.onmousemove = document.onmouseup = null
          selectRect.style.display = 'none'
          clearTimeout(me.timerScrollDir)

          if (isMoved) {
            delete me.oldLi
          } else {
            // 点选
            if (e.ctrlKey) {
              curLi && (curLi.draggable = !curLi.draggable)
            } else if (e.shiftKey) {
              selectRange()
            } else {
              selectOne()
            }
          }

          vm.$set(dir.mapSelected, me.curPath, dirEl.querySelectorAll('.web-ftp .dir.cur li[draggable=true]').length)
        }
      }
    },
    initEvents() {
      const me = this
      const vm = me.$root
      const r = vm.router
      
      document.onkeydown = (e) => {
        if (e.ctrlKey && e.shiftKey && e.altKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.ctrlKey && e.shiftKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.ctrlKey && e.altKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'f':
              me.exec(e, '自动排版')
              break
          }
        } else if (e.shiftKey && e.altKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.ctrlKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'a':
              me.exec(e, '全选')
              break
          }
        } else if (e.shiftKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.altKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'd':
              r.dir.list.length > 0 && e.preventDefault()
              me.exec(e, '选中路径')
              break
            case 'n':
              me.exec(e, '新建文件夹')
              break
            case 'o':
              me.exec(e, '打开文件夹')
              break
            case 'w':
              me.exec(e, '关闭面板')
              break
          }
        } else {
          switch (vm.keyMap[e.keyCode]) {
            case 'enter':
              me.exec(e, '批量打开文件夹')
              break
            case 'delete':
              me.exec(e, '删除')
              break
            case 'f2':
              me.exec(e, '重命名')
              break
          }
        }
      }
    },
    getIni() {
      const me = this
      const vm = me.$root
      const r = vm.router
      
      vm.get('./api/webFtp.php', {
        a: 'getIni'
      }, (data) => {
        me.ini.uploadMaxFilesize = data.uploadMaxFilesize.toSize()
      })
    },
  },
  computed: {
    r() {
      return this.$root.router
    },
    curDir() {
      const r = this.r
      return r.dir.list[r.dir.cur] || {}
    },
    curPath() {
      return this.curDir.path || ''
    },
  },
  watch: {
    'dir.open.isShow'(newVal) {
      if (!newVal) return
      this.$nextTick(() => {
        document.querySelector('.web-ftp .mask-open-dir .form-control').focus()
      })
    }
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router
    
    vm.webFtp = me
    vm.is.loading = false
    me.initEvents()
    me.loopOpenDir()
    me.getIni()
  },
  beforeCreate() {
    this.$root.webFtp = this
  },
  beforeDestroy() {
    document.onkeydown = null
    delete this.$root.webFtp
  },
}
</script>

<style lang="scss" scoped>
.web-ftp {
  .web-ftp-body {
    background: #d3d6d9; user-select: none;
    .dir-list {
      font-size: 12px;
      .glyphicon {cursor: inherit;}
      .dir-el {
        width: 400px; height: 400px; background: #fff; margin-bottom: 100px;
        position: absolute; left: 20px; top: 20px; box-shadow: 0 0 10px rgba(0,0,0,.2);
        border-radius: 4px; overflow: hidden;
        transition: .3s all;
        .dir-title {
          height: 34px; background: #eee;
          border-bottom: 1px solid #ddd; padding: 7px 7px 0 7px;
          display: flex; cursor: move;
          .inc-input {
            flex: 1;
            .path-input {
              width: 100%; height: 22px; text-indent: .2em; cursor: inherit;
              border: 1px solid transparent; background: transparent;
              &:focus {
                border-color: #ddd; background: #fff; outline: none; cursor: text;
              }
            }
          }
          .inc-icon {
            margin-left: 8px; padding-top: 3px;
            .glyphicon {margin-left: 4px;}
          }
        }
        .dir-body {
          .file-list {
            min-height: 100%; padding: 2px 2px 100px 2px; margin-bottom: 0;
            &:after {content: ""; display: block; clear: both;}
            .file-item {
              width: 75px; height: 75px; border: 1px solid transparent;
              margin: 2px; padding-top: .4em; float: left; text-align: center;
              // & {background: rgb(229,243,255);}
              &:hover {background: rgb(229,243,255);}
              &:active {background: rgb(216,234,255);}
              &[draggable=true]{background: #eee; border-color: #ddd;}
              .glyphicon {font-size: 28px;}
              .glyphicon:before {content: "\e022";}
              .file-name {line-height: 1.4em; max-height: 2.8em; padding: 0 .2em; word-break: break-all;}
              &[data-is-dir=true] {
                .glyphicon {
                  color: #fd5;
                  &:before {content: "\e117";}
                }
              }
              &[data-main-type=img] {
                .glyphicon:before {content: "\e060";}
              }
            }
          }
        }

        .resize {
          position: static;
          & > div > div {
            width: 6px; height: 6px; background: url(http://codding.cn/blank.php);
            position: absolute; left: 0; top: 0;
          }
          .line {
            & > div {}
            .l {height: 100%; cursor: w-resize;}
            .t {width: 100%; cursor: n-resize;}
            .r {height: 100%; left: auto; right: 0; cursor: e-resize;}
            .b {width: 100%; top: auto; bottom: 0; cursor: s-resize;}
          }
          .corner {
            & > div {width: 12px; height: 12px;}
            .lt {cursor: nw-resize;}
            .rt {left: auto; right: 0; cursor: ne-resize;}
            .rb {left: auto; right: 0; top: auto; bottom: 0; cursor: se-resize;}
            .lb {top: auto; bottom: 0; cursor: sw-resize;}
          }
        }

        &.cur {
          .dir-body {
            .file-list {
              .file-item[draggable=true] {
                background: rgb(204,232,255); border-color: rgb(153,209,255);
              }
            }
          }
        }
      }
    }
  }
  .select-rect {
    width: 100px; height: 100px;
    background: rgba(0,170,255,.5); border: 1px solid #09f;
    position: absolute; left: 10px; top: 10px;
    pointer-events: none;
  }

  .fix-menu {
    min-width: 80px; background: #fff; color: #555;
    white-space: nowrap;
    position: fixed; left: 50px; top: 100px; z-index: 2;
    border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,.3);
    user-select: none;
    ul {
      padding: 8px 0; margin-bottom: 0;
      li {
        padding: 4px 15px; cursor: pointer;
        &:hover {
          background: #337ab7; color: #fff;
        }
      }
    }
  }
}
</style>
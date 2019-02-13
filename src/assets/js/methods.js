import Hls from 'hls.js'

export default {
  rand: window.rand,
  routerInit() {
    const root = this.$root
    const channel = root.channel
    let r = {}

    try {
      r = JSON.parse(decodeURIComponent(location.hash.substring(1)))
    } catch (e) {
      console.warn('hash parse err')
    }

    r.coms = r.coms || ['algo']
    r.countAni = r.countAni || 0
    r.idxChannel = r.idxChannel || 0
    r.idxAlbum = r.idxAlbum || 0
    r.searchText = r.searchText || ''
    r.videoTitle = r.videoTitle || ''
    r.page = r.page || {}
    r.page.cur = r.page.cur || 1
    r.page.size = r.page.size || 100
    r.page.total = r.page.total || 0
    root.router = r
    root.sugg.text = r.searchText
  },
  updateRouter(o, isRouterPush) {
    const root = this.$root

    root.isRouterPush = isRouterPush
    
    for (let key in o) {
      root.$set(root.router, key, o[key])
    }
  },
  pushCom(com, o) {
    const root = this.$root
    const r = root.router

    o && root.updateRouter(o)
    if (com === r.coms[0]) return
    root.router.countAni++
    root.isRouterPush = true
    r.coms.unshift(com)
    while (r.coms.length > 2) r.coms.pop()
  },
  log(o) {
    console.log(o)
  },
  warn(o) {
    console.warn(o)
  },
  json2url(o) {
    return Object.keys(o).map(k => k + '=' + encodeURIComponent(o[k])).join('&')
  },
  jsonp(url, data, succ, fail) {
    const root = this.$root
    const script = document.createElement('script')
    const cbName = data['?']

    delete data['?']
    data[cbName] = ('jsonp_' + Math.random()).replace('0.', '')

    window[data[cbName]] = (data) => {
      succ && succ(data)
      document.body.removeChild(script)
    }

    script.onerror = (e) => {
      fail && fail(e)
    }

    script.src = url + '?' + root.json2url(data)
    document.body.appendChild(script)
  },
  lazyLoad() {
    const root = this.$root
    const r = root.router
    const dh = window.innerHeight
    
    clearTimeout(root.timerLazyLoad)
    root.timerLazyLoad = setTimeout(() => {
      ;[].slice.call(document.querySelectorAll('[lazy-load]')).forEach((node) => {
        const pos = node.getBoundingClientRect()

        if (pos.top > dh || pos.bottom < 0) return

        const oImg = new Image()
        const src = node.getAttribute('lazy-load')

        oImg.onload = oImg.onerror = (e) => {
          node.style.background = e.type === 'load' ?
          'url(' + src + ') no-repeat center / cover' :
          'url(' + src + 'url(./static/img/img-blank.png)'
        }
        oImg.src = src
        node.removeAttribute('lazy-load')
      })
    }, 200)
  },
  ajax(opt) {
    const root = this.$root
    const data = opt.data || {}
    const xhr = new XMLHttpRequest()
    let url = opt.url || ''

    url = /^http/.test(url) ? url : root.baseUrl + url
    opt.method = (opt.method || 'GET').toUpperCase()

    xhr.onload = xhr.onerror = (e) => {
      if (xhr.status === 200 || xhr.status === 304) {
        let data = xhr.responseText

        try {
          data = JSON.parse(data)
        } catch(e) {
          // 啥都不做
          // console.warn('数据解析失败')
        }

        if (data.code) {
          switch (data.code) {
            case 1:
              console.log(data.msg)
              return
          }
          opt.error && opt.error.call(root, xhr, {})
        } else {
          opt.succ && opt.succ.call(root, data, xhr)
        }
      } else {
        opt.error && opt.error.call(root, xhr, {})
      }
    }

    switch (opt.method) {
      case 'GET':
        xhr.open('GET', url + '?' + root.json2url(data), true)
        xhr.send()
        break
      case 'POST':
        const formData = new FormData()
        xhr.open('POST', url, true)
        for (let key in data) {
          formData.append(key, data[key])
        }
        xhr.send(formData)
        break
    }
  },
  get(url, data, succ, error) {
    this.ajax({
      method: 'GET',
      url,
      data,
      succ,
      error,
    })
  },
  post(url, data, succ, error) {
    this.ajax({
      method: 'POST',
      url,
      data,
      succ,
      error,
    })
  },
  loadScript(url, succ, error) {
    const script = document.createElement('script')
    script.src = url
    script.onload = script.onerror = (e) => {
      const cb = e.type === 'load' ? succ : error
      cb && cb()
      document.body.removeChild(script)
    }
    document.body.appendChild(script)
  },
  playM3u8() {
    const root = this.$root
    const r = root.router
    
    if (!r.m3u8) return

    root.$nextTick(() => {
      const videoUrl = r.m3u8
      const video = document.getElementById('hls-video-el')
      const isSupportM3u8 = root.is.supportM3u8

      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.currentTime = root.mapPlayTime[r.m3u8] || 0
          video.play()
        })
      } else {
        alert('你的设备不支持播放m3u8')
      }

      // if (isSupportM3u8) {
      //   video.src = videoUrl
      //   /*!root.is.local && */video.play()
      // } else if(Hls.isSupported()) {
      //   const hls = new Hls()
      //   hls.loadSource(videoUrl)
      //   hls.attachMedia(video)
      //   hls.on(Hls.Events.MANIFEST_PARSED, () => {
      //     /*!root.is.local && */video.play()
      //   })
      // } else {
      //   alert('你的设备不支持播放m3u8')
      // }
    })
  },
  initEvents() {
    const root = this.$root
    const r = root.router

    window.onkeydown = (e) => {
      const video = document.getElementById('hls-video-el')
      const keyMap = root.keyMap

      if (video) {
        switch (keyMap[e.keyCode]) {
          case 'enter':

            break
          case 'esc':
            
            break
          case 'space':
            if (root.is.edge || root.is.fireFox) {
              if (document.activeElement !== video) {
                video[video.paused ? 'play' : 'pause']()
              }
            } else {
              video[video.paused ? 'play' : 'pause']()
            }
            break
          case 'left':
            video.currentTime -= 10
            video.play()
            break
          case 'right':
            video.currentTime += 10
            video.play()
            break
          case 'up':
          case 'down':
            let curVolume = video.volume
            keyMap[e.keyCode] === 'up' ? (curVolume += .1) : (curVolume -= .1)
            curVolume > 1 && (curVolume = 1)
            curVolume < 0 && (curVolume = 0)
            curVolume = parseFloat(curVolume.toFixed(1))
            video.volume = curVolume
            break
        }
      } else {

      }
    }

    window.onresize = () => {
      root.lazyLoad()
      root.setVideoListItemWidth()
    }
    window.onresize()

    document.onclick = (e) => {
      root.sugg.isShow = 0
    }
  },
}
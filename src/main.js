import '@/assets/css/boot.css'
import '@/assets/css/reset.scss'
import '@/assets/css/main.scss'
import '@/assets/js/dataAux'
import '@/assets/js/com'

import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

window.$root = new Vue({
  el: '#app',
  data() {
    const root = this.$root
    const isLocal = ['172.16.6.169', 'localhost'].some(v => location.origin.indexOf(v) > -1)
    const ua = navigator.userAgent
    const ios = ua.indexOf('like Mac OS X') > -1
    const android = ua.indexOf('Android') > -1
    const mobile = ios || android

    return {
      isLocal,
      is: {
        ios,
        android,
        mobile,
        supportM3u8: document.createElement('video').canPlayType('application/vnd.apple.mpegurl')
      },
      router: {
        coms: [],
        searchText: '',
      },
      channel: {
        list: [],
        map: {},
        mapAlbum: {},
        listAlbum: [],
        isLoading: 1,
      },
      album: {
        map: {},
        list: [],
      },
      page: {
        page: 1,
        size: 50,
        total: 0,
        sizes: new Array(8).fill().map((_, idx) => (idx + 1) * 50),
      },
      lenAni: 30,
      ...App.rootData.call(root)
    }
  },
  methods: {
    ...require('@/assets/js/methods').default,
    ...App.rootMethods,
    init() {
      const root = this.$root
      
      root.fetchChannel((mapChannel) => {
        let mapAlbum = {}
        let listAlbum = []

        root.channel.list = Object.keys(mapChannel).map((nameAlbum) => {
          const v = mapChannel[nameAlbum]
          listAlbum = listAlbum.concat(v)
          v.forEach(v => mapAlbum[v.name] = v)

          return {
            idx: parseInt(nameAlbum.match(/\d+/)),
            name: nameAlbum,
          }
        }).sort((a, b) => {
          return a.idx - b.idx
        }).map((v) => {
          v.children = mapChannel[v.name]
          return v
        })

        root.channel.map = mapChannel
        root.channel.mapAlbum = mapAlbum
        root.channel.listAlbum = listAlbum

        root.routerInit()
        const r = root.router
        root.page.page = r.page || 1
        root.page.size = r.pageSize || 100
      })

      window.addEventListener('resize', root.lazyLoad.bind(root))
    },
  },
  watch: {
    ...require('@/assets/js/watch').default,
  },
  computed: {
    ...require('@/assets/js/computed').default,
  },
  components: { App },
  template: '<App/>',
  mounted() {
    const root = this.$root
    const r = root.router
  }
})

window.getHtml5VideoData = (data) => {
  const root = window.$root
  const videoUrl = JSON.parse(data).hls_url
  root.updateRouter({m3u8: videoUrl}, 'push')
}

window.onload = (e) => {
  const root = window.$root
  window.onpopstate = root.routerInit.bind(root)
  root.init()
}

document.addEventListener('keydown', (e) => {
  const root = window.$root
  const r = root.router
  const video = document.getElementById('videoEl')
  let volume

  if (!video) return

  volume = video.volume * 100

  switch (e.keyCode) {
    case 38:
      // 上
      // console.log(video.volume)
      volume += 5
      break
    case 40:
      // 下
      volume -= 5
      break
    case 37:
      // 左
      video.currentTime -= 10
      break
    case 39:
      // 右
      video.currentTime += 10
      break
    case 13:
      // enter
      if (e.altKey) {
        root.toggleFullScreen(e)
      }
      break
    case 32:
      // space
      root.togglePlay()
      break
  }

  volume < 0 && (volume = 0)
  volume > 100 && (volume = 100)
  video.volume = volume / 100
})

document.addEventListener('keydown', (e) => {
  const root = window.$root
  const r = root.router

  console.log(e.keyCode)
})


const nodeStyle = document.createElement('style')
nodeStyle.innerHTML = new Array(window.$root.lenAni).fill().map((_, idx) => {
  const dw = window.innerWidth
  const dh = window.innerHeight
  const rand = window.$root.rand
  const arr = [
    'translateX',
    'translateY',
    'translateZ',
    'rotateX',
    'rotateY',
    // 'rotate',
  ]
  const json = {
    translateX: 'translateX(' + rand(-dw, dw) + 'px)',
    translateY: 'translateY(' + rand(-dh, dh) + 'px)',
    translateZ: 'translateZ(' + rand(-dw, dw) + 'px)',
    rotateX: 'rotateX(' + rand(-180, 180) + 'deg)',
    rotateY: 'rotateY(' + rand(-180, 180) + 'deg)',
    // rotate: 'rotate(' + rand(-180, 180) + 'deg)',
  }
  let map = {}
  const styleTo = new Array(rand(2, 5)).fill().map((_, idx) => {
    const k = arr[rand(0, arr.length - 1)]
    map[k] = json[k]
  })

  return '\n\
    .ani-com-' + idx + '-enter-active, .ani-com-' + idx + '-leave-active {\n\
      transition: all 1s;\n\
    }\n\
    .ani-com-' + idx + '-enter, .ani-com-' + idx + '-leave-to {\n\
      opacity: 0;\n\
      transform: ' + Object.keys(map).map(v => map[v]).join(" ") + ';\n\
    }\n\
  '
}).join('')
document.body.appendChild(nodeStyle)
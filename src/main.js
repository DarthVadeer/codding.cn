import '@/assets/css/boot.css'
import '@/assets/css/reset.scss'
import '@/assets/css/main.scss'
import '@/assets/js/dataAux'
import '@/assets/js/com'

import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

window.vm = new Vue({
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
      },
      router: {
        searchText: '',
      },
      channel: {
        list: [],
        map: {},
        mapAlbum: {},
        listAlbum: [],
      },
      album: {
        map: {},
        list: [],
      },
      page: {
        page: 1,
        size: 100,
        total: 0,
        sizes: [100, 200, 300, 400, 500],
      },
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
  const videoUrl = JSON.parse(data).hls_url
  vm.updateRouter({m3u8: videoUrl}, 'push')
}

window.onload = (e) => {
  window.onpopstate = vm.routerInit.bind(vm)
  vm.init()
}

window.onkeydown = (e) => {
  const root = vm
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
}
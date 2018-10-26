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

    return {
      router: {},
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
    
    window.onload = root.init.bind(root)
    window.onpopstate = root.routerInit.bind(root)
  }
})

window.getHtml5VideoData = (data) => {
  const videoUrl = JSON.parse(data).hls_url
  vm.updateRouter({m3u8: videoUrl}, 'push')
}
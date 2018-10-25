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
      reDelBlank: /(《[^《》]*》)|(\s+)/g,
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
        sizes: [100, 200, 300, 400],
      },
      ...App.rootData.call(root)
    }
  },
  methods: {
    ...require('@/assets/js/methods').default,
    ...App.rootMethods,
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
    
    window.onpopstate = root.routerInit.bind(root)
  }
})

window.getHtml5VideoData = (data) => {
  const videoUrl = JSON.parse(data).hls_url
  vm.updateRouter({m3u8: videoUrl}, 'push')
  console.warn(videoUrl)
}
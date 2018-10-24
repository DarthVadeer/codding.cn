import '@/assets/css/boot.css'
import '@/assets/css/reset.scss'
import '@/assets/css/main.scss'

import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

new Vue({
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
    const root = window.vm = this.$root
    const r = root.router
    
    window.onpopstate = root.routerInit.bind(root)
  }
})
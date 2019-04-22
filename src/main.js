import './assets/css/reset.scss'

import '@/assets/js/dmAux'
import '@/assets/js/com'

import Vue from 'vue'
import App from './App'
import dm from '@/assets/js/dm'

Vue.config.productionTip = false

window.vm = new Vue({
  el: '#app',
  data() {
    return {
      ...dm.rootData.call(this),
    }
  },
  methods: {
    ...dm.rootMethods,
    ...require('@/assets/js/ajax').default,
    ...require('@/assets/js/player').default,
    ...require('@/assets/js/router').default,
    ...require('@/assets/js/lazyLoad').default,
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
    const me = this
    const vm = me.$root
    const r = vm.router
    
    vm.get('./api/pub.php', {
      a: 'test'
    }, (data) => {}, (e) => {
      console.log(e)
      vm.alert('接口探测失败')
    })
  }
})

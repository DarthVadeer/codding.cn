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
    
    vm.is.local && vm.get('./api/pub.php', {
      a: 'test'
    }, (data) => {}, (e) => {
      console.log(e)
      vm.alert('接口探测失败')
    })
  }
})


{
  const nodeStyle = document.createElement('style')
  nodeStyle.innerHTML = new Array(vm.lenAni).fill().map((_, idx) => {
    const dw = window.innerWidth
    const dh = window.innerHeight
    // const rand = vm.rand
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
      translateZ: 'translateZ(' + rand(-dw, 0) + 'px)',
      rotateX: 'rotateX(' + rand(-180, 180) + 'deg)',
      rotateY: 'rotateY(' + rand(-180, 180) + 'deg)',
      // rotate: 'rotate(' + rand(-180, 180) + 'deg)',
    }
    let map = {}
    new Array(rand(2, 5)).fill().forEach((_, idx) => {
      const k = arr[rand(0, arr.length - 1)]
      map[k] = json[k]
    })

    return `
      .ani-com-${idx}-enter-active, .ani-com-${idx}-leave-active {
        transition: all 1s;
      }
      .ani-com-${idx}-enter, .ani-com-${idx}-leave-to {
        opacity: 0;
        transform: ${Object.keys(map).map(v => map[v]).join(" ")};
      }
    `
  }).join('')
  document.body.appendChild(nodeStyle)
}
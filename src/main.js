import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/css/main.scss'

import dataAux from '@/assets/js/dataAux'
import com from '@/assets/js/com'
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

window.vm = new Vue({
  el: '#app',
  data() {
    const root = this.$root

    return {
      ...dataAux.rootData.call(root),
      ...App.rootData.call(root),
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
    
    root.initUrlSearchData()
    root.initEvents()
    root.initChannel(() => {
      root.routerInit()
      window.onpopstate = root.routerInit.bind(root)
      setTimeout(root.lazyLoad.bind(root), 600)

      // root.alert(JSON.stringify(root.urlSearchData))
    })
  }
})

{
  const nodeStyle = document.createElement('style')
  nodeStyle.innerHTML = new Array(vm.lenAni).fill().map((_, idx) => {
    const dw = window.innerWidth
    const dh = window.innerHeight
    const rand = vm.rand
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

if (location.origin.indexOf('jojojs.com') > -1) {
  location.href = './fans'
}
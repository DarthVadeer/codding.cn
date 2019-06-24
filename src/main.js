import '@/assets/css/reset.scss'
import '@/assets/js/dmAux'
// import '@/assets/js/com'

import Vue from 'vue'
import App from './App.vue'
import dm from '@/assets/js/dm'
import lazyLoad from '@/assets/js/lazyLoad'
import router from '@/assets/js/router'

Vue.config.productionTip = false

window.vm = new Vue({
  data() {
    return {
      appName: '田小号🎺',
      ...dm.rootData.call(this),
    }
  },
  methods: {
    ...router,
    ...lazyLoad,
    ...dm.rootMethods,
  },
  computed: {
    ...require('@/assets/js/computed').default,
  },
  watch: {
    ...require('@/assets/js/watch').default,
  },
  mounted() {
    const vm = this.$root
    const r = vm.router

    vm.initSearch()
    vm.initRouter()
    vm.initEvents()
  },
  render: h => h(App),
}).$mount('#app')

{
  const sStyleDef = vm.is.android || vm.is.windows ? `
    select {border-radius: 4px; border-color: #ccc;}
  ` : ``
  const nodeStyle3D = document.createElement('style')
  nodeStyle3D.id = 'nodeStyle3D'
  nodeStyle3D.innerHTML = new Array(vm.lenAni).fill().map((_, idx) => {
    const dw = window.innerWidth
    const dh = window.innerHeight
    const deg = 180

    let arr = [
      'translateX(' + rand(-dw, dw) + 'px)',
      'translateY(' + rand(-dh, dh) + 'px)',
      'translateZ(' + rand(-dw, 0) + 'px)',
      'rotateX(' + rand(-deg, deg) + 'deg)',
      'rotateY(' + rand(-deg, deg) + 'deg)',
      // 'rotate(' + rand(-deg, deg) + 'deg)',
    ].shuffle()

    arr.length = rand(2, 5)

    return `
      .ani-com-${idx}-enter-active, .ani-com-${idx}-leave-active {
        transition: all 1s;
      }
      .ani-com-${idx}-enter, .ani-com-${idx}-leave-to {
        opacity: 0;
        transform: ${arr.join(' ')};
      }
    `
  }).join('') + sStyleDef

  document.body.appendChild(nodeStyle3D)
}
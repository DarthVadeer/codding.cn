import '@/assets/css/reset.scss'
import '@/assets/js/com'
import Vue from 'vue'
import App from './App.vue'
import router from '@/assets/js/router'
import dm from '@/assets/js/dm'
import dmAux from '@/assets/js/dmAux'

Vue.config.productionTip = false

window.vm = new Vue({
  name: 'main',
  data() {
    return {
      lenAni: 40,
      ...dmAux.data.call(this),
      ...dm.data.call(this),
      ...router.data.call(this),
    }
  },
  methods: {
    ...require('@/assets/js/lazyLoad').default,
    ...require('@/assets/js/ev').default,
    ...dm.methods,
    ...router.methods,
  },
  watch: {
    ...require('@/assets/js/watch').default,
  },
  computed: {
    ...require('@/assets/js/computed').default,
  },
  render: h => h(App),
  mounted() {
    const vm = this

    vm.initRouter()
    vm.initEvents()
  },
}).$mount('#app')

{
  const sStyleDef = vm.is.android || vm.is.windows ? `
    select {border-radius: 4px; border-color: #ccc;}
  ` : ``

  $(`
    <style id="node-style-3d">
      ${
        Array(vm.lenAni).fill().map((_, idx) => {
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
      }
    </style>
  `).appendTo('body')
}

$(`
  <style id="list-respond">
    .list-respond {padding: 8px;}
    .list-respond > section {width: 100%; display: inline-block; padding: 8px; transition: .3s opacity;}
    .list-respond > section > .inner {background: #eee; border-radius: 4px; overflow: hidden; border: 1px solid #ccc;}
    .list-respond > section > .inner .img-box {padding-top: 100%; background: #fff no-repeat center / contain; cursor: pointer;}
    .list-respond > section > .inner .text-box {line-height: 3em; padding: 0 1em; border-top: 1px solid #ccc;}
    ${
      Array(10).fill().map((_, idx, arr) => {
        const size = (idx + 1) * 260
        const n = Math.ceil(size / 260)
        let per = 1 / n * 100
        per > 50 && (per = 50)
        
        return `
          @media (min-width: ${size}px) {
            .list-respond > section {width: ${per}%;}
          }
        `
      }).join('')
    }
  </style>
`).appendTo('body')


{
  const nodeStyleRespond = document.getElementById('cctv-media') || document.createElement('style')
  let sCss = ''

  nodeStyleRespond.id = 'node-sytle-respond'

  sCss += new Array(50).fill().map((_, idx) => {
    let w = idx * 280 + 500
    const n = Math.ceil(w / 280)

    // .cctv .video-main-wrapper .video-group li {

    return `
      @media (min-width: ${w}px) {
        .respond-list .respond-item {
          width: ${1 / n * 100}%;
        }
      }
    `
  }).join('')

  sCss = `
    @media (max-width: 500px) {
      .respond-list .respond-item {
        width: 50%;
      }
    }
  ` + sCss

  nodeStyleRespond.innerHTML = sCss
  document.body.appendChild(nodeStyleRespond)
}

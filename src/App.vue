<template>
  <div id="app" @click="clickFullPanel">
    <div class="flex-layout">
      <topbar></topbar>
      <div class="auto-flex container-wrapper">
        <!-- <transition-group :name="'ani-com-' + ($root.router.countAni % $root.lenAni)"> -->
        <transition-group name="fade">
          <div
            v-for="(item, idx) in $root.router.coms"
            :key="item.com + '-' + idx"
            :is="item"
            v-if="idx === 0"
          ></div>
        </transition-group>
      </div>
    </div>

    <alert></alert>
    <confirm></confirm>
  </div>
</template>

<script>
const coms = [
  'components/topbar',
  'components/cctv',
  'components/webFtp',
  'components/dbAdmin',
  'components/algo',
].map((path) => {
  return require('@/' + path).default
})

export default {
  name: 'App',
  methods: {
    clickFullPanel() {
      const me = this
      const vm = me.$root
      const r = vm.router
      
      if (vm.cctv) {
        vm.cctv.sugg.list = []
      }
    },
    initEvents() {
      const vm = this.$root

      // window.onpopstate = vm.initRouter.bind(vm)
      window.addEventListener('popstate', vm.initRouter.bind(vm), false)
      window.addEventListener('resize', handleResize, false)
      window.addEventListener('orientationchange', handleResize, false)
      // window.onresize = window.onorientationchange = 

      function handleResize(e) {
        vm.dw = window.innerWidth
        vm.dh = window.innerHeight
        vm.lazyLoad.call(vm)
      }

      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'y':
              history.forward()
              break
            case 'z':
              history.back()
              break
          }
        } else {
          switch (vm.keyMap[e.keyCode]) {
            case 'esc':
              vm.alertData.isShow = false
              vm.confirmData.isShow = false
              break
          }
        }
      }, false)
    },
  },
  components: {
    ...(() => {
      const map = {}
      coms.forEach((com) => {
        map[com.name] = com
      })
      return map
    })()
  },
  beforeCreate() {
    this.$root.app = this
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router
    
    vm.initSearch()
    vm.initRouter()
    this.initEvents()
  },
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%; background: #000;
  .container-wrapper {
    z-index: 1;
    & > span,
    & > span > div {
      width: 100%; height: 100%; position: absolute; left: 0; top: 0;
    }
    & > span {
      transform-style: preserve-3d; transform: perspective(800px);
    }
    & > span > div {
      background: #fff;
    }
  }
}
</style>
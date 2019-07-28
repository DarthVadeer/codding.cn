export default {
  data() {
    return {
      router: {},
      searchMap: {},
    }
  },
  methods: {
    initRouter() {
      const vm = this
      let r = {}

      try {r = JSON.parse(decodeURIComponent(location.hash.substring(1)))} catch (e) {}

      location.search.slice(1).split('&').forEach((str, idx) => {
        if (!str) return
        const arr = str.split('=')
        try {
          r[arr[0]] = decodeURIComponent(arr[1])
        } catch (e) {
          r[arr[0]] = arr[1]
        }
      })

      r.coms = r.coms || ['cctv']
      r.countAni = r.countAni || 0
      vm.router = r
    },
    updateRouter(o = {}, isRouterPush) {
      const vm = this
      const r = vm.router

      vm.isRouterPush = isRouterPush
      for (let key in o) vm.$set(r, key, o[key])
    },
    pushCom(com, o) {
      const vm = this
      const r = vm.router
      const sameCom = com === vm.com
      let coms = clone(r.coms)

      if (sameCom && Object.keys(r).length < 3) {
        console.log('same com out...')
        return
      }

      vm.isRouterPush = true
      coms.unshift(com)
      coms.length > 2 && (coms.length = 2)
      vm.router = {coms, countAni: r.countAni}
      !sameCom && ++vm.router.countAni
    },
  }
}
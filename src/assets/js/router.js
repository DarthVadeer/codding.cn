export default {
  initRouter() {
    const vm = this.$root
    let r

    try {
      r = JSON.parse(decodeURIComponent(location.hash.substring(1)))
    } catch (e) {
      r = {}
    }

    r.coms = r.coms || []
    r.coms[0] = r.coms[0] || 'cctv'

    r.page = r.page || {}
    r.page.cur = r.page.cur || 0
    r.page.size = r.page.size || 100
    r.page.total = r.page.total || 0

    r.countAni = r.countAni || 0

    /*for (let key in r) {
      vm.$set(vm.router, key, r[key])
    }*/
    vm.router = r
  },
  initSearch() {
    const vm = this
    let r = {}

    location.search.substring(1).split('&').forEach((str) => {
      if (!str) return
        
      const t = str.split('=')

      try {
        t[1] = decodeURIComponent(t[1])
      } catch (e) {}

      r[t[0]] = t[1]
    })

    Object.keys(r).forEach((k) => {
      vm.$set(vm.search, k, r[k])
    })
  },
  pushCom(com, o) {
    const vm = this.$root
    const r = vm.router

    if (com === r.coms[0]) return

    vm.updateRouter({
      ...o,
      idxChannel: undefined,
      idxAlbum: undefined,
      videoInfo: undefined,
    }, 'push')
    vm.router.countAni++
    r.coms.unshift(com)
    while (r.coms.length > 2) r.coms.pop()
  },
  updateRouter(o, isRouterPush) {
    const vm = this.$root
    const r = vm.router

    vm.is.routerPush = isRouterPush

    for (let key in o) {
      vm.$set(r, key, o[key])
    }
  },
}
export default {
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
      vm.$set(vm.searchData, k, r[k])
    })
  },
  initRouter() {
    const vm = this
    let r = {}

    try {
      r = JSON.parse(decodeURIComponent(location.hash.substring(1)))
    } catch (e) {
      console.log('hash parse err')
    }

    r.coms = r.coms || []
    r.coms[0] = r.coms[0] || 'cctv'
    r.idxChannel = r.idxChannel || 0
    r.idxAlbum = r.idxAlbum || 0
    r.idxAux9 = r.idxAux9 || 0
    r.playDirection = r.playDirection === undefined ? 1 : r.playDirection
    r.searchText = r.searchText || ''

    r.page = r.page || {}
    r.page.cur = r.page.cur || 0
    r.page.size = r.page.size || 100
    r.page.total = r.page.total || 0

    r.videoInfo = r.videoInfo || {}
    r.videoInfo.id = r.videoInfo.id || ''
    r.videoInfo.title = r.videoInfo.title || ''
    r.videoInfo.m3u8 = r.videoInfo.m3u8 || ''

    Object.keys(r).forEach((k) => {
      vm.$set(vm.router, k, r[k])
    })
  },
  pushCom(com, o) {
    const root = this.$root
    const r = root.router

    if (com === r.coms[0]) return
    root.isRouterPush = true
    o && root.updateRouter(o)
    root.router.countAni++
    r.coms.unshift(com)
    while (r.coms.length > 2) r.coms.pop()
  },
  updateRouter(o, isRouterPush) {
    const vm = this.$root
    const r = vm.router
    
    vm.isRouterPush = isRouterPush
    Object.keys(o).forEach((k, idx, arr) => {
      vm.$set(r, k, o[k])
    })
  },
}
export default {
  router: {
    deep: true,
    handler(newVal) {
      const vm = this.$root

      let hashData = JSON.stringify(newVal)
      !vm.is.local && (hashData = encodeURIComponent(hashData))
      const targetUrl = location.origin + location.pathname + location.search + '#' + hashData

      history[vm.is.routerPush ? 'pushState' : 'replaceState']({}, '', targetUrl)
      vm.is.routerPush = false
    }
  },
  mapPlayTime: {
    deep: true,
    handler(newVal) {
      localStorage.mapPlayTime = JSON.stringify(newVal)
    }
  },
  'router.videoInfo.m3u8'(newVal) {
    if (!newVal) return
    this.playM3u8()
  },
  'is.loading'(newVal) {
    // console.warn('is.loading changed', newVal)
  },
}
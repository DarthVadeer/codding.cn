export default {
  router: {
    deep: true,
    handler(newVal) {
      const vm = this
      let hashData = JSON.stringify(newVal)
      !vm.is.local && (hashData = encodeURIComponent(hashData))
      const targetUrl = location.origin + location.pathname + '#' + hashData
      history[vm.isRouterPush ? 'pushState' : 'replaceState']({}, '', targetUrl)
      delete vm.isRouterPush
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
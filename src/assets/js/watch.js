export default {
  router: {
    deep: true,
    handler(newVal) {
      const root = this.$root
      
      let hashData = JSON.stringify(root.router)
      root.isLocal && (hashData = encodeURIComponent(hashData))
      const newUrl = location.origin + location.pathname + location.search + '#' + hashData
      history[root.isRouterPush ? 'pushState' : 'replaceState']({}, '', newUrl)

      delete root.isRouterPush
    }
  },
  'router.album'(newVal, oldVal) {
    const root = this.$root

    if (!newVal) return
    if (oldVal !== undefined) root.page.page = 1

    newVal && this.$root.fetchVideos()
  },
  'router.m3u8'(newVal) {
    if (!newVal) return
    console.log(newVal)
  }
}
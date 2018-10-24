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
  }
}
export default {
  router: {
    deep: true,
    handler(newVal) {
      const root = this.$root

      let hashData = JSON.stringify(root.router)
      !root.is.local && (hashData = encodeURIComponent(hashData))
      const newUrl = location.origin + location.pathname + location.search + '#' + hashData
      history[root.isRouterPush ? 'pushState' : 'replaceState']({}, '', newUrl)

      delete root.isRouterPush
    }
  },
  'router.idxChannel'(newVal) {
    this.fetchVideoList()
  },
  'router.idxAlbum'(newVal) {
    this.fetchVideoList()
  },
  'router.page.cur'(newVal) {
    this.fetchVideoList()
  },
  'router.page.size'(newVal) {
    this.fetchVideoList()
  },
  'router.m3u8'(newVal) {
    if (newVal) {
      this.playM3u8()
    } else {
      console.log('def')
      this.listVideo = []
      this.updateRouter({
        idxVideo: undefined,
        isLivePlay: undefined,
      })
      this.$root.lazyLoad()
    }
  },
  'router.videoTitle'(newVal) {
    document.title = newVal || 'codding.cn | By 摘星fy'
  },
  'com'(newVal) {
    const root = this.$root
    const r = root.router
    
    switch (newVal) {
      case 'algo':
        root.router.coms[0] = 'cctv'
        break
      case 'cctv':
        this.fetchVideoList()
        break
    }
  },
  'router.searchText'(newVal) {
    const root = this.$root
    const r = root.router
    
    root.sugg.text = root.sugg.oldText = newVal
    root.fetchSearchResult()
  },
  'mapPlayTime': {
    deep: true,
    handler(newVal) {
      localStorage.mapPlayTime = JSON.stringify(newVal)
    }
  }
}
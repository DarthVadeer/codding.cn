export default {
  'router': {
    deep: true,
    handler(newVal) {
      // console.warn('changed router')
      const vm = this
      let hashData = JSON.stringify(newVal)
      !vm.is.local && (hashData = encodeURIComponent(hashData))
      const targetUrl = location.origin + location.pathname + location.search + '#' + hashData
      history[vm.isRouterPush ? 'pushState' : 'replaceState']({}, '', targetUrl)

      vm.isRouterPush = false
    }
  },
  'router.idxChannel'(newVal) {
    // console.warn('changed router.idxChannel')
    vm.cctv.fetchVideoList()
  },
  'router.idxAlbum'(newVal) {
    // console.warn('changed router.idxAlbum')
    vm.cctv.fetchVideoList()
  },
  'router.idxAux9'(newVal) {
    // console.warn('changed router.idxAux9')
    vm.cctv.fetchVideoList()
  },
  'router.videoInfo.m3u8'(newVal) {
    // console.warn('changed router.videoInfo.m3u8')
    if (!newVal) return
    this.$root.playM3u8()
  },
  'router.searchText'(newVal) {
    // console.warn('changed router.searchText')
    const vm = this.$root
    vm.cctv.sugg.text = newVal

    const node = document.querySelector('.cctv .video-wrapper')
    node && (node.scrollTop = 0)
    newVal ? vm.cctv.justFetchAlbum() : vm.cctv.fetchVideoList()
  },
  'router.page.cur'() {
    const me = this
    const vm = me.$root
    const r = vm.router
    
    switch (vm.com) {
      case 'cctv':
        vm.cctv.fetchVideoList()
        break
    }
  },
  'mapPlayTime': {
    deep: true,
    handler(newVal) {
      // console.warn('changed mapPlayTime')
      localStorage.mapPlayTime = JSON.stringify(newVal)
    }
  },
}
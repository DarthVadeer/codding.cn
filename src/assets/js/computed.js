export default {
  listAlbum() {
    return this.$root.channel.map[this.$root.router.channel] || []
  },
  videos() {
    const root = this.$root
    const r = root.router
    const page = root.page
    const searchArr = r.searchText.trim().split(/\s+/g)
    
    let list = ((root.channel.mapAlbum[r.album] || {}).children || [])
    searchArr.length > 0 && (list = list.filter((item) => {
      return searchArr.every((searchText) => {
        return item.title.indexOf(searchText) > -1 || item.desc.indexOf(searchText) > -1
      })
    }))
    root.page.total = list.length
    list = list.splice((page.page - 1) * page.size, page.size)
    root.lazyLoad()

    if ((page.page - 1) * page.size > page.total) {
      root.updateRouter({page: 1})
    }

    return list
  },
  channelIndex() {
    const root = this.$root
    const r = root.router
    let targetIndex = -1

    root.channel.list.forEach((item) => {
      if (r.channel === item.name) {
        targetIndex = item.idx
      }
    })

    return targetIndex
  },
  liveUrl() {
    const root = this.$root
    const r = root.router
    
    return 'http://cctv5.txty.5213.liveplay.myqcloud.com/live/cctv' + root.channelIndex + '_txty.m3u8'
    /*let targetUrl = -1
    root.channel.list.forEach((item, idx, arr) => {
      if (item.name === r.channel) {
        targetUrl = 'http://cctv5.txty.5213.liveplay.myqcloud.com/live/cctv' + item.idx + '_txty.m3u8'
      }
    })
    console.log(targetUrl)
    return targetUrl*/
  },
  com() {
    const root = this.$root
    const r = root.router
    
    switch (r.coms[0]) {
      case 'algo':
      case 'algo-info':
      case 'algo-preview':
        return 'algo'
      case 'cctv':
        return 'cctv'
      case 'blog':
        return 'blog'
    }
  }
}
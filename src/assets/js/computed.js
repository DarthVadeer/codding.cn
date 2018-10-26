export default {
  listAlbum() {
    return this.$root.channel.map[this.$root.router.channel] || []
  },
  videos() {
    const root = this.$root
    const r = root.router
    const page = root.page
    
    let list = ((root.channel.mapAlbum[r.album] || {}).children || []).concat([])
    root.page.total = list.length
    list = list.splice((page.page - 1) * page.size, page.size)
    root.lazyLoad()

    if ((page.page - 1) * page.size > page.total) {
      root.updateRouter({page: 1})
    }

    return list
  },
}
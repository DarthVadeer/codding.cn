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
}
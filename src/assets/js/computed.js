export default {
  com() {
    return this.$root.router.coms[0] || ''
  },
  curSuggIdx() {
    const sugg = this.$root.sugg
    const cur = sugg.cur
    const len = sugg.list.length + 1

    return (cur % len + len) % len
  },
  topPt() {
    const root = this.$root

    if (root.urlSearchData.isInApp) {
      return root.urlSearchData.isSpecialScreen === "true" ? '35px' : '20px'
    } else {
      return '0px'
    }
  },
}
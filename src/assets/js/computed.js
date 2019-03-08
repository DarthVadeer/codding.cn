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

    return ({
      iphoneSe: '20px',
      iphone: '20px',
      iphonePlus: '20px',
      iphoneX: '32px',
      iphoneXsMax: '35px',
    })[root.urlSearchData.platform] || 0
  },
}
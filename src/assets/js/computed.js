export default {
  listAlbum() {
    const root = this.$root
    const r = root.router
    const channel = root.channel
    
    return channel.map[r.channel] || []
  }
}
<template>
  <div class="player">
    <video
      src=""
      id="videoPlayer"
      controls="controls"
      webkit-playsinline=""
      playsinline=""
      x5-playsinline=""
      x-webkit-airplay="allow"
      @timeupdate="handleTimeupdate"
      @ended="$emit('ended', $event)"
    ></video>
  </div>
</template>

<script>
export default {
  name: 'player',
  data() {
    return {

    }
  },
  methods: {
    playOnCCTV() {
      const me = this
      const vm = me.$root
      const r = vm.router

      vm.confirm('视频源有毛病，点击确定进入央视播放', () => {
        location.href = r.videoInfo.site
      })
    },
    handleTimeupdate(e) {
      const vm = this.$root
      const video = e.target
      const videoUrl = this.videoUrl

      if (videoUrl && video.currentTime > 0) {
        vm.$set(vm.mapPlayTime, videoUrl, video.currentTime)
      }
    },
    playNext() {
      const me = this
      const vm = me.$root
      const r = vm.router
      let arr = []

      vm.$delete(vm.mapPlayTime, this.videoUrl)
    },
  },
  computed: {
    r() {
      return this.$root.router
    },
    videoUrl() {
      return (this.r.videoInfo || {}).m3u8 || ''
    },
  }
}
</script>

<style lang="scss" scoped>
.player {

}
</style>

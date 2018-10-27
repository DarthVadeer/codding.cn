<template>
  <div class="player">
    <video id="videoEl" src="" controls=""
      webkit-playsinline playsinline x5-playsinline x-webkit-airplay="allow"
      @click="$root.togglePlay"
      @dblclick="$root.toggleFullScreen"
      @ended="$root.playVideoPrev"
    ></video>
  </div>
</template>

<script>
import Hls from 'hls.js'

export default {
  rootData() {
    return {}
  },
  rootMethods: {
    togglePlay() {
      const video = document.getElementById('videoEl')
      video[video.paused ? 'play' : 'pause']()
    },
    toggleFullScreen(e) {
      e.preventDefault()
      const video = document.getElementById('videoEl')
      document.webkitFullscreenElement ? document.webkitExitFullscreen() : video.webkitRequestFullScreen()
    },
    playVideo() {
      const root = this.$root
      const r = root.router
      
      clearTimeout(root.timerPlayVideo)
      root.timerPlayVideo = setTimeout(() => {
        const video = document.getElementById('videoEl')
        const videoUrl = r.m3u8
        const isSupportM3u8 = root.is.supportM3u8 /* video.canPlayType('application/vnd.apple.mpegurl')*/

        if (isSupportM3u8) {
          console.log(r.m3u8, 'play by native')
          video.src = videoUrl
          // video.play()
        } else if(Hls.isSupported()) {
          console.log(r.m3u8, 'play by hls')
          const hls = new Hls()
          hls.loadSource(videoUrl)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            // video.play()
          })
        } else {
          alert('你的设备不支持播放m3u8')
        }
      }, 1)
    },
    playVideoPrev(e) {
      const root = this.$root
      const r = root.router

      root.getVideoUrl(r.videoIndex - 1)
    },
  },
  mounted() {
    const root = this.$root
    const r = root.router

    root.playVideo()
  }
}
</script>

<style lang="scss" scoped="">
.player {
  width: 100%; height: 100%; position: absolute; left: 0; top: 0; background: #000;
  video {
    width: 100%; height: 100%; vertical-align: top;
  }
}
</style>
import Hls from 'hls.js'

export default {
  playM3u8() {
    const vm = this.$root
    const r = vm.router
    const videoUrl = r.videoInfo.m3u8
    
    vm.$nextTick(() => {
      const video = document.getElementById('videoPlayer')
      const isSupportM3u8 = vm.is.supportM3u8

      if (!video) {
        console.warn('no video')
        return
      }

      if (isSupportM3u8) {
        video.src = videoUrl
        !vm.is.local && video.play()
      } else if(Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          !vm.is.local && video.play()
        })
      } else {
        vm.alert('当前设备不能播放m3u8')
      }

      video.oncanplay = (e) => {
        video.currentTime = vm.mapPlayTime[r.videoInfo.m3u8] || 0
        video.oncanplay = null
      }
    })
  },
}
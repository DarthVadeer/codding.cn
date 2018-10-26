<template>
  <div class="player">
    <video id="videoEl" src="" controls=""
      onclick="this[this.paused ? 'play' : 'pause']()"
      @dblclick="toggleFullScreen"
    ></video>
  </div>
</template>

<script>
export default {
  rootData() {
    return {}
  },
  rootMethods: {

  },
  methods: {
    toggleFullScreen(e) {
      e.preventDefault()
      document.webkitFullscreenElement ? document.webkitExitFullscreen() : e.target.webkitRequestFullScreen()
    }
  },
  mounted() {
    const root = this.$root
    const r = root.router

    console.log('player.vue mounted')
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
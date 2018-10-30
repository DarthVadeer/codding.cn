<template>
  <div class="algo-preview auto-scroll">
    <iframe :src="$root.router.algoLink" class="algo-preview-iframe" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  rootData() {
    return {}
  },
  rootMethods: {

  },
  computed: {
    algo() {
      const root = this.$root
      const r = root.router
      
      return this.$root.algo.list[r.idxAlgo]
    }
  }
}
</script>

<style lang="scss" scoped>
.algo-preview {
  .algo-preview-iframe {
    width: 100%; height: 100%; position: absolute; left: 0; top: 0;
  }
}
</style>
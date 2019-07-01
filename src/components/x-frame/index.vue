<template>
  <div class="x-frame">
    <iframe :src="$root.router.demoUrl" frameborder="0"></iframe>
    <div class="box-btn-back">
      <button class="btn btn-primary" @click="goBack">
        <i class="glyphicon glyphicon-chevron-left"></i>
        <span>返回</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'x-frame',
  methods: {
    goBack() {
      const vm = this.$root
      history.length > 0 ? history.back() : (location.href = '/')
    }
  }
}
</script>

<style lang="scss" scoped>
.x-frame {
  iframe {
    width: 100%; height: 100%; position: absolute; left: 0; top: 0;
  }
  .box-btn-back {
    position: absolute; right: 12px; top: 12px;
  }
}
</style>
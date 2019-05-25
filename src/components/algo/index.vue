<template>
  <div class="box-algo">
    <iframe class="iframe-algo" scrolling="yes" src="http://codding.cn/algo/" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'algo',
  data() {
    return {}
  },
  methods: {

  },
  beforeCreate() {
    this.$root.algo = this
  },
  mounted() {

  },
  beforeDestroy() {
    delete this.$root.algo
  },
}
</script>

<style lang="scss" scoped>
.box-algo {
  width: 100%; height: 100%; overflow: auto; position: absolute; left: 0; top: 0;
  .iframe-algo {width: 100%; height: 100%; overflow: auto; vertical-align: top;}
}
</style>
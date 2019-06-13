<template>
  <div id="box-algo">
    <div class="list c">
      <!-- <section>
        <div class="box-btn">
          <button>${v.name}</button>
        </div>
        <div class="box-canvas">
          <canvas></canvas>
        </div>
      </section> -->
    </div>
  </div>
</template>

<script>
import Algo from './algoAll'

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
    window.algo = new Algo()
    // 
  },
  beforeDestroy() {
    delete this.$root.algo
  },
}
</script>

<style lang="scss">
#box-algo {padding: 15px; text-align: center;}
#box-algo > .list {display: inline-block;}
#box-algo > .list section {margin-bottom: 20px;}
#box-algo > .list section .box-btn {margin-bottom: 15px;}
#box-algo > .list section .box-canvas {}
#box-algo > .list section .box-canvas canvas {border: 1px solid #ccc;}
@media (max-width: 700px) {
  #box-algo > .list {display: block;}
  #box-algo > .list section .box-canvas canvas {max-width: 100%;}
}
</style>
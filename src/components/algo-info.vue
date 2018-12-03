<template>
  <div class="algo-info auto-scroll">
    <div class="wrapper shadow">
      <div class="c">
        <img :src="algo.img" alt="" style="max-width: 100%;">
      </div>
      <div class="ho" style="margin: 15px 0;">
        <div class="fr links">
          <span
            target="_blank"
            class="btn btn-xs btn-primary"
            v-for="(item, idx) in algo.links"
            @click="$root.pushCom('algo-preview', {algoLink: item.url})"
          >{{item.name}}</span>
        </div>
        <div
          v-if="algo.desc"
          v-html="algo.desc"
        ></div>
      </div>
      <div>
        <pre>{{$root.code}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  rootData() {
    return {
      code: '',
    }
  },
  methods: {

  },
  computed: {
    algo() {
      const root = this.$root
      const r = root.router
      
      return root.algo.list[r.idxAlgo] || {}
    }
  },
  mounted() {
    const root = this.$root
    const r = root.router

    root.get(this.algo.urlXhr, {}, (str) => {
      root.code = str
    })
  }
}
</script>

<style lang="scss" scoped>
.algo-info {
  padding: 15px 0;
  .wrapper {
    border-radius: 4px; background: #fff !important;
    .links {
      .btn {
        margin-left: 5px;
      }
    }
  }
}
</style>
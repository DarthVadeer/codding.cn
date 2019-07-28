<template>
  <div id="app" class="flex-layout flex-v"
    @click="clickFullPanel"
  >
    <topbar></topbar>
    <div class="auto-flex" style="overflow: visible;">
      <transition-group :name="'ani-com-' + (countAni % $root.lenAni)">
      <!-- <transition-group name="fade"> -->
        <div
          v-for="(item, idx) in coms"
          :key="item.com + '-' + idx"
          :is="item"
          v-if="idx === 0"
        ></div>
      </transition-group>
    </div>

    <alert></alert>
    <confirm></confirm>
  </div>
</template>

<script>
const coms = [
  'components/com/player',
  'components/com/loading',
  'components/com/alert',
  'components/com/confirm',
  'components/com/toggle',

  // 'components/index',
  'components/topbar',
  'components/cctv',
  'components/algo',
  'components/creative',
  // 'components/webFtp',
  // 'components/dbAdmin',
  // 'components/talker',
  // 'components/boboFans',
  // 'components/goal',
  // 'components/x-frame',
].map((path) => {
  return require('@/' + path).default
})

export default {
  name: 'app',
  data() {
    return {}
  },
  methods: {
    clickFullPanel() {
      const vm = this.$root

      if (vm.cctv) {
        vm.cctv.sugg.list = []
      }
    }
  },
  components: {
    ...(() => {
      const map = {}
      coms.forEach((item) => {
        map[item.name] = item
      })
      return map
    })()
  },
  computed: {
    r() {
      return this.$root.router
    },
    coms() {
      return this.r.coms || []
    },
    countAni() {
      return this.r.countAni || 0
    }
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%; background: #000;
  & > .auto-flex {
    & > span,
    & > span > div {
      width: 100%; height: 100%; position: absolute; left: 0; top: 0;
    }
    & > span {
      transform-style: preserve-3d; transform: perspective(800px);
    }
    & > span > div {
      background: #fff; overflow: auto;
    }
  }
}
</style>
<template>
  <div id="app">
    <div class="main-wrap flex-layout">
      <div class="topbar lmr">
        <div class="fl">
          <div class="logo">
            <strong class="text-bigger">Codding.cn</strong>
          </div>
        </div>
        <form class="ho" @submit.prevent style="padding-top: 8px;">
          <div class="relative">
            <input type="text" class="form-control search-input"
              v-model="$root.router.searchText"
            >
          </div>
        </form>
      </div>
      <div class="auto-flex">
        <div :is="$root.router.com || 'cctv'"></div>
      </div>
    </div>
  </div>
</template>

<script>
const coms = [
  {name: 'cctv', path: 'components/cctv'},
].map((item) => {
  item.com = require('@/' + item.path).default
  return item
})

export default {
  name: 'app',
  rootData() {
    return {
      ...(() => {
        let map = {}
        coms.forEach((item) => {
          map = {...map, ...item.com.rootData.call(this.$root)}
        })
        return map
      })()
    }
  },
  rootMethods: {
    ...(() => {
      let map = {}
      coms.forEach((item) => {
        map = {...map, ...item.com.rootMethods}
      })
      return map
    })(),
  },
  components: {
    ...(() => {
      let map = {}
      coms.forEach((item) => {
        map[item.name] = item.com
      })
      return map
    })()
  },
}

</script>

<style lang="scss" scoped="">
#app {
  height: 100%;
  .main-wrap {
    height: 100%; position: relative; font-size: 13px;
    .topbar {
      height: 50px; line-height: 48px; background: #333840; color: #a0b0c0; padding: 0 12px; user-select: none;
      .search-input {
        background: rgba(0,0,0,.3); border: none; color: inherit; box-shadow: none;
      }
    }
  }
}
</style>
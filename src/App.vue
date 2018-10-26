<template>
  <div id="app">
    <div class="main-wrap flex-layout">
      <div class="topbar">
        <div class="fl">
          <div class="logo">
            <span class="text-bigger">Codding.cn</span>
          </div>
        </div>
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

const nodeStyle = document.createElement('style')
nodeStyle.innerHTML = new Array(15).fill().map((_, idx) => {
  let w, per

  w = idx * (idx < 5 ? 200 : 280)
  per = parseInt(100000 / (idx + 1)) / 1000

  return `
    @media (min-width: ${w}px) {
      .list-card li {width: ${per}%;}
    }
  `
}).join('')
document.body.appendChild(nodeStyle)

</script>

<style lang="scss" scoped="">
#app {
  height: 100%;
  .main-wrap {
    height: 100%; position: relative; font-size: 13px;
    .topbar {
      height: 50px; line-height: 48px; background: #333840; color: #a0b0c0; padding: 0 12px; user-select: none;
    }
  }
}
</style>
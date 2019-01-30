<template>
  <div id="app">
    <div class="flex-layout">
      <topbar></topbar>
      <div id="main-container" class="auto-flex">
        <transition-group :name="'ani-com-' + ($root.router.countAni % $root.lenAni)">
        <!-- <transition-group :name="'fade'"> -->
          <div
            v-for="(item, idx) in $root.router.coms"
            :key="item.com + '-' + idx"
            :is="item"
            v-if="idx === 0"
            :style="{background: '#fff url(./static/img/bg.png)'}"
          ></div>
        </transition-group>
      </div>
    </div>

    <transition name="fade">
      <div class="mask"
        v-if="$root.router.isShow"
      >
        <div class="inner"
          @click.stop
        >
          <div class="gray-title">
            <div class="fr">
              <div class="glyphicon glyphicon-remove"></div>
            </div>
            <div class="oh">登录</div>
          </div>
          <form class="space"
            @submit.prevent
          >
            <table class="table-form">
              <tr>
                <td>用户名：</td>
                <td>
                  <input type="text" class="form-control">
                </td>
              </tr>
              <tr>
                <td>密　码：</td>
                <td>
                  <input type="text" class="form-control">
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type="submit" value="确定" class="btn btn-success">
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const coms = [
  {name: 'topbar', path: 'components/topbar'},
  {name: 'algo', path: 'components/algo/algo'},
  {name: 'cctv', path: 'components/cctv/cctv'},
].map((item) => {
  item.com = require('@/' + item.path).default
  return item
})

export default {
  name: 'App',
  rootData() {
    const root = this.$root
    
    return {
      ...(() => {
        let o = {}
        coms.forEach(({com}) => {
          com.rootData && (o = {...o, ...com.rootData.call(root)})
        })
        return o
      })()
    }
  },
  rootMethods: {
    ...(() => {
      let o = {}
      coms.forEach(({com}) => {
        o = {...o, ...com.rootMethods}
      })
      return o
    })()
  },
  components: {
    ...(() => {
      const o = {}
      coms.forEach(({name, com}) => {
        o[name] = com
      })
      return o
    })()
  }
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}

#main-container {
  z-index: 9;
  & > span {
    width: 100%; height: 100%; display: block; position: relative;
    transform-style: preserve-3d; transform: perspective(800px);
    & > div {
      width: 100%; height: 100%; position: absolute; left: 0; top: 0;
      background: #fff;
    }
  }
}
</style>
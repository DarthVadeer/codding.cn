<template>
  <div id="app">
    <div class="main-wrap flex-layout">
      <div class="topbar lmr">
        <div class="fl">
          <div class="logo ib">
            <a href="javascript:" onclick="location.reload()" class="def bold text-bigger">Codding.cn</a>
          </div>
        </div>
        <div class="fl">
          <div class="ib site-nav">
            <ul>
              <li
                v-for="(item, idx) in $root.nav.list"
                :class="{on: item.com === $root.com}"
                @click="$root.pushCom(item.com)"
              >{{item.name}}</li>
            </ul>
          </div>
        </div>
        <div class="fr">
          <a class="def" href="javascript:" onclick="localStorage.clear(); location.reload()">清除缓存</a>
        </div>
        <form class="ho" @submit.prevent style="padding-top: 8px;">
          <div class="relative">
            <input type="text" class="form-control search-input" placeholder="搜点什么" 
              v-model="$root.router.searchText"
            >
          </div>
        </form>
      </div>
      <div class="auto-flex">
        <!-- <transition-group :name="'ani-com-' + ($root.router.countAni % $root.lenAni)"> -->
        <transition-group :name="'flip'">
          <div
            v-for="(item, idx) in $root.router.coms"
            :key="item.com + '-' + idx"
            :is="item"
            v-if="idx === 0"
          ></div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
const coms = [
  {name: 'algo', path: 'components/algo'},
  {name: 'algo-info', path: 'components/algo-info'},
  {name: 'algo-preview', path: 'components/algo-preview'},
  {name: 'cctv', path: 'components/cctv'},
  {name: 'blog', path: 'components/blog'},
].map((item) => {
  item.com = require('@/' + item.path).default
  return item
})

export default {
  name: 'app',
  rootData() {
    return {
      nav: {
        list: [
          // {name: '博文', com: 'blog'},
          {name: '算法', com: 'algo'},
          {name: '央视', com: 'cctv'},
        ]
      },
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
    pushCom(com, o) {
      const root = this.$root
      const r = root.router

      o && root.updateRouter(o)
      root.router.countAni++
      root.isRouterPush = true
      r.coms.unshift(com)
      while (r.coms.length > 2) r.coms.pop()
    }
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
      height: 50px; line-height: 50px; background: #333840; color: #a0b0c0; padding: 0 12px; user-select: none;
      * {
        vertical-align: top;
      }
      .site-nav {
        ul {
          margin: 0;
          li {
            display: inline-block; padding: 0 .8em; cursor: pointer;
            &.on {
              color: #fff;
            }
          }
        }
      }
      .search-input {
        background: rgba(0,0,0,.3); border: none; color: inherit; box-shadow: none;
      }
    }
    & > .auto-flex {
      overflow: hidden;
      & > span {
        width: 100%; height: 100%; position: absolute; left: 0; top: 0;
        transform-style: preserve-3d; transform: perspective(800px);
        & > div {
          background: #f3f6f9;
        }
      }
    }
  }
}
</style>
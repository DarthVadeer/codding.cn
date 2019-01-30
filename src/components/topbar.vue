<template>
  <div class="topbar lmr">
    <div class="box-logo fl hidden-xs">
      <strong>
        <a href="javascript:">Codding.cn</a>
      </strong>
    </div>
    <div class="box-nav fl">
      <ul>
        <li
          v-for="(item, idx) in $root.nav.list"
          @click="$root.pushCom(item.com)"
          :class="{on: item.com === $root.com}"
        >
          <a href="javascript:">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="box-fr fr" v-if="0">
      <ul>
        <li>
          <a href="javascript:">摘星fy</a>
        </li>
        <li>
          <a href="javascript:">退出</a>
        </li>
      </ul>
    </div>
    <form class="box-form m" @submit.prevent="doSearch">
      <input type="search" class="form-control" placeholder="搜点什么..."
        v-model="$root.router.searchText"
      >
    </form>
  </div>
</template>

<script>
export default {
  name: 'top-bar',
  rootData() {
    return {
      nav: {
        list: [
          {name: '算法', com: 'algo'},
          {name: '央视', com: 'cctv'},
        ]
      }
    }
  },
  methods: {
    doSearch() {
      const root = this.$root
      const r = root.router
      
      root.updateRouter({
        m3u8: '',
        videoId: undefined,
        videoTitle: '',
        page: {
          ...r.page,
          cur: 1,
        }
      }, 'push')

      root.fetchVideoList()
    }
  },
  rootMethods: {
    
  }
}
</script>

<style lang="scss" scoped="">
.topbar {
  background: #36393f; color: #c3d0e0; line-height: 44px; padding: 0 6px; z-index: 10;
  & > div,
  & > form {
    padding: 0 6px;
    input[type=search] {
      height: 30px; background: rgba(0,0,0,.3); border: none; color: inherit;
      &:focus {box-shadow: none;}
    }
  }
  & > form {
    padding-top: 7px;
  }
  .box-logo {
    font-size: 16px;
  }
  ul {
    margin-bottom: 0;
    li {
      display: inline-block; padding: 0 10px;
      &.on {color: #fff;}
    }
  }
  & > .fl,
  & > .fr {margin: 0;}
}
</style>
<template>
  <div class="topbar">
    <div class="box-logo hidden-xs">
      <strong>
        <a href="javascript:">Codding.cn</a>
      </strong>
    </div>
    <div class="box-nav">
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
    <form class="box-form m" @submit.prevent="$root.sugg.isShow = 0; doSearch()">
      <div class="inner">
        <input type="search" class="form-control" placeholder="搜点什么..."
          v-model="$root.sugg.text"
          @keydown="handleKeydown"
          @input="$root.fetchSugg"
          @click.stop="$root.sugg.isShow = 1; $root.sugg.cur = -1"
        >
        <div class="panel-sugg"
          v-if="$root.sugg.list.length > 0 && $root.sugg.isShow"
        >
          <ul>
            <li
              v-for="(item, idx) in $root.sugg.list"
              @click.stop="setSearchTextByIdx(idx)"
              :class="{on: idx === $root.curSuggIdx}"
              @mouseover="$root.sugg.cur = idx"
            >{{item}}</li>
          </ul>
        </div>
      </div>
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
          // {name: '算法', com: 'algo'},
          {name: '央视', com: 'cctv'},
        ]
      },
      sugg: {
        text: '',
        oldText: '',
        isShow: 0,
        cur: -1,
        list: [],
      },
    }
  },
  methods: {
    setSearchTextByIdx(idx) {
      const root = this.$root
      const r = root.router
      const sugg = root.sugg

      sugg.text = sugg.list[idx] || ''
      this.doSearch()
    },
    doSearch() {
      const root = this.$root
      const r = root.router
      const sugg = root.sugg
      const searchText = sugg.text.trim()

      root.updateRouter({
        m3u8: '',
        videoId: undefined,
        videoTitle: '',
        isInSearch: !!searchText,
        searchText,
        page: {
          ...r.page,
          cur: 1,
        }
      }, 'push')

      sugg.isShow = 0
      root.fetchVideoList()
    },
    handleKeydown(e) {
      const root = this.$root
      const r = root.router
      const sugg = root.sugg
      const keyMap = root.keyMap
      const searchText = sugg.text.trim()

      switch (keyMap[e.keyCode]) {
        case 'enter':
          sugg.isShow = 0
          break
        case 'esc':
          sugg.isShow = 0
          break
        case 'up':
          sugg.cur--
          break
        case 'down':
          sugg.cur++
          break
      }

      sugg.text = sugg.list[root.curSuggIdx] || sugg.oldText || ''
    },
  },
  rootMethods: {
    fetchSugg() {
      const root = this.$root
      const r = root.router
      const sugg = root.sugg

      sugg.cur = -1
      sugg.oldText = sugg.text
      sugg.isShow = 1
      clearTimeout(root.timerFetchCctvSugg)
      root.timerFetchCctvSugg = setTimeout(() => {
        const searchText = sugg.text.trim()

        if (!searchText) {
          console.log('no searchText')
          return
        }

        const script = document.createElement('script')
        script.src = 'https://search.cctv.com/webtvsuggest.php?q=' + encodeURIComponent(searchText)
        script.onload = () => {
          const list = window.suggestJSON
          root.sugg.list = list.map(v => v.name)
          root.sugg.cur = list.length
          document.body.removeChild(script)
        }
        document.body.appendChild(script)
      }, 250)
    },
  },
  mounted() {
    const root = this.$root
    const r = root.router
    const sugg = root.sugg
    
    root.comCCTV = this
  }
}
</script>

<style lang="scss" scoped>
.topbar {
  background: #36393f; color: #c3d0e0; line-height: 44px; z-index: 10; padding-top: .1px;
  display: flex;
  & > div,
  & > form {
    margin: 0 6px;
    input[type=search] {
      height: 30px; background: rgba(0,0,0,.3); border: none; color: inherit;
      &:focus {box-shadow: none;}
    }
  }
  & > form {
    margin-top: 7px;
    flex: 1; position: relative;
    .panel-sugg {
      width: 100%; background: #fff; line-height: 1.5em;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
      position: absolute; left: 0; top: calc(100% + 1px);
      ul {
        margin-bottom: 0;
        li {
          padding: 6px 12px; color: #333; cursor: pointer;
          &.on {color: #337ab7;}
        }
      }
    }
  }
  .box-logo {
    font-size: 16px;
  }
  & > div {
    ul {
      margin-bottom: 0;
      li {
        display: inline-block; padding: 0 10px;
        &.on {color: #fff;}
      }
    }
  }
}

@media (min-width: 650px) {
  .topbar {padding: 0 6px;}
}
</style>
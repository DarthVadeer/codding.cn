<template>
  <div class="goal panel-stack">
    <div @scroll="$root.lazyLoad">
      <div class="c space" style="padding-bottom: 0;">
        <div class="alert alert-info ib" style="margin: 0 8px;">
          <span>以下素材来自于 </span>
          <br class="visible-xs">
          <span>
            <a href="http://www.17sucai.com/pins/tag/418.html" target="_blank">http://www.17sucai.com/pins/tag/418.html</a>
          </span>
        </div>
      </div>
      <div class="card-list respond-list">
        <section
          v-for="(item, idx) in demo.list"
          class="card-item respond-item"
        >
          <div class="inner"
            @click="showDemo(item, idx)"
          >
            <div class="img-box" :lazy-load="item._img">
              <span
                :class="['btn', 'btn-default', 'btn-choose', {'btn-success': mapChooseGoal[item.img]}]"
                @click.stop="chooseOne(item, idx)"
                v-if="0"
              >choose</span>
            </div>
            <div class="text ellipsis">{{item.text}}</div>
          </div>
        </section>
      </div>
    </div>

    <transition name="fade">
      <div class="forward" v-if="r.goalUrl">
        <iframe :src="r.goalUrl" frameborder="0"></iframe>
      </div>
    </transition>
  </div>
</template>

<script>
import demoList from './data'
import mapChooseGoal from './mapChooseGoal'

/*const _mapChooseGoal = {}
Object.keys(mapChooseGoal).forEach((item, idx) => {
  item = decodeURIComponent(item.substr(item.indexOf('url=') + 4))
  _mapChooseGoal[item] = true
})
console.log(JSON.stringify(_mapChooseGoal))*/

export default {
  name: 'goal',
  data() {
    const vm = this.$root

    /*let mapChooseGoal
    try {
      mapChooseGoal = JSON.parse(localStorage.mapChooseGoal)
    } catch (e) {
      mapChooseGoal = {}
    }*/

    return {
      mapChooseGoal,
      demo: {
        list: demoList.filter(v => mapChooseGoal[v.img]).map((v) => {
          v.is17  = /^http/.test(v.img)
          const fileName = (v.img.match(/\/([^/]+)\?/) || [])[1] || ''
          // v._img = vm.baseUrl + 'api/get.php?a=getImg&url=' + encodeURIComponent(v.img)
          v._img = (vm.is.local ? vm.baseUrl : '/') + (!v.is17 ? ((vm.is.local ? 'public/' : '') + v.img) : 'api/img-cache-goal/' + fileName)
          return v
        })
      }
    }
  },
  computed: {
    r() {
      return this.$root.router
    },
  },
  methods: {
    chooseOne(elItem, idx) {
      this.$set(this.mapChooseGoal, elItem.img, !this.mapChooseGoal[elItem.img])
      localStorage.mapChooseGoal = JSON.stringify(this.mapChooseGoal)
    },
    showDemo(elItem, idx) {
      const vm = this.$root

      const setState = (href) => {
        vm.updateRouter({
          goalUrl: href
        }, 'push')
      }

      if (elItem.is17) {
        $.get('./api/get.php', {
          a: 'get',
          url: elItem.href,
        }, (str) => {
          const href = (str.match(/id="iframe" src="([^"]+)"/) || [])[1] || ''

          if (!href) {
            vm.alert('找不到相关链接')
            return
          }

          setState(href)
        })
      } else {
        setState(elItem.href)
      }
    }
  },
  mounted() {
    const vm = this.$root

    vm.lazyLoad()
    setTimeout(vm.lazyLoad.bind(vm), 1000)
  }
}
</script>

<style lang="scss" scoped>
.goal {
  .btn-choose {
    position: absolute; right: 4px; top: 4px;
  }
  .forward {
    background: #000;
    iframe {
      width: 100%; height: 100%; vertical-align: top;
    }
  }
}
</style>
<template>
  <div class="goal" @scroll="$root.lazyLoad" onscroll="localStorage.goalScrollTop = this.scrollTop"
    ref="scrollEl"
  >
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
        v-for="(item, idx) in type.list"
        class="card-item respond-item"
      >
        <div class="inner"
          @click="showDemo(item, idx)"
        >
          <div class="img-box" :lazy-load="item.img">
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
</template>

<script>
import list from './data'
import mapChooseGoal from './mapChooseGoal'

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
      type: {
        list: list.clone().map((v) => {
          v.img = vm.baseUrl + 'api/get.php?a=getImg&url=' + encodeURIComponent(v.img)
          return v
        }).filter(v => mapChooseGoal[v.img])
      }
    }
  },
  methods: {
    chooseOne(elItem, idx) {
      this.$set(this.mapChooseGoal, elItem.img, !this.mapChooseGoal[elItem.img])
      localStorage.mapChooseGoal = JSON.stringify(this.mapChooseGoal)
    },
    showDemo(elItem, idx) {
      const vm = this.$root

      $.get('./api/get.php', {
        a: 'get',
        url: elItem.href,
      }, (str) => {
        const href = (str.match(/id="iframe" src="([^"]+)"/) || [])[1] || ''

        if (!href) {
          vm.alert('找不到相关链接')
          return
        }

        vm.pushCom('x-frame', {
          demoUrl: href
        })
      })
    }
  },
  mounted() {
    const vm = this.$root

    this.$refs.scrollEl.scrollTop = localStorage.goalScrollTop || 0
    
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
}
</style>
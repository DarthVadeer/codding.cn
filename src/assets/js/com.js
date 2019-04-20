import Vue from 'vue'

Vue.component('player', {
  template: `
    <div class="player">
      <video
        src=""
        id="videoPlayer"
        controls="controls"
        webkit-playsinline=""
        playsinline=""
        x5-playsinline=""
        x-webkit-airplay="allow"
        @timeupdate="handleTimeupdate"
        @ended="playNext"
      ></video>
    </div>
  `,
  methods: {
    handleTimeupdate(e) {
      const vm = this.$root
      const r = vm.router
      const video = e.target

      if (video.currentTime > 0 && r.videoInfo.m3u8) {
        vm.$set(vm.mapPlayTime, r.videoInfo.m3u8, video.currentTime)
      }
    },
    playNext() {
      const me = this
      const vm = me.$root
      const r = vm.router
      let arr = []
      
      switch (vm.com) {
        case 'cctv':
          let targetIndex = -1

          vm.cctv.video.group2.concat(vm.cctv.video.group).forEach((item) => {
            arr = arr.concat(item.list)
          })

          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === r.videoInfo.id) {
              targetIndex = i
              break
            }
          }

          r.playDirection == 1 ? targetIndex++ : targetIndex--

          if (targetIndex.isInRange(0, arr.length - 1)) {
            vm.cctv.fetchVideoUrl(arr[targetIndex])
          } else {
            let curPage = r.page.cur
            const asc = r.playDirection === 1

            asc ? curPage++ : curPage--

            if (curPage.isInRange(1, Math.ceil(r.page.total / r.page.size))) {
              vm.cctv.playVideoByChangeCurPage = () => {
                const list = vm.cctv.video.group[0].list
                targetIndex = asc ? 0 : list.length - 1
                vm.cctv.fetchVideoUrl(list[targetIndex])
              }
              r.page.cur = curPage
            } else {
              console.warn('page.cur out of range. do not fetchVideoList')
            }
          }
          break
      }
    },
  },
})

Vue.component('toggle', {
  template: `
    <div
      :class="['toggle', {on: value}]"
      @click="$emit('change', !value)"
    >
      <div class="circle"></div>
    </div>
  `,
  props: {
    value: Boolean,
  },
  model: {
    prop: 'value',
    event: 'change',
  }
})

Vue.component('loading-div', {
  template: `
    <div class="loading-div"
      style="transform: scale(.8)"
    >
      <ul>
        <li
          v-for="n in len"
          :style="{transform: 'rotate(' + (n * (360 / len)) + 'deg) translateY(-16px) scale(.8, 1)', backgroundColor: 'rgba(' + getColorN(n) + ',' + getColorN(n) + ',' + getColorN(n) + ',1)'}"
        ></li>
      </ul>
    </div>
  `,
  data() {
    return {
      len: 12
    }
  },
  methods: {
    getColorN(idx) {
      return parseInt(idx / this.len * 100 + 100)
    }
  }
})

Vue.component('loading', {
  template: `
    <transition name="fade">
      <div class="loading"
        v-if="isShow"
      >
        <loading-div></loading-div>
      </div>
    </transition>
  `,
  props: ['isShow']
})

Vue.component('alert', {
  template: `
    <transition name="fade">
      <div class="panel-notice" id="panel-alert"
        v-if="$root.alertData.isShow"
      >
        <div class="inner">
          <div class="box-msg" v-html="$root.alertData.msg"></div>
          <div class="flex btn-box">
            <div class="_1 text-blue" tabindex="1" @click="$root.alertData.isShow = false">确定</div>
          </div>
        </div>
      </div>
    </transition>
  `
})

Vue.component('confirm', {
  template: `
    <transition name="fade">
      <div class="panel-notice" id="panel-confirm"
        v-if="$root.confirmData.isShow"
      >
        <div class="inner">
          <div class="box-msg" v-html="$root.confirmData.msg"></div>
          <div class="flex btn-box">
            <div class="_1 text-blue" tabindex="1" @click="handleConfirm">确定</div>
            <div class="_2" tabindex="1" @click="$root.confirmData.isShow = false">取消</div>
          </div>
        </div>
      </div>
    </transition>
  `,
  methods: {
    handleConfirm(e) {
      const vm = this.$root
      
      vm.confirmData.isShow = false
      vm.cbConfirm && vm.cbConfirm()
      delete vm.cbConfirm
    },
  }
})
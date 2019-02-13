import Vue from 'vue'

Vue.component('pagin', {
  template: `
    <div class="pagin" v-if="$root.router.page.total > 0">
      <div class="ib hidden-sm">
        <span>共 {{page.total}} 条</span>
      </div>
      <div class="ib hidden-sm" v-if="0">
        <select class="form-control" style="width: 80px;"
          v-model="page.size"
        >
          <option :value="n" v-for="n in [20, 40, 60, 80, 100]">{{n}}</option>
        </select>
      </div>
      <div class="ib" v-if="1">
        <ul>
          <li
            v-for="(item, idx) in lis"
            v-if="!item.isHide"
            :key="item.n + '-' + idx"
            :class="{on: item.n == page.cur}"
            @click="item.n === '...' ? (item.isPrev ? page.cur-- : page.cur++) : page.cur = item.n"
          >{{item.n}}</li>
        </ul>
      </div>
      <div class="ib">
        <input type="text" style="width: 50px;" class="form-control c"
          :value="page.cur"
          @change="page.cur = $event.target.value"
          @keydown.enter="page.cur = $event.target.value"
          @keydown.38="page.cur--"
          @keydown.40="page.cur++"
        >
      </div>
    </div>
  `,
  props: ['page'],
  data() {
    return {}
  },
  watch: {
    page: {
      deep: true,
      handler(page) {
        const pageNum = this.pageNum

        page.cur = parseInt(page.cur)
        page.size = parseInt(page.size)
        
        if (!(page.total > 0 || page.size > 0)) {
          console.log('page warn: ', page, 'page.total: ' + page.total, 'page.size: ' + page.size)
          return
        }

        /*if (!(page.cur > 0 && page.cur <= pageNum)) {
          page.cur = 1
        }*/
      }
    },
    'page.cur'(newVal) {
      this.$emit('updatePage', newVal)
    },
    'page.size'(newVal) {
      this.$emit('updatePageSize', newVal)
    },
  },
  computed: {
    pageNum() {
      const page = this.page
      return Math.ceil(page.total / page.size)
    },
    lis() {
      const me = this
      const page = me.page
      const pageNum = me.pageNum

      if (pageNum < 7) {
        return new Array(pageNum).fill().map((_, idx) => {
          return {n: idx + 1}
        })
      } else {
        if (page.cur < 7) {
          return [...new Array(7).fill().map((_, idx) => {
            return {n: idx + 1}
          }), {n: '...', isHide: pageNum < 9}, {n: pageNum, isHide: pageNum < 8}]
        } else if (pageNum - page.cur < 6) {
          return [{n: 1, isHide: pageNum < 8}, {n: '...', isPrev: true, isHide: pageNum < 9}, ...new Array(7).fill().map((_, idx) => {
            return {n: pageNum + idx - 6}
          })]
        } else {
          return [{n: 1}, {n: '...', isPrev: true, isHide: 0}, ...new Array(5).fill().map((_, idx) => {
            return {n: page.cur + idx - 2}
          }), {n: '...', ieNext: true, isHide: 0}, {n: pageNum}]
        }
      }
    }
  },
  methods: {

  },
})

Vue.component('hls-player', {
  template: `
    <div id="hls-player">
      <video id="hls-video-el" controls
        :src="src"
        webkit-playsinline
        playsinline
        x5-playsinline
        x-webkit-airplay="allow"
        @click.prevent="togglePlay"
        @ended="ctrlPlay"
      ></video>
    </div>
  `,
  props: ['src'],
  methods: {
    ctrlPlay(e) {
      const root = this.$root
      const r = root.router
      const idxVideo = r.idxVideo
      let listVideo = root.listVideo || []

      listVideo = listVideo.length > 0 ? listVideo : root.cctv.video.list
      r.isPlayNext ? r.idxVideo++ : r.idxVideo--

      if (!(r.idxVideo >= 0 && r.idxVideo < listVideo.length)) {
        console.log('out of range l: ' + 0 +' m: ' + r.idxVideo +' r: ' + (listVideo.length - 1) +' ', )
        return
      }

      root.fetchVideoInfo(listVideo[r.idxVideo], r.idxVideo, listVideo)
    },
    togglePlay(e) {
      const root = this.$root
      const r = root.router
      const video = e.target

      if (root.is.mac && root.is.safari) {
        console.log('mac safari out...')
        return
      }

      video[video.paused ? 'play' : 'pause']()
    }
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
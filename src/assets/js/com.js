import Vue from 'vue'

Vue.component('pagin', {
  template: `
    <div class="pagin">
      <div class="ib hidden-sm">
        <span>共 {{page.total}} 条</span>
      </div>
      <div class="ib hidden-sm">
        <select class="form-control" style="width: 80px;"
          v-model="page.size"
        >
          <option :value="n" v-for="n in page.sizes">{{n}}</option>
        </select>
      </div>
      <div class="ib" v-if="1">
        <ul>
          <li
            v-for="(item, idx) in lis"
            v-if="!item.isHide"
            :key="item.n + '-' + idx"
            :class="{on: item.n == page.page}"
            @click="item.n === '...' ? (item.isPrev ? page.page-- : page.page++) : page.page = item.n"
          >{{item.n}}</li>
        </ul>
      </div>
      <div class="ib">
        <input type="text" style="width: 50px;" class="form-control c"
          :value="page.page"
          @change="page.page = $event.target.value"
          @keydown.enter="page.page = $event.target.value"
          @keydown.38="page.page--"
          @keydown.40="page.page++"
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

        page.page = parseInt(page.page)
        page.size = parseInt(page.size)
        
        if (!(page.total > 0 || page.size > 0)) {
          console.log('page warn: ', page, 'page.total: ' + page.total, 'page.size: ' + page.size)
          return
        }

        if (!(page.page > 0 && page.page <= pageNum)) {
          page.page = 1
        }
      }
    },
    'page.page'(newVal) {
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
        if (page.page < 7) {
          return [...new Array(7).fill().map((_, idx) => {
            return {n: idx + 1}
          }), {n: '...', isHide: pageNum < 9}, {n: pageNum, isHide: pageNum < 8}]
        } else if (pageNum - page.page < 6) {
          return [{n: 1, isHide: pageNum < 8}, {n: '...', isPrev: true, isHide: pageNum < 9}, ...new Array(7).fill().map((_, idx) => {
            return {n: pageNum + idx - 6}
          })]
        } else {
          return [{n: 1}, {n: '...', isPrev: true, isHide: 0}, ...new Array(5).fill().map((_, idx) => {
            return {n: page.page + idx - 2}
          }), {n: '...', ieNext: true, isHide: 0}, {n: pageNum}]
        }
      }
    }
  },
  methods: {

  },
})

Vue.component('loading-div', {
  template: `
    <div class="loading-div">
      <div class="item"
        v-for="n in 12"
        :style="{transform: 'rotate(' + (360 / 12 * n) + 'deg) translateY(-20px)', background: 'hsla(0 , 0%,' + (n / 14) * 100+'%, 1)', opacity: .8}"
      ></div>
    </div>
  `,
})

Vue.component('loading-abs', {
  template: `
    <transition name="fade">
      <div class="loading-abs"
        v-if="isShow"
      >
        <div style="transform: scale(.7)">
          <loading-div></loading-div>
        </div>
      </div>
    </transition>
  `,
  props: ['isShow'],
})

Vue.component('no-data', {
  template: `
    <transition name="fade">
      <div class="no-data"
        v-if="isShow"
      >
        <div class="inner c">
          <img src="./static/img/no-data.png" alt="" />
          <div class="text-box" style="margin-top: 15px;">
          <span class="btn btn-info btn-sm"
            v-if="$root.router.searchText && $root.router.coms[0] === 'cctv' "
            @click="$root.updateRouter({searchText: ''}, 'push')"
          >暂无数据删掉筛选条件试试？</span>
          <span class="text-pale" v-else>暂无数据</span>
          </div>
        </div>
      </div>
    </transition>
  `,
  props: ['isShow'],
})

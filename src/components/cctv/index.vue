<template>
  <div class="cctv layout-respond">
    <div class="panel-nav">
      <ul>
        <li tabindex="1"
          :class="['gray-title', {on: idx === r.idxChannel}]"
          v-for="(item, idx) in listChannel"
          @click="clickNav({idxChannel: idx, idxAlbum: 0})"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="panel-nav">
      <ul>
        <li tabindex="1"
          :class="['gray-title', {on: idx === idxAlbum}]"
          v-for="(item, idx) in (listChannel[r.idxChannel || 0] || {}).children || []"
          @click="clickNav({idxChannel: r.idxChannel || 0, idxAlbum: idx})"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="panel-main flex-layout flex-v">
      <div class="gray-title flex">
        <div class="ellipsis auto-flex">
          {{videoInfo.m3u8 ? '正在播放：' + videoInfo.title : (idxAlbum === undefined ? '今日视频' : curAlbum.name)}}
        </div>
        <div class="btn-box">
          <template v-if="videoInfo.m3u8">
            <button class="btn btn-success btn-xs"
              @click="playNext(-1)"
            >
              <span class="glyphicon glyphicon-arrow-left"></span>
            </button>
            <button class="btn btn-success btn-xs"
              @click="playNext(1)"
            >
              <span class="glyphicon glyphicon-arrow-right"></span>
            </button>
            <a class="btn btn-success btn-xs"
              :href="r.videoInfo.site"
            >央视播放</a>
            <button class="btn btn-warning btn-xs"
              @click="$root.updateRouter({videoInfo: undefined}, 'push')"
            >关闭视频</button>
          </template>
          <template v-else>
            <button class="btn btn-primary btn-xs"
              v-if="idxAlbum !== undefined"
              @click="$root.updateRouter({idxChannel: undefined, idxAlbum: undefined, searchText: undefined}, 'push')"
            >
              <i class="glyphicon glyphicon-info-sign"></i>
              <span>今日内容</span>
            </button>
            <!-- <button class="btn btn-primary btn-xs">
              <i class="glyphicon glyphicon-info-sign"></i>
              <span>今日关键词</span>
            </button>
            <button class="btn btn-primary btn-xs">
              <i class="glyphicon glyphicon-info-sign"></i>
              <span>历史关键词</span>
            </button> -->
          </template>
        </div>
      </div>
      <div class="auto-flex flex-layout flex-v">
        <form class="space" @submit.prevent="handleSubmitAndFetchVideoList">
          <div class="flex">
            <div class="auto-flex" style="overflow: visible;">
              <div class="input-group">
                <div class="inner">
                  <input type="text" placeholder="搜点什么..." class="form-control"
                    v-model="sugg.text"
                    @input="sugg.oldText = $event.target.value; fetchSugg($event)"
                    @click.stop="fetchSugg"
                    @keydown="handleSearchKeydown"
                  >
                  <div class="panel-sugg" v-if="sugg.list.length > 0">
                    <ul>
                      <li
                        :class="['ellipsis', {on: idx === sugg.cur}]"
                        v-for="(item, idx) in sugg.list"
                        @click="sugg.text = item; handleSubmitAndFetchVideoList($event)"
                      >{{item}}</li>
                    </ul>
                  </div>
                </div>
                <div class="input-group-btn">
                  <button type="submit" class="btn btn-success"> <i class="glyphicon glyphicon-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="box-select">
              <select class="select"
                :value="r.playDirection"
                @change="$root.updateRouter({playDirection: $event.target.value == 1 ? 1 : undefined})"
              >
                <option :value="1">逆序播放</option>
                <option :value="undefined">顺序播放</option>
              </select>
              <select class="select"
                :value="page.cur"
                @change="$root.updateRouter({videoInfo: undefined}); r.page.cur = parseInt($event.target.value);"
                v-if="searchText || (idxAlbum !== undefined && r.page.total > r.page.size)"
              >
                <option
                  :value="n - 1"
                  v-for="n in Math.ceil((page.total || 1) / page.size)"
                >{{'第' + (n) + '页'}}</option>
              </select>
            </div>
          </div>
        </form>
        <div class="auto-flex video-main-wrapper">
          <div class="video-group" @scroll="$root.lazyLoad()">
            <div class="no-data" v-if="videoList.length === 0 && !vm.is.loading">
              <div class="inner c cxy">
                <div class="alert alert-info">
                  <div style="margin-bottom: 1em;">
                    <div>暂无数据，点击确定，通过搜索获取数据</div>
                  </div>
                  <button class="btn btn-block btn-primary"
                    @click="sugg.text = curAlbum.name; handleSubmitAndFetchVideoList()"
                  >确定</button>
                </div>
              </div>
            </div>
            <section v-else
              v-for="(groupItem, groupIdx) in videoGroup"
            >
              <div class="group-title">
                <strong>{{groupItem.title}}</strong>
              </div>
              <ul>
                <li
                  v-for="(item, idx) in groupItem.list"
                  :key="item.desc + idx"
                >
                  <div class="inner"
                    :style="{backgroundImage: 'url(./static/img/img-blank.png)'}"
                    :lazy-load="item.img"
                    :title="item.desc"
                    :key="item.title"
                    @click="fetchM3u8(item)"
                    tabindex="1"
                  >
                    <div class="text-box">
                      <div class="title line-2"
                        v-if="item.title"
                      >{{item.title}}</div>
                      <div class="desc line-2"
                        v-if="item.desc"
                      >{{item.desc.length > 40 ? item.desc.slice(0, 40) + '...' : item.desc}}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          <player
            v-if="videoUrl"
            @ended="$delete($root.mapPlayTime, videoInfo.m3u8); playNext()"
          ></player>
          <loading :is-show="$root.is.loading"></loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const coms = [
  'components/loading',
  'components/player',
].map((path) => {
  return require('@/' + path).default
})

export default {
  name: 'cctv',
  data() {
    return {
      channel: {
        list: []
      },
      video: {
        groupItem: {},
        group: [],
        list: [],
      },
      keyWord: {
        today: [],
        history: [],
      },
      sugg: {
        text: '',
        oldText: '',
        cur: -1,
        list: [],
      },
    }
  },
  methods: {
    clickNav(o) {
      const vm = this.$root
      const r = vm.router

      vm.updateRouter({
        ...o,
        searchText: undefined,
        videoInfo: undefined,
        page: {
          cur: 0,
          size: 100,
          total: 0,
        },
      }, 'push')

      this.fetchVideoList()
    },
    playNext(direction) {
      const vm = this.$root
      const r = vm.router
      const videoList = this.videoList
      const targetVideoSite = this.videoInfo.site
      let targetIndex = -100
      let elItem

      for (let i = 0; i < videoList.length; i++) {
        if (videoList[i].site === targetVideoSite) {
          targetIndex = i
          break
        }
      }

      targetIndex += (direction === undefined ? (r.playDirection ? -1 : 1) : direction)
      elItem = videoList[targetIndex]
      elItem ? this.fetchM3u8(elItem) : vm.alert('当前页没有可以播放的视频了')
    },
    clearSugg() {
      const sugg = this.sugg

      clearTimeout(this.timerFetchSugg)
      sugg.oldText = ''
      sugg.list = []
      sugg.cur = -1
    },
    fetchSugg(e = {}) {
      const vm = this.$root
      const r = vm.router
      const sugg = this.sugg
      const signFetchSugg = this.signFetchSugg = Math.random()

      if (e.ctrlKey) return

      sugg.cur = -1
      clearTimeout(this.timerFetchSugg)
      this.timerFetchSugg = setTimeout(() => {
        const searchText = sugg.text.trim()
        if (!searchText) return

        $.loadScript('https://search.cctv.com/webtvsuggest.php?q=' + encodeURIComponent(searchText), () => {
          if (signFetchSugg !== this.signFetchSugg) {
            console.warn('signFetchSugg 时过境迁')
            return
          }

          const data = window.suggestJSON || []
          sugg.list = data.map(v => v.name)
          sugg.cur = sugg.list.length
        })
      }, e.type !== 'click' ? 260 : 0)
    },
    handleSubmitAndFetchVideoList() {
      const vm = this.$root

      vm.updateRouter({
        searchText: this.sugg.text,
        // idxChannel: undefined,
        // idxAlbum: undefined,
        videoInfo: undefined,
      }, this.sugg.text !== this.searchText)

      this.chooseFetchFn()
    },
    handleSearchKeydown(e) {
      const vm = this.$root
      const r = vm.router
      const sugg = this.sugg
      const sKey = vm.keyMap[e.type === 'submit' ? 13 : e.keyCode]

      switch (sKey) {
        case 'up':
        case 'down':
          const len = sugg.list.length + 1
          e.preventDefault()
          sKey === 'up' ? sugg.cur-- : sugg.cur++
          sugg.cur = (sugg.cur % len + len) % len
          sugg.text = sugg.list[sugg.cur] || sugg.oldText
          break
      }
    },
    fetchM3u8(elItemOrigin) {
      const vm = this.$root
      const r = vm.router
      const elItem = clone(elItemOrigin)

      elItem.title = elItem.title || elItem.desc
      delete elItem.desc

      if (elItem.m3u8) {
        vm.updateRouter({videoInfo: elItem}, 'push')
        return
      }

      vm.is.loading = true
      window.getHtml5VideoData = (data) => {
        window.getHtml5VideoData = null
        vm.is.loading = false
        data = JSON.parse(data)

        if (data.hls_url) {
          elItemOrigin.m3u8 = elItem.m3u8 = data.hls_url
          vm.updateRouter({videoInfo: elItem}, 'push')
        } else {
          handleError()
        }
      }

      const loadScript = () => {
        $.loadScript(
          'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?' +
          'pid='  + elItem.id  + '&' +
          'tai=ipad&' +
          'from=html5&' +
          'tsp=1553074558&' +
          'vn=2049&' +
          'vc=8AB31F7208274D1C0FD8874764B5EBE3&' +
          'uid=2C5D032B73247D87E67C414F62BA2E7B&wlan=',
          null, handleError
        )
      }

      const handleError = () => {
        vm.confirm('播放失败，点击确定进入央视官方播放', () => {
          location.href = elItem.site
        })
      }

      if (elItem.id) {
        loadScript()
      } else {
        $.get('./api/get.php', {
          a: 'get',
          url: elItem.site
        }, (sHtml) => {
          elItemOrigin.id = elItem.id = 
          (sHtml.match(/"videoCenterId","([^"]*)"/m) || [])[1] || 
          (sHtml.match(/(?:guid = ")(\w{32})(?:")/) || [])[1] || ''
          loadScript()
        })
      }
    },
    fetchChannel(cb) {
      const vm = this.$root
      const r = vm.router

      clearTimeout(vm.timerFetchChannel)
      vm.timerFetchChannel = setTimeout(() => {
        $.get('static/data/cctv.json', {
          a: 'get',
          url: 'static/data/cctv.json'
        }, (list) => {
          this.channel.list = list
          cb.call(this)
        })
      }, 50)
    },
    chooseFetchFn(cb) {
      this[this.searchText ? 'justFetchAlbum' : 'fetchVideoList'](cb)
    },
    async justFetchAlbum(cb) {
      const vm = this.$root
      const signJustFetchAlbum = this.signJustFetchAlbum = this.signFetchVideoList = Math.random()

      this.clearSugg()
      vm.is.loading = true
      clearTimeout(this.timerJustFetchAlbum)

      this.timerJustFetchAlbum = setTimeout(() => {
        const searchText = this.searchText

        $.get('./api/get.php', {
          a: 'get',
          url: 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(searchText) + '&type=video'
        }, async (sHtml) => {
          const urls = sHtml.match(/https:\/\/r\.img\.cctvpic\.com\/so\/cctv\/list[^"]*/g) || []
          this.video.group = []
          this.video.groupItem.list = []

          for (let i = 0; i < urls.length; i++) {
            await new Promise((next) => {
              const src = urls[i]
              window.playlistArray = {}

              $.loadScript(src, () => {
                if (signJustFetchAlbum !== this.signJustFetchAlbum) {
                  console.warn('justFetchAlbum 时过境迁')
                  return
                }

                Object.keys(playlistArray).forEach((k) => {
                  const data = playlistArray[k]
                  let list = data.video.recent

                  list = list || data.video
                  this.video.group.push({
                    title: decodeURIComponent(data.playlist.title),
                    list: list.map((item) => {
                      item.title = decodeURIComponent(item.title)
                      return {
                        id: item.detailsid,
                        img: item.imagelink,
                        title: '',
                        desc: item.title,
                        site: item.targetpage,
                      }
                    })
                  })
                })
                next()
              })
            })
          }

          this.fetchVideoList(cb)
        })
      }, 100)
    },
    fetchVideoList(cb) {
      const vm = this.$root
      const r = vm.router
      const elItem = this.curAlbum
      const signFetchVideoList = this.signFetchVideoList = Math.random()
      let searchText = this.searchText

      this.clearSugg()
      vm.is.loading = true
      clearTimeout(vm.timerFetchVideoList)

      vm.timerFetchVideoList = setTimeout(() => {
        searchText = this.searchText
        if (!searchText) this.video.group = []

        if (searchText) {
          fetchBySearch()
        } else if (r.idxAlbum === undefined) {
          fetchByMostNew()
        } else {
          fetchByDef()
        }
      }, 100)

      const fetchByMostNew = () => {
        $.get('api/get.php', {
          a: 'getCCTVIndex',
        }, (str) => {
          if (signFetchVideoList !== this.signFetchVideoList) {
            console.warn('fetchByMostNew warn 时过境迁')
            return
          }

          vm.is.loading = false
          str = str.slice(str.search(/<body[^<>]+>/), str.lastIndexOf('<\/body>'))
          str = str.slice(str.indexOf('\n')).trim()

          const div = document.createElement('div')
          div.innerHTML = str
          const list = [].slice.call(div.querySelectorAll('a img[lazy]')).map((img, idx, arr) => {
            const a = img.closest('a')
            const href = a.href.trim()
            const node = img.closest('.box, li, .first')
            let textArr = [].slice.call(node.querySelectorAll('p')).map(node => node.innerText.trim()).filter(v => v)
            textArr = textArr.length >= 2 ? textArr : [].slice.call(node.querySelectorAll('a')).map(node => node.innerText.trim()).filter(v => v)

            if (!/^http:\/\/tv.cctv.com\/\d{4}\//.test(href) || textArr.length === 0) return

            return {
              id: '',
              img: img.getAttribute('lazy'),
              title: textArr[textArr.length - 2] || '',
              desc: textArr[textArr.length - 1] || '',
              site: href,
            }
          }).filter(v => v)

          this.video.groupItem = {
            title: '今日内容共' + list.length + '条',
            list,
          }
          r.page.total = list.length
          vm.lazyLoad()
          cb && cb()
        })
      }

      const fetchBySearch = async () => {
        const groupItem = this.video.groupItem = {
          title: '全部视频结果共0条',
          list: [],
        }

        for (let i = 0; i < 5; i++) {
          const curPage = r.page.cur * 5 + i + 1

          if (i > 0 && curPage > Math.ceil(r.page.total / 20)) break

          await new Promise((next) => {
            $.get('./api/get.php', {
              a: 'get',
              url: 'https://search.cctv.com/ifsearch.php?'+
              'page=' + curPage + '&qtext=' + searchText + '&'+
              'sort=relevance&'+
              'pageSize=20&'+
              'type=video&'+
              'vtime=-1&'+
              'datepid=1&'+
              'channel=&'+
              'pageflag=1&'+
              'qtext_str=' + searchText,
            }, (data) => {
              if (signFetchVideoList !== this.signFetchVideoList) {
                console.warn('fetchBySearch 时过境迁', searchText)
                return
              }

              const list = data.list.map((item) => {
                if (/\/\w{32}-\d+\.\w+$/.test(item.imglink)) {
                  const src = item.imglink
                  const rangeL = src.lastIndexOf('/') + 1
                  const rangeR = src.search(/-\d+/)
                  item.id = src.slice(rangeL, rangeR)
                } else {
                  item.id = ''
                }

                try {
                  item.all_title = decodeURIComponent(item.all_title)
                } catch (e) {}

                return {
                  id: item.id,
                  img: item.imglink,
                  title: '',
                  desc: item.all_title,
                  desc: item.all_title,
                  site: item.urllink,
                }
              })/*.filter((v) => {
                return v.site.indexOf('art.cctv.com') > -1
              })*/

              r.page.total = data.total
              groupItem.title = '全部视频结果共' + r.page.total + '条'
              groupItem.list = groupItem.list.concat(list)

              vm.is.loading = false
              vm.lazyLoad()
              next()
            })
          })
        }
        cb && cb()
      }

      const fetchByDef = () => {
        $.jsonp('http://api.cntv.cn/lanmu/videolistByColumnId', {
          'id': elItem.id,
          'n': '100',
          'of': 'fdate',
          'p': r.page.cur + 1,
          'type': '0',
          'serviceId': 'tvcctv',
          '?': 'cb',
        }, ({response}) => {
          if (signFetchVideoList !== this.signFetchVideoList) {
            console.warn('fetchByDef warn 时过境迁')
            return
          }

          const list = (response || {}).docs || []

          vm.is.loading = false
          this.video.groupItem = {
            title: '全部视频结果共' + response.numFound + '条',
            list: list.map((v) => {
              return {
                id: v.videoSharedCode.length === 32 ? v.videoSharedCode : '',
                img: v.videoKeyFrameUrl || v.videoKeyFrameUrl2 || v.videoKeyFrameUrl3,
                title: v.videoTitle || '',
                desc: v.videoBrief || '',
                site: v.videoUrl,
              }
            })
          }
          r.page.total = response.numFound
          vm.lazyLoad()
          document.querySelector('#app .cctv .video-main-wrapper .video-group').scrollTop = 0
          cb && cb()
        })
      }
    }
  },
  components: {
    ...(() => {
      const map = {}
      coms.forEach((item, idx, arr) => {
        map[item.name] = item
      })
      return map
    })()
  },
  watch: {
    'r.idxChannel'() {
      this.fetchVideoList()
    },
    'r.idxAlbum'() {
      this.fetchVideoList()
    },
    'r.page.cur'() {
      this.fetchVideoList()
    },
    'r.searchText'(newVal) {
      this.sugg.text = newVal || ''
      this.chooseFetchFn()
    },
  },
  computed: {
    r() {
      return this.$root.router
    },
    idxChannel() {
      return this.r.idxChannel || 0
    },
    idxAlbum() {
      return this.r.idxAlbum/* || 0*/
    },
    videoInfo() {
      return this.r.videoInfo || {}
    },
    videoTitle() {
      return this.videoInfo.title || 'no title'
    },
    videoId() {
      return this.videoInfo.id || 'no id'
    },
    videoUrl() {
      return this.videoInfo.m3u8 || ''
    },
    searchText() {
      return (this.r.searchText || '').trim()
    },
    videoGroup() {
      return this.video.group.concat(this.video.groupItem)
    },
    videoList() {
      return [].concat.apply([], this.video.group.concat(this.video.groupItem).map(v => v.list))
    },
    listChannel() {
      return this.channel.list
    },
    listAlbum() {
      return (this.listChannel[this.idxChannel] || {}).children || []
    },
    curAlbum() {
      return this.listAlbum[this.idxAlbum] || {}
    },
    page() {
      return this.r.page || {
        cur: 0,
        size: 100,
        total: 0,
      }
    },
  },
  mounted() {
    const vm = this.$root
    const r = vm.router

    if (vm.is.local && this.videoInfo.m3u8) {
      vm.playM3u8()
    }

    this.sugg.text = r.searchText || ''
    this.$nextTick(() => {
      this.fetchChannel(() => {
        this.chooseFetchFn()
      })
    })
  },
  beforeCreate() {
    this.$root.cctv = this
  },
  beforeDestroy() {
    delete this.$root.cctv
  },
}

{
  const nodeStyle = document.getElementById('cctv-media') || document.createElement('style')
  let sHtml = ''
  nodeStyle.id = 'cctv-media'

  sHtml += new Array(50).fill().map((_, idx) => {
    let w = idx * 280 + 500
    const n = Math.ceil(w / 280)

    return `
      @media (min-width: ${w}px) {
        .cctv .video-main-wrapper .video-group li {
          width: ${1 / n * 100}% !important;
        }
      }
    `
  }).join('')

  nodeStyle.innerHTML = sHtml
  document.body.appendChild(nodeStyle)
}

</script>

<style lang="scss" scoped>
.cctv {
  .video-main-wrapper {
    & > div {
      width: 100%; height: 100%; position: absolute; left: 0; top: 0; overflow: auto;
    }
    .video-group {
      .no-data {}
      section {
        margin: 1em;
        &:first-child {margin-top: .2em;}
        .group-title {
          margin-bottom: 1em;
        }
        ul {
          margin: -2px; font-size: 12px;
          li {
            width: 50%; display: inline-block; padding: 2px; vertical-align: top;
            & > .inner {
              padding-top: 62.5%; cursor: pointer; overflow: hidden;
              background: #eee no-repeat center / cover;
              .text-box {
                width: 100%; padding: 8px;
                position: absolute; left: 0; bottom: 0;
                color: #fff; background: rgba(0,0,0,.5);
                .title {margin-bottom: 5px;}
              }
            }
          }
        }
      }
    }
  }
  form {
    position: relative; z-index: 2;
    .box-select {
      select {margin-left: .5em;}
    }
    .panel-sugg {
      width: 100%; position: absolute; left: 0; top: 100%; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,.2); padding: .5em 0;
      ul {
        li {
          padding: .5em 1em; cursor: pointer;
          &.on, &:hover {background: #f3f6f9;}
        }
      }
    }
  }
}

@media (max-width: 500px) {
  .cctv form .panel-sugg {
    min-width: calc(100vw - 2em);
  }
}
</style>
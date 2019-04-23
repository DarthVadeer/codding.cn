<template>
  <div class="cctv">
    <div class="flex-layout flex-row flex-respond">
      <div class="box-list box-list-channel">
        <ul>
          <li
            v-for="(item, idx) in channel.list"
            :class="['gray-title', {on: idx === r.idxChannel}]"
            @click="clickNav({idxChannel: idx, idxAlbum: 0, idxAux9: 0})"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="box-list box-list-album">
        <ul>
          <li
            v-for="(item, idx) in listAlbum"
            :class="['gray-title', {on: idx === r.idxAlbum}]"
            @click="clickNav({idxAlbum: idx, idxAux9: 0})"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="box-list box-list-aux9"
        v-if="r.idxChannel === 8 && listAux9.length > 0"
      >
        <ul>
          <li
            v-for="(item, idx) in listAux9"
            :class="['gray-title ellipsis', {on: idx === r.idxAux9}]"
            @click="clickNav({idxAux9: idx})"
          >{{item}}</li>
        </ul>
      </div>
      <div class="box-main auto-flex">
        <div class="flex-layout">
          <div class="gray-title lmr">
            <div class="fr btn-box">
              <button class="btn btn-primary btn-xs"
                @click="r.isShowHotWord = !r.isShowHotWord"
              >
                <i class="glyphicon glyphicon-info-sign"></i>
                <span>检索关键词</span>
              </button>
            </div>
            <div class="mid">
              <span v-if="r.searchText.trim()">搜索：{{r.searchText + (r.page.total > 0 ? ' (' + (r.page.total) + ')' : '')}}</span>
              <span v-else>{{curAlbum.name + (r.page.total > 0 ? ' (' + (r.page.total) + ')' : '')}}</span>
            </div>
          </div>

          <form class="space"
            @submit.prevent="chooseSugg()"
          >
            <div class="flex-layout flex-row">
              <div class="auto-flex" style="overflow: visible;">
                <div class="input-group">
                  <div class="inner">
                    <input type="text" class="form-control" placeholder="搜点什么..."
                      v-model="sugg.text"
                      @input="fetchSugg"
                      @click.stop="fetchSugg"
                      @keydown="handleKeydownToCtrlSugg"
                    >
                    <div class="panel-sugg" v-if="sugg.list.length > 0 && sugg.text.trim()">
                      <ul>
                        <li tabindex="1" 
                          v-for="(item, idx) in sugg.list"
                          :class="['ellipsis', {on: idx === sugg.cur}]"
                          @click="sugg.cur = idx; chooseSugg()"
                        >{{item}}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="input-group-btn">
                    <button class="btn btn-success" type="submit" @click.stop>
                      <i class="glyphicon glyphicon-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div style="margin-left: 4px;">
                <select
                  :class="{select: !$root.is.ios}"
                  :value="r.playDirection"
                  @change="r.playDirection = parseInt($event.target.value)"
                >
                  <option value="0">逆序播放</option>
                  <option value="1">顺序播放</option>
                </select>
                <select style="min-width: 72px;" 
                  :class="{select: !$root.is.ios}"
                  :disabled="$root.is.loading || r.page.total === 0"
                  :value="r.page.cur"
                  @change="$root.isRouterPush = true; r.page.cur = parseInt($event.target.value);"
                >
                  <option
                    :value="n - 1"
                    v-for="n in Math.ceil((r.page.total || 1) / r.page.size)"
                  >{{'第' + n + '页'}}</option>
                </select>
              </div>
            </div>
          </form>

          <div class="auto-flex">
            <div class="auto-scroll space video-wrapper"
              ref="videoWrapper"
              @scroll="$root.lazyLoad()"
            >
              <video-group :group-list="video.group2"></video-group>
              <video-group :group-list="video.group"></video-group>
            </div>

            <loading :is-show="$root.is.loading"></loading>

            <div class="auto-scroll space video-wrapper panel-hot-word"
              v-show="r.isShowHotWord"
            >
              <ul class="video-list"
                @click="deligateLi"
              >
                <li v-for="(item, idx) in hotWord.list" class="ellipsis">{{item}}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 播放器 -->
        <div class="box-player flex-layout"
          v-if="r.videoInfo.m3u8"
        >
          <div class="gray-title lmr">
            <div class="btn-box fr">
              <span class="btn btn-success btn-xs"
                @click="clickAndPlayInCCTV()"
              >央视播放</span>
              <span class="btn btn-warning btn-xs"
                @click="$root.updateRouter({videoInfo: {}}, 'push')"
              >关闭视频</span>
            </div>
            <div class="mid">
              <span class="hidden-sm hidden-xs">正在播放：</span>
              <span>{{r.videoInfo.title}}</span>
            </div>
          </div>
          <div class="auto-flex">
            <player></player>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cctv',
  data() {
    return {
      channel: {
        list: [],
      },
      sugg: {
        cur: 0,
        text: '',
        list: [],
      },
      video: {
        group: [],
        group2: [],
        aux9: {},
      },
      hotWord: {
        isLoaded: false,
        list: [],
      },
    }
  },
  methods: {
    deligateLi(e) {
      const me = this

      if (e.target.tagName.toLowerCase() === 'li') {
        me.sugg.text = e.target.innerText.trim()
        me.chooseSugg()
      }
    },
    chooseSugg(suggText) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const sugg = me.sugg
      const searchText = (sugg.list[sugg.cur] || sugg.text || suggText).trim()

      if (!searchText) return
      
      vm.updateRouter({
        searchText,
        isShowHotWord: false,
      }, 'push')
      me.justFetchAlbum()
    },
    handleKeydownToCtrlSugg(e) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const sugg = me.sugg
      const sKey = vm.keyMap[e.keyCode]
      let cur = sugg.cur
      
      switch (sKey) {
        case 'up':
        case 'down':
          e.preventDefault()
          const len = sugg.list.length + 1
          let cur = sugg.cur
          sKey === 'up' ? cur-- : cur++
          sugg.cur = (cur % len + len) % len
          break
      }
    },
    fetchSugg(e) {
      const me = this
      const vm = this.$root
      const r = vm.router
      const sugg = me.sugg
      const searchText = sugg.text.trim()

      if (!searchText) return

      // sugg.list = []
      clearTimeout(vm.timerFetchSugg)
      vm.timerFetchSugg = setTimeout(() => {
        vm.loadScript('https://search.cctv.com/webtvsuggest.php?q=' + encodeURIComponent(searchText), () => {
          const data = window.suggestJSON || []
          sugg.list = data.map(v => v.name)
          sugg.cur = sugg.list.length
        })
      }, e.type === 'click' ? 0 : 200)
    },
    clickAndPlayInCCTV() {
      location.href = this.r.videoInfo.site
    },
    clickNav(o) {
      const me = this
      const vm = me.$root
      const r = vm.router

      vm.updateRouter({
        ...o,
        isShowHotWord: false,
        searchText: '',
        page: {
          cur: 0,
          size: 100,
          total: 0,
        },
        videoInfo: {},
      }, 'push')

      me.fetchVideoList()
    },
    fetchChannel(cb) {
      const me = this
      const vm = me.$root
      const r = vm.router
      
      vm.get('./static/data/cctv.json', {}, (list) => {
        me.channel.list = list
        cb && cb()
      })
    },
    justFetchAlbum() {
      const me = this
      const vm = me.$root
      const r = vm.router
      const searchText = r.searchText.trim()
      const signJustFetchAlbum = me.signJustFetchAlbum = Math.random()

      clearTimeout(me.timerFetchSugg)
      me.sugg.list = []
      me.video.group2 = []

      if (!searchText) {
        console.log('justFetchAlbum ... no searchText')
        return
      }

      vm.is.loading = true
      clearTimeout(me.timerJustFetchAlbum)
      me.timerJustFetchAlbum = setTimeout(() => {
        vm.get('./api/pub.php', {
          a: 'get',
          url: 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(searchText) + '&type=video'
        }, async (sHtml) => {
          const urls = sHtml.match(/https:\/\/r\.img\.cctvpic\.com\/so\/cctv\/list[^"]*/g) || []

          for (let i = 0; i < urls.length; i++) {
            await new Promise((next) => {
              const src = urls[i]
              window.playlistArray = {}
              vm.loadScript(src, () => {
                if (signJustFetchAlbum !== me.signJustFetchAlbum) {
                  console.log('fetchBySearch 时过境迁')
                  me.justFetchAlbum()
                  return
                }

                Object.keys(playlistArray).forEach((k) => {
                  const data = playlistArray[k]
                  let list = data.video.recent

                  list = list || data.video
                  me.video.group2.push({
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

          me.fetchVideoList()
        })
      }, 100)
    },
    fetchVideoUrl(elItemOrigin) {
      const vm = this.$root
      const r = vm.router
      const elItem = vm.clone(elItemOrigin)

      vm.is.loading = true
      elItem.title = elItem.title || elItem.desc
      delete elItem.desc

      window.getHtml5VideoData = function(data) {
        vm.is.loading = false
        data = JSON.parse(data)

        if (data.hls_url) {
          elItem.m3u8 = data.hls_url
          vm.updateRouter({videoInfo: elItem}, 'push')
        } else {
          vm.confirm('无法播放当前视频，点击确定进入央视播放', () => {
            location.href = elItem.site
          }, () => {
            vm.is.loading = false
          })
        }
      }

      if (elItem.id) {
        loadScript()
      } else {
        vm.get('./api/pub.php', {
          a: 'get',
          url: elItem.site
        }, (sHtml) => {
          r.videoInfo.id = elItemOrigin.id = elItem.id = 
          (sHtml.match(/"videoCenterId","([^"]*)"/m) || [])[1] || 
          (sHtml.match(/(?:guid = ")(\w{32})(?:")/) || [])[1] || ''
          loadScript()
        })
      }

      function loadScript() {
        vm.loadScript('http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1553074558&vn=2049&vc=8AB31F7208274D1C0FD8874764B5EBE3&uid=2C5D032B73247D87E67C414F62BA2E7B&wlan=')
      }
    },
    fetchVideoList(cb) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const curAlbum = me.curAlbum
      const sugg = me.sugg
      const searchText = r.searchText.trim()

      if (!curAlbum.id) return

      vm.is.loading = true
      clearTimeout(vm.timerFetchVideoList)
      vm.timerFetchVideoList = setTimeout(() => {
        const signFetchBySearch = me.signFetchBySearch = Math.random()
        clearTimeout(me.timerFetchSugg)
        sugg.list = []

        if (searchText) {
          fetchBySearch()
        } else {
          me.video.group2 = []
          fetchByDef()
        }

        async function fetchBySearch() {
          me.video.group = []
          me.video.group.push({
            title: '全部视频结果共0条',
            list: [],
          })
          const lastGroup = me.video.group.last()

          for (let i = 0; i < 5; i++) {
            const curPage = r.page.cur * 5 + i + 1

            if (
              i > 0 && curPage > Math.ceil(r.page.total / 20) ||
              signFetchBySearch !== me.signFetchBySearch
            ) break

            await new Promise((succ) => {
              vm.get('./api/pub.php', {
                a: 'get',
                url: 'https://search.cctv.com/ifsearch.php?page=' + curPage + '&qtext=' + searchText + '&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=1&qtext_str=' + searchText,
              }, (data) => {
                if (signFetchBySearch !== me.signFetchBySearch) return

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
                lastGroup.title = '全部视频结果共' + r.page.total + '条'
                lastGroup.list = lastGroup.list.concat(list)

                vm.is.loading = false
                vm.lazyLoad()
                succ()
              })
            })
          }
        }

        function fetchByDef() {
          function defFinish() {
            vm.is.loading = false
            vm.lazyLoad()
            me.$refs.videoWrapper.scrollTop = 0
            me.playVideoByChangeCurPage && me.playVideoByChangeCurPage()
            delete me.playVideoByChangeCurPage

            if (r.idxChannel === 8) {
              const list = (me.video.aux9[me.curAlbum.name] || {})[me.listAux9[r.idxAux9]] || []
              me.video.group = [{
                title: '全部视频共' + list.length + '条',
                list,
              }]
            }
          }

          if (r.idxChannel === 8) {
            if (Object.keys(me.video.aux9).length > 0) {
              defFinish()
            } else {
              vm.get('./static/data/aux9.json', {}, (data) => {
                me.video.aux9 = data
                defFinish()
              }, defFinish)
            }
          } else {
            vm.jsonp('http://api.cntv.cn/lanmu/videolistByColumnId', {
              'id': curAlbum.id,
              'n': 100,
              'of': 'fdate',
              'p': r.page.cur + 1,
              'type': '0',
              'serviceId': 'tvcctv',
              '?': 'cb',
            }, (dataOrigin) => {
              if (signFetchBySearch !== me.signFetchBySearch) {
                console.warn('signFetchBySearch 时过境迁')
                me.fetchVideoList()
                return
              }

              dataOrigin.response = dataOrigin.response || {}
              const data = dataOrigin.response.docs || []

              r.page.total = dataOrigin.response.numFound || 0
              me.video.group = [{
                title: '全部视频共' + r.page.total + '条',
                list: data.map((v) => {
                  return {
                    id: v.videoSharedCode,
                    img: v.videoKeyFrameUrl || v.videoKeyFrameUrl2 || v.videoKeyFrameUrl3,
                    title: v.videoTitle || '',
                    desc: v.videoBrief || '',
                    site: v.videoUrl,
                  }
                })
              }]

              defFinish()
            }, defFinish)
          }
        }
      }, 200)
    },
    fetchHotWord() {
      const me = this
      const vm = me.$root
      const r = vm.router
      
      if (me.hotWord.isLoaded) return

      me.hotWord.isLoaded = true
      vm.get('./static/data/hotWord.json', {}, (list) => {
        me.hotWord.list = list
      })
    },
  },
  computed: {
    r() {
      return this.$root.router
    },
    curChannel() {
      return this.channel.list[this.r.idxChannel] || {}
    },
    listAlbum() {
      return this.curChannel.children || []
    },
    curAlbum() {
      return this.listAlbum[this.r.idxAlbum] || {name: ''}
    },
    listAux9() {
      const me = this
      const vm = me.$root
      const r = vm.router
      
      return Object.keys(me.video.aux9[me.curAlbum.name] || {})
    },
  },
  components: {
    'video-group': {
      template: `
        <div v-if="groupList.length > 0">
          <section class="video-group"
            v-for="(item, idx) in groupList"
          >
            <div class="group-title">
              <strong>{{item.title}}</strong>
            </div>
            <ul class="video-list">
              <li
                v-for="(item, idx) in item.list"
                :key="item.desc + idx"
              >
                <div class="inner"
                  :style="{backgroundImage: 'url(./static/img/img-blank.png?a)'}"
                  :lazy-load="item.img"
                  :title="item.desc"
                  :key="item.title"
                  @click="$parent.fetchVideoUrl(item)"
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
      `,
      props: ['groupList'],
    }
  },
  watch: {
    'r.isShowHotWord'(newVal) {
      this.fetchHotWord()
    },
  },
  beforeCreate() {
    this.$root.cctv = this
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router

    me.sugg.text = r.searchText
    me.fetchChannel(() => {
      r.searchText ? me.justFetchAlbum() : me.fetchVideoList()
    })
    r.isShowHotWord && me.fetchHotWord()
  },
  destroyed() {
    window.onresize = null
  },
}

{
  const nodeStyle = document.getElementById('cctv-media') || document.createElement('style')

  nodeStyle.id = 'cctv-media'
  let sHtml = new Array(50).fill().map((_, idx) => {
    return `
      @media (min-width: ${idx * 200 + 720}px) {
        .cctv .box-main .video-list li {
          width: ${1 / (idx + 2) * 100}%;
        }
      }
    `
  }).join('')

  sHtml += `
    @media (max-width: 720px) {
      .cctv .box-main .video-list li {
        width: 33.33%;
      }
    }
    @media (max-width: 550px) {
      .cctv .box-main .video-list li {
        width: 50%;
      }
    }
  `

  nodeStyle.innerHTML = sHtml
  document.body.appendChild(nodeStyle)
}
</script>

<style lang="scss">
.cctv {
  .box-list {
    overflow: auto; background: #eee;
    border-left: 1px solid #fff; border-right: 1px solid rgba(0,0,0,.08);
    ul {
      margin-bottom: 100px;
      li {
        cursor: pointer;
      }
    }
  }
  .box-main {
    & > div {
      width: 100%; height: 100%;
      position: absolute; left: 0; top: 0; z-index: 1;
    }
    .panel-hot-word {
      background: #fff; overflow-y: scroll;
      .video-list {
        line-height: 1.8em;
        li {display: inline-block; cursor: pointer;}
      }
      .img-list-box {
        img {vertical-align: top;}
      }
    }
    .video-wrapper {
      padding-top: 0; padding-bottom: 100px;
      & > div:first-child {
        section:first-child {
          .group-title {margin-top: 0;}
        }
      }
      section {
        .group-title {margin: 15px 0 10px 0;}
        .video-list {
          margin: -2px;
          li {
            display: inline-block; padding: 2px; vertical-align: top;
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
    form {
      .form-control {display: block;}
      .panel-sugg {
        width: 100%; background: #fff; position: absolute; left: 0; top: 100%; z-index: 2;
        box-shadow: 0 0 5px rgba(0,0,0,.2);
        ul {
          padding: 6px 0; margin-bottom: 0;
          li {
            padding: 6px 12px; cursor: pointer;
            &:hover,
            &.on {background: #eee;}
          }
        }
      }
    }
  }
}

@media (max-width: 500px) {
  .cctv .box-main form .panel-sugg {
    min-width: calc(100vw - 24px);
  }
}
</style>
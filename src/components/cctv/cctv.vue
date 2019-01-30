<template>
  <div class="cctv">
    <div class="flex-layout flex-row">
      <div class="box-channel">
        <ul>
          <li
            v-for="(item, idx) in listChannel"
            :class="['gray-title', {on: idx === $root.router.idxChannel}]"
            @click="clickChannel(item, idx)"
          >{{item.name + ' (' + item.children.length + ')' }}</li>
        </ul>
      </div>
      <div class="box-album">
        <ul>
          <li
            v-for="(item, idx) in listAlbum"
            :class="['gray-title', {on: idx === $root.router.idxAlbum}]"
            @click="clickAlbum(item, idx)"
          >{{item.name + ' (' + item.n + ')' }}</li>
        </ul>
      </div>
      <div class="box-main auto-flex">
        <div class="flex-layout">
          <div class="gray-title lmr">
            <div class="fr" v-if="!$root.router.searchText">
              <button class="btn btn-xs btn-primary" @click="livePlaySelf()" v-if="$root.is.supportM3u8">本站直播</button>
              <button class="btn btn-xs btn-primary" @click="livePlay()">央视直播</button>
              <!-- <button class="btn btn-xs btn-primary">评论</button> -->
            </div>
            <div class="m">
              <span v-if="!$root.router.searchText">{{curAlbum.name + ' (' + curAlbum.n + ')'}}</span>
              <span v-else>搜索结果：{{$root.router.searchText}}</span>
            </div>
          </div>
          <div class="auto-flex">
            <div class="auto-scroll" @scroll="$root.lazyLoad()">
              <div class="list-video">
                <ul class="af">
                  <li v-for="(item, idx) in $root.cctv.video.list">
                    <div class="pt"
                      :lazy-load="item.img"
                      @click="$root.fetchVideoInfo(item)"
                    >
                      <div class="text-box">
                        <div class="title ellipsis" :title="item.title" v-if="item.title">{{item.title}}</div>
                        <div class="desc line-2" :title="item.desc" v-if="item.desc">{{item.desc}}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <loading :is-show="$root.is.loading"></loading>
          </div>
          <div class="box-pagination c">
            <pagin :page="$root.router.page"></pagin>
          </div>
        </div>

        <div class="flex-layout" v-if="$root.router.m3u8">
          <div class="gray-title lmr">
            <div class="fr">
              <button class="btn btn-xs btn-warning"
                @click="$root.updateRouter({m3u8: ''}, 'push')"
              >关闭视频</button>
            </div>
            <div class="m">{{$root.router.videoTitle}}</div>
          </div>
          <div class="auto-flex">
            <hls-player
              :src="$root.router.m3u8"
            ></hls-player>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// encodeURIComponent

export default {
  name: 'cctv',
  rootData() {
    return {
      cctv: {
        channel: {
          list: [],
        },
        video: {
          list: []
        },
      }
    }
  },
  methods: {
    clickChannel(elItem, idx) {
      const root = this.$root
      const r = root.router

      root.updateRouter({
        idxChannel: idx,
        idxAlbum: 0,
        m3u8: '',
        searchText: '',
        page: {
          ...r.page,
          cur: 1
        }
      }, 'push')
    },
    clickAlbum(elItem, idx) {
      const root = this.$root
      const r = root.router
      
      root.updateRouter({
        idxAlbum: idx,
        m3u8: '',
        searchText: '',
        page: {
          ...r.page,
          cur: 1
        }
      }, 'push')
    },
    livePlaySelf() {
      const root = this.$root
      const r = root.router
      const curChannel = root.cctv.channel.list[r.idxChannel]
      const n = (curChannel.name.match(/\d+/g) || [])[0]
      const videoUrl = n == '14' ?
      'http://cctvalih5c.v.myalicdn.com/live/cctvchild_1/index.m3u8?contentid=2820180516001&uid=default' :
      'http://cctvalih5c.v.myalicdn.com/live/cctv' + n + '_1/index.m3u8?contentid=2820180516001&uid=default'

      root.updateRouter({
        videoId: '',
        videoTitle: '直播：' + curChannel.name,
        m3u8: videoUrl,
      }, 'push')
    },
    livePlay() {
      const root = this.$root
      const r = root.router
      const aName = root.cctv.channel.list[r.idxChannel].name
      const n = (aName.match(/\d+/g) || [])[0]
      
      window.open(
        n == '14' ?
        'http://tv.cctv.com/live/cctvchild/' :
        'http://tv.cctv.com/live/cctv' + n + '/'
      )
    },
  },
  rootMethods: {
    fetchVideoInfo(elItem) {
      const script = document.createElement('script')
      script.src = 'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1513429887&vn=2049&vc=747D258B9ACE300ABA7C47B708C99495&uid=B55F93A05CDAE4A93D58FAEC106E2DF2&wlan='
      document.body.appendChild(script)
      vm.videoInfo = {
        id: elItem.id,
        title: elItem.title || elItem.desc,
        site: elItem.site,
      }
      script.onload = () => {
        document.body.removeChild(script)
      }
    },
    fetchVideoList() {
      const root = this.$root
      const r = root.router
      const curAlbum = root.cctv.channel.list[r.idxChannel].children[r.idxAlbum]
      const searchText = (r.searchText || '').trim()
      const xid = vm.xid = Math.random()

      root.cctv.video.list = []
      root.is.loading = true

      clearTimeout(root.timerFetchVideoList)
      root.timerFetchVideoList = setTimeout(() => {
        if (searchText) {
          fetchBySearch()
        } else {
          fetchByAlbum()
        }

        function fetchBySearch() {
          root.get('api/api.php', {
            a: 'get',
            url: 'https://search.cctv.com/ifsearch.php?page=' + r.page.cur + '&qtext=' + searchText + '&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=1&qtext_str=' + searchText
          }, (dataOrigin) => {
            const data = dataOrigin.list

            root.cctv.video.list = data.map((item) => {
              const id = item.imglink.substring(item.imglink.lastIndexOf('/') + 1).replace(/(-|_)[^-_]*$/, '')
              return {
                id,
                // title: item.all_title,
                desc: item.all_title,
                img: item.imglink,
                site: item.urllink,
              }
            })

            r.page.size = 20
            r.page.total = dataOrigin.total
            root.is.loading = false
            root.lazyLoad()
          })
        }

        function fetchByAlbum() {
          root.jsonp('http://api.cntv.cn/lanmu/videolistByColumnId', {
            'id': curAlbum.id,
            'n': r.page.size,
            'p': r.page.cur,
            'of': 'fdate',
            'type': '0',
            'serviceId': 'tvcctv',
            '?': 'cb',
          }, (dataOrigin) => {
            if (xid !== vm.xid) return

            let data = []
          
            dataOrigin.response = dataOrigin.response || {}
            dataOrigin.response.docs = dataOrigin.response.docs || []
            dataOrigin.response.numFound = dataOrigin.response.numFound || 0
            data = dataOrigin.response.docs

            root.cctv.video.list = data.map((item) => {
              return {
                id: item.videoSharedCode,
                title: item.videoTitle,
                desc: item.videoBrief,
                img: item.videoKeyFrameUrl || item.videoKeyFrameUrl2 || item.videoKeyFrameUrl3,
                site: item.videoUrl,
              }
            })

            r.page.size = 100
            r.page.total = curAlbum.n = dataOrigin.response.numFound
            root.is.loading = false
            root.lazyLoad()
          })
        }
      }, 200)
    },
    setVideoListItemWidth() {
      const root = this.$root
      const r = root.router
      let nodeStyleVideoWidth = document.getElementById('nodeStyleVideoWidth')
      
      if (!nodeStyleVideoWidth) {
        nodeStyleVideoWidth = document.createElement('style')
        nodeStyleVideoWidth.id = 'nodeStyleVideoWidth'
        document.body.appendChild(nodeStyleVideoWidth)
      }

      nodeStyleVideoWidth.innerHTML = '.cctv .box-main .list-video ul li {width: ' + (100 / Math.ceil((window.innerWidth - 350) / 240)) + '% !important;}'
    },
    fetchChannelFromCCTV(cb) {
      const root = this.$root
      const mapChannel = {}
      let result = []
      let page = 0

      function loopGet() {
        root.jsonp('http://api.cntv.cn/lanmu/columnSearch', {
          'p': ++page,
          'n': '200',
          'serviceId': 'tvcctv',
          't': 'jsonp',
          '?': 'cb',
        }, (dataOrigin = {}) => {
          const data = (dataOrigin.response || {}).docs || []

          result = result.concat(data.map((item) => {
            return {
              id: item.column_topicid,
              name: item.column_name,
              cName: item.channel_name,
            }
          }))

          if (data.length < 100) {
            result.forEach((item, idx, arr) => {
              const cName = item.cName
              const channel = mapChannel[cName] = mapChannel[cName] || []

              channel.push({
                id: item.id,
                name: item.name,
              })
            })

            result = Object.keys(mapChannel).sort((a, b) => {
              a = (a.match(/\d+/) || [])[0] || 0
              b = (b.match(/\d+/) || [])[0] || 0
              return a - b
            }).map((cName) => {
              return {
                name: cName,
                children: mapChannel[cName]
              }
            })

            cb && cb(result)
            console.log(JSON.stringify(result))
          } else {
            loopGet()
          }
        })
      }

      loopGet()
    },
    initChannel(cb) {
      const root = this.$root

      root.get(location.origin + '/static/cctv.json', {}, (result) => {
        result.forEach((item, idx, arr) => {
          item.children.forEach((item, idx, arr) => {
            item.n = 0
            item.children = []
          })
        })

        root.cctv.channel.list = result
        cb && cb()
      })
    }
  },
  computed: {
    listChannel() {
      return this.$root.cctv.channel.list
    },
    listAlbum() {
      const root = this.$root
      const r = root.router
      
      return (this.listChannel[r.idxChannel] || {}).children || []
    },
    curAlbum() {
      const root = this.$root
      const r = root.router
      
      return this.listAlbum[r.idxAlbum] || {
        n: 0,
        name: '',
        children: [],
      }
    },
  },
  mounted() {
    const root = this.$root
    const r = root.router

    root.is.local && setTimeout(() => {
      root.lazyLoad()
      root.setVideoListItemWidth()
      // root.fetchVideoInfo(root.cctv.video.list[0])
    }, 1000)
  }
}

window.getHtml5VideoData = function(data) {
  try {
    data = JSON.parse(data)
  } catch (e) {
    console.log('window.getHtml5VideoData 数据解析失败： ' + data)
    return
  }

  console.log(data.hls_url)
  if (data.hls_url) {
    if (vm.is.supportM3u8 || vm.is.supportHls) {
      vm.updateRouter({
        videoId: vm.videoInfo.id,
        videoTitle: vm.videoInfo.title,
        m3u8: data.hls_url,
      }, 'push')
    } else {
      // location.href = vm.videoInfo.site
      window.open(vm.videoInfo.site)
    }
  } else {
    location.href = vm.videoInfo.site
  }
}
</script>

<style lang="scss" scoped>
.cctv {
  .box-channel,
  .box-album {
    user-select: none; white-space: nowrap; overflow-x: hidden;
    border-left: 1px solid #fff;
    border-right: 1px solid #ddd;
    ul {
      margin-bottom: 50px;
      border-bottom: 1px solid #fff;
      li {
        cursor: pointer;
        &.on {
          background: rgba(0,0,0,.06);
        }
      }
    }
  }
  .box-main {
    font-size: 13px;
    & > .flex-layout {
      width: 100%; height: 100%; position: absolute; left: 0; top: 0;
      & > .auto-flex {
        background: #fff;
        .auto-scroll {padding: 12px;}
        .list-video {
          ul {
            margin: -2px;
            li {
              width: 180px; padding: 2px; overflow: hidden; float: left;
              .pt {
                padding-top: 60%; background: #eff0f0 no-repeat center / cover;
                position: relative; cursor: pointer;
                .text-box {
                  width: 100%; font-size: 12px; color: #fff;
                  position: absolute; left: 0; bottom: 0;
                  background: rgba(0,0,0,.5); padding: .1px .4em;
                  .title,
                  .desc {
                    margin: .4em 0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .box-pagination {
    min-height: 42px; border-top: 1px solid #ddd;
    ul {
      li {
        display: inline-block; padding: 0 10px;
      }
    }
  }
}
</style>
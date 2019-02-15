<template>
  <div class="cctv">
    <div class="flex-layout flex-row">
      <div class="box-channel">
        <ul>
          <li
            v-for="(item, idx) in listChannel"
            :class="['gray-title', {on: idx === $root.router.idxChannel}]"
            @click="clickChannel(item, idx)"
          >
            <a href="javascript:">{{item.name + ' (' + item.children.length + ')' }}</a>
          </li>
        </ul>
      </div>
      <div class="box-album">
        <ul>
          <li
            v-for="(item, idx) in listAlbum"
            :class="['gray-title', {on: idx === $root.router.idxAlbum}]"
            @click="clickAlbum(item, idx)"
          >
            <a href="javascript:">{{item.name + ' (' + item.n + ')' }}</a>
          </li>
        </ul>
      </div>
      <div class="box-main auto-flex">
        <div class="flex-layout">
          <div class="gray-title lmr">
            <div class="fr" v-if="!$root.router.searchText">
              <div class="btn-box">
                <button class="btn btn-xs btn-success" @click="livePlaySelf()" v-if="isLivePlaySupport">本站直播</button>
                <a :href="livePlayUrl" class="btn btn-xs btn-success" target="_blank">央视直播</a>
              </div>
            </div>
            <div class="m">
              <span v-if="$root.router.isInSearch && $root.router.searchText">搜索结果：{{$root.router.searchText}}</span>
              <span v-else>{{curAlbum.name + ' (' + curAlbum.n + ')'}}</span>
            </div>
          </div>
          <div class="auto-flex">
            <div class="auto-scroll" @scroll="$root.lazyLoad()">
              <div class="list-video">
                <template v-if="$root.router.isInSearch">
                  <template v-for="(itemOut, idx) in $root.searchResult.list">
                    <div class="search-header">{{itemOut.title}}</div>
                    <ul class="af">
                      <li v-for="(item, idx) in itemOut.list">
                        <div class="pt"
                          :lazy-load="item.img"
                          :key="item.id"
                          @click="$root.fetchVideoInfo(item, idx, itemOut.list)"
                          :style="{backgroundImage: 'url(./static/img/img-blank.png)'}"
                        >
                          <div class="text-box">
                            <div class="title" :title="item.title" v-if="item.title">{{item.title}}</div>
                            <div class="desc line-2" :title="item.desc" v-if="item.desc">{{item.desc}}</div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </template>
                  <div class="search-header">全部视频结果共{{$root.router.page.total}}条</div>
                </template>

                <div class="search-header" v-if="!$root.router.isInSearch && $root.cctv.video.list.length === 0 && !$root.is.loading">暂无相关视频</div>

                <ul class="af">
                  <li v-for="(item, idx) in $root.cctv.video.list">
                    <div class="pt"
                      :lazy-load="item.img"
                      :key="item.id"
                      @click="$root.fetchVideoInfo(item, idx, $root.cctv.video.list)"
                      :style="{backgroundImage: 'url(./static/img/img-blank.png)'}"
                    >
                      <div class="text-box">
                        <div class="title" :title="item.title" v-if="item.title">{{item.title}}</div>
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
              <div class="btn-box">
                <button class="btn btn-primary btn-xs" @click="handleShare">分享</button>
                <a class="btn btn-xs btn-success" target="_blank" 
                  v-if="$root.router.site"
                  :href="$root.router.site"
                >央视播放</a>
                <button class="btn btn-xs btn-warning"
                  @click="$root.updateRouter({m3u8: '', videoId: '', videoTitle: '', site: ''}, 'push')"
                >关闭视频</button>
              </div>
            </div>
            <div class="m">{{$root.router.videoTitle}}</div>
          </div>
          <div class="auto-flex">
            <hls-player :src="$root.router.m3u8"></hls-player>
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
    handleShare(e) {
      const root = this.$root
      const r = root.router
      const elItem = root.listVideo[r.idxVideo] || {}

      window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + root.json2url({
        pics: elItem.img,
        summary: elItem.title || elItem.desc,
        url: location.href,
        title: elItem.title || elItem.desc,
      }))
    },
    clickChannel(elItem, idx) {
      const root = this.$root
      const r = root.router

      root.updateRouter({
        idxChannel: idx,
        idxAlbum: 0,
        m3u8: '',
        searchText: '',
        videoTitle: '',
        site: '',
        isInSearch: undefined,
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
        videoTitle: '',
        site: '',
        isInSearch: undefined,
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
      'http://cctvcnch5c.v.wscdns.com/live/cctvchild_2/index.m3u8?contentid=2820180516001&uid=default' :
      'http://cctvtxyh5c.liveplay.myqcloud.com/live/cctv' + n + '_2/index.m3u8'

      root.updateRouter({
        videoId: '',
        videoTitle: '直播：' + curChannel.name,
        m3u8: videoUrl,
      }, 'push')
    },
  },
  rootMethods: {
    getVideoId(str) {
      return str.slice(str.lastIndexOf('/') + 1, str.search(/[^_-]*?$/) - 1)
    },
    fetchVideoInfo(elItem, idx, listVideo) {
      const root = this.$root
      const r = root.router

      root.is.loading = true
      root.listVideo = listVideo
      vm.videoInfo = {
        id: elItem.id,
        idx,
        title: elItem.title || elItem.desc,
        site: elItem.site,
      }

      if (/-|_/.test(elItem.id)) {
        root.get('api/interface.php', {
          a: 'get',
          url: elItem.site,
        }, (sHtml) => {
          const id = (sHtml.match(/"videoCenterId","([^"]*)"/m) || [])[1] || ''
          vm.videoInfo.id = elItem.id = id
          root.loadScript(createSrc())
        })
      } else {
        root.loadScript(createSrc())
      }

      function createSrc() {
        return 'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1513429887&vn=2049&vc=747D258B9ACE300ABA7C47B708C99495&uid=B55F93A05CDAE4A93D58FAEC106E2DF2&wlan='
      }
    },
    fetchSearchResult() {
      const root = this.$root
      const r = root.router
      const fetchSearchResultId = root.fetchSearchResultId = Math.random()
      const searchText = r.searchText.trim()

      root.is.loading = true

      if (searchText) {
        fetchSearchResult(() => {
          root.fetchVideoList()
        })
      } else {
        root.searchResult.list = []
        root.fetchVideoList()
      }

      function fetchSearchResult(cb) {
        root.get('api/interface.php', {
          a: 'get',
          url: 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(searchText) + '&type=video'
        }, async (sHtml) => {
          if (fetchSearchResultId !== root.fetchSearchResultId) return

          const arr = (sHtml.match(/<script src="[^>]*?>/g) || []).filter((item) => {
            return item.indexOf('https://r.img.cctvpic.com/so/cctv/list/') > -1
          }).map((item) => {
            return (item.match(/(?:src=")(.*?)(?:")/) || [])[1] || ''
          })

          const newList = []
          for (let i = 0; i < arr.length; i++) {
            const src = arr[i]
            await new Promise((succ) => {
              root.get('api/interface.php', {
                a: 'get',
                url: src,
              }, (sHtml) => {
                if (fetchSearchResultId !== root.fetchSearchResultId) return

                const arr = (sHtml.split('\n') || []).filter(v => v.trim()).map((str) => {
                  str = str.slice(str.indexOf('eval(\'(') + 7, str.lastIndexOf(')\');'))
                  return JSON.parse(str)
                })

                let list = (arr[1] instanceof Array ? arr[1] : arr[0].video).map((item) => {
                  item.title = decodeURIComponent(item.title)
                  return {
                    id: item.detailsid || root.getVideoId(item.imagelink),
                    // title: item.all_title,
                    desc: item.title,
                    img: item.imagelink,
                    site: item.targetpage,
                    idx: (item.title.match(/\d+/) || [])[0] || 1e8,
                  }
                }).sort((a, b) => {
                  return a.idx - b.idx
                })

                const jsonData = {
                  title: decodeURIComponent(arr[0].playlist.title),
                  list,
                }

                newList.push(jsonData)
                succ()
              })
            })
          }

          newList.forEach((item, idx, arr) => {
            item.list.forEach((item, idx, arr) => {
              if (item.id === root.router.videoId) {
                root.listVideo = arr
              }
            })
          })

          root.searchResult.list = newList
          root.lazyLoad()
          cb && cb()
        })
      }
    },
    fetchVideoList() {
      // console.warn('一会去掉')
      // return
      const root = this.$root
      const r = root.router
      const curAlbum = root.cctv.channel.list[r.idxChannel].children[r.idxAlbum]
      const searchText = (r.searchText || '').trim()
      const xid = vm.xid = Math.random()

      root.is.loading = true

      clearTimeout(root.timerFetchVideoList)
      root.timerFetchVideoList = setTimeout(() => {
        if (searchText) {
          fetchBySearch()
        } else {
          root.searchResult.list = []
          fetchByAlbum()
        }

        function fetchBySearch() {
          root.get('api/interface.php', {
            a: 'get',
            url: 'https://search.cctv.com/ifsearch.php?page=' + r.page.cur + '&qtext=' + searchText + '&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=1&qtext_str=' + searchText
          }, (dataOrigin) => {
            const data = dataOrigin.list

            root.cctv.video.list = data.map((item) => {
              return {
                id: root.getVideoId(item.imglink),
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

      let w = window.innerWidth > 600 ?
      100 / Math.ceil((window.innerWidth - 350) / 250) : 50

      nodeStyleVideoWidth.innerHTML = '.cctv .box-main .list-video ul li {width: ' + (w) + '% !important;}'
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

      root.get(location.origin + '/static/data/cctv.json', {}, (result) => {
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
    livePlayUrl() {
      const root = this.$root
      const r = root.router
      const aName = root.cctv.channel.list[r.idxChannel].name
      const n = (aName.match(/\d+/g) || [])[0]

      return (
        n == '14' ?
        'http://tv.cctv.com/live/cctvchild/' :
        'http://tv.cctv.com/live/cctv' + n + '/'
      )
    },
    isLivePlaySupport() {
      const root = this.$root
      const r = root.router
      
      if (root.is.supportM3u8) return true

      return this.curChannel.name !== 'CCTV-14 少儿'
    },
    listChannel() {
      return this.$root.cctv.channel.list
    },
    listAlbum() {
      const root = this.$root
      const r = root.router
      
      return (this.listChannel[r.idxChannel] || {}).children || []
    },
    curChannel() {
      const root = this.$root
      const r = root.router

      return this.listChannel[r.idxChannel] || {}
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
  }
}

window.getHtml5VideoData = function(data) {
  const root = window.vm

  root.is.loading = false

  try {
    data = JSON.parse(data)
  } catch (e) {
    console.log('window.getHtml5VideoData 数据解析失败： ' + data)
    return
  }

  if (data.hls_url && (root.is.supportM3u8 || root.is.supportHls)) {
    root.updateRouter({
      idxVideo: root.videoInfo.idx,
      videoId: root.videoInfo.id,
      videoTitle: root.videoInfo.title,
      m3u8: data.hls_url,
      site: root.videoInfo.site,
    }, 'push')
    return
  }
  window.open(root.videoInfo.site)
}
</script>

<style lang="scss" scoped>
@media (max-width: 650px) {
  .cctv {
    & > .flex-row {
      flex-direction: column; 
      .box-channel,
      .box-album {
        overflow-x: auto; overflow-y: hidden;
        ul {
          margin-bottom: 0; white-space: nowrap;
          li {
            display: inline-block; vertical-align: top; overflow: hidden;
            border: none;
          }
          li.on {color: #337ab7;}
        }
      }
      .box-main {
        .gray-title {
          border: none;
        }
      }
    }
  }
}

@media (min-width: 650px) {
  .cctv {
    .box-channel,
    .box-album {
      border-left: 1px solid #fff;
      border-right: 1px solid #ddd;
      ul {
        border-bottom: 1px solid #fff;
        margin-bottom: 50px;
        li.on {background: rgba(0,0,0,.07);}
      }
    }
  }
}

.cctv {
  .box-channel,
  .box-album {
    background: #eee;
    user-select: none; white-space: nowrap; overflow-x: hidden;
    ul {
      border-bottom: 1px solid #fff;
      li {
        cursor: pointer;
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
          .search-header {
            margin: 20px 0 10px 0;
            font-weight: bold;
            &:first-child {margin-top: 0;}
          }
          ul {
            margin: -2px; clear: both;
            li {
              width: 180px; padding: 2px; overflow: hidden; float: left;
              .pt {
                padding-top: 60%;
                position: relative; cursor: pointer;
                background: #eff0f0 no-repeat center / 15% auto;
                .text-box {
                  width: 100%; font-size: 12px; color: #fff;
                  position: absolute; left: 0; bottom: 0;
                  padding: .1px .4em;
                  background: rgba(0,0,0,.5);
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
    min-height: 42px; border-top: 1px solid #ddd; overflow: auto;
    background: #eee;
    ul {
      li {
        display: inline-block; padding: 0 10px;
      }
    }
  }
}
</style>
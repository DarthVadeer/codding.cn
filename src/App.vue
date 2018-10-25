<template>
  <div id="app">
    <div class="main-wrap flex-layout">
      <div class="topbar">
        <div class="fl">
          <div class="logo">
            <span class="text-bigger">Codding.cn</span>
          </div>
        </div>
      </div>
      <div class="auto-flex">
        <div class="auto-scroll flex-layout cctv">
          <div class="channel">
            <ul>
              <li
                v-for="(item, idx) in $root.channel.list"
                :key="item.name + '-' + idx"
                :class="{on: item.name === $root.router.channel}"
                @click="$root.updateRouter({channel: item.name, album: item.children[0].name}, 'push')"
              >{{item.name + '(' + item.children.length + ')'}}</li>
            </ul>
          </div>
          <div class="album">
            <ul>
              <li
                v-for="(item, idx) in $root.listAlbum"
                :key="item.name + '-' + idx"
                :class="{on: item.name === $root.router.album}"
                @click="$root.updateRouter({album: item.name}, 'push')"
              >{{item.name + '(' + item.children.length + ')'}}</li>
            </ul>
          </div>
          <div class="auto-flex flex-layout">
            <div class="gray-title">
              <div class="fr">
                <span class="btn btn-xs btn-primary">sure?</span>
                <span class="btn btn-xs btn-primary">确定</span>
              </div>
              <span>{{$root.router.album}}</span>
            </div>
            <div class="auto-flex" @scroll="$root.lazyLoad">
              <div class="relative af">
                <ul class="list-card">
                  <li
                    v-for="(item, idx) in $root.videos"
                    :key="item.title + '-' + idx"
                    @click="$root.getVideoUrl(idx)"
                  >
                    <div class="pt" :lazy-load="item.img">
                      <div class="text-box">
                        <div class="title ellipsis" :title="item.title">{{item.title}}</div>
                        <div class="desc line-2" :title="item.desc">{{item.time | date}} {{item.desc}}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="pagination-box c" 
              v-if="$root.page.total > 0"
            >
              <pagin
                :page="$root.page"
                @updatePage="page => $root.updateRouter({page})"
                @updatePageSize="pageSize => $root.updateRouter({pageSize})"
              ></pagin>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  rootData() {
    return {}
  },
  rootMethods: {
    fetchChannel(cb) {
      const root = this.$root
      const r = root.router
      let result
      let map = {}
      let page = 0
      
      try {
        result = JSON.parse(localStorage.channels)
      } catch (e) {
        console.warn('channel 加载新数据')
      }

      if (result) {
        cb && cb(result)
        console.warn('channel 在缓存中读取数据成功')
        return
      }

      function loop() {
        root.jsonp('http://api.cntv.cn/lanmu/columnSearch', {
          'p': ++page,
          'n': '200',
          'serviceId': 'tvcctv',
          't': 'jsonp',
        }, 'cb', (data) => {
          data = ((data.response || {}).docs || [])
          data.forEach((v) => {
            const o = map[v.channel_name] = map[v.channel_name] || []
            o.push({
              id: v.column_topicid,
              name: v.column_name,
              children: [],
            })
          })

          if (data.length < 100) {
            localStorage.channels = JSON.stringify(map)
            cb && cb(map)
          } else {
            loop()
          }
        })
      }

      loop()
    },
    fetchVideos(cb) {
      const root = this.$root
      const r = root.router
      const channel = root.channel
      const album = channel.mapAlbum[r.album]
      let page = 0
      
      if (album.children.length > 0) {
        console.log('videos已经缓存过了，不请求新数据')
        return
      }

      function loop() {
        root.jsonp('http://api.cntv.cn/lanmu/videolistByColumnId', {
          id: album.id,
          n: '200',
          of: 'fdate',
          p: ++page,
          type: '0',
          serviceId: 'tvcctv',
        }, 'cb', (data) => {
          data = ((data || {}).response || {}).docs || []
          data = data.map((v) => {
            return {
              id: (v.videoSharedCode || '').trim(),
              title: ((v.videoTitle || '').replace(/《.*》/g, '').replace(/(\s+)?\d{8}(\s+)?(\d{2}:\d{2})?(\s+)?/, '') || v.videoTitle).trim(),
              desc: ((v.videoBrief || '').replace(root.reDelBlank, ' ').replace('本期节目主要内容：', '')).trim(),
              img: (v.videoKeyFrameUrl || v.videoKeyFrameUrl2 || v.videoKeyFrameUrl3 || '').trim(),
              time: parseInt(v.videoProductiontime || v.videoLastmodifyDate || v.videoFocusDate || ''),
            }
          })

          album.children = album.children.concat(data)

          if (data.length < 100 || album.name === '新闻联播') {
            console.log('保存数据到localStorage', album.name)
            try {
              localStorage.channels = JSON.stringify(channel.map)
            } catch (e) {
              localStorage.clear()
              location.reload()
            }
          } else {
            loop()
          }
        })
      }

      loop()
    },
    getVideoUrl(videoIndex) {
      const root = this.$root
      const script = document.createElement('script')
      const elItem = root.videos[videoIndex]

      if (!elItem) {
        console.log('no video', videoIndex)
        return
      }

      root.updateRouter({
        videoIndex,
        videoTitle: elItem.name,
      })
      script.src = 'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1513429887&vn=2049&vc=747D258B9ACE300ABA7C47B708C99495&uid=B55F93A05CDAE4A93D58FAEC106E2DF2&wlan='
      script.onload = function() {
        document.body.removeChild(script)
      }
      document.body.appendChild(script)
    },
  },
  mounted() {
    const root = this.$root
    const r = root.router
    
    root.fetchChannel((mapChannel) => {
      let mapAlbum = {}
      let listAlbum = []

      root.channel.list = Object.keys(mapChannel).map((nameAlbum) => {
        const v = mapChannel[nameAlbum]
        listAlbum = listAlbum.concat(v)
        v.forEach(v => mapAlbum[v.name] = v)

        return {
          idx: parseInt(nameAlbum.match(/\d+/)),
          name: nameAlbum,
        }
      }).sort((a, b) => {
        return a.idx - b.idx
      }).map((v) => {
        v.children = mapChannel[v.name]
        return v
      })

      root.channel.map = mapChannel
      root.channel.mapAlbum = mapAlbum
      root.channel.listAlbum = listAlbum
      root.routerInit()
    })

    window.addEventListener('resize', root.lazyLoad.bind(root))
  }
}

const nodeStyle = document.createElement('style')
nodeStyle.innerHTML = new Array(15).fill().map((_, idx) => {
  let w, per

  w = idx * (idx < 5 ? 200 : 280)
  per = parseInt(100000 / (idx + 1)) / 1000

  return `
    @media (min-width: ${w}px) {
      .list-card li {width: ${per}%;}
    }
  `
}).join('')
document.body.appendChild(nodeStyle)

</script>

<style lang="scss" scoped="">
$border-color: rgba(0,0,0,.1);

@mixin gray-title {
  height: 32px; line-height: 1.2em; padding: 8px 12px; border-bottom: 1px solid $border-color; border-top: 1px solid rgba(255,255,255,.5); user-select: none;
}

.gray-title {
  @include gray-title(); background: #f3f6f9;
  .fr {
    .btn {
      vertical-align: top; top: -4px;
    }
  }
}

.list-card {
  padding: 4px; user-select: none; margin-bottom: 0;
  &:after {
    content: ""; display: block; clear: both;
  }
  li {
    float: left; padding: 1px;
    .pt {
      padding-top: 60%; background: #e3e6e9 no-repeat center / cover; position: relative; cursor: pointer;
      .text-box {
        width: 100%; position: absolute; left: 0; bottom: 0; background: rgba(0,0,0,.5); color: #fff; padding: .4em .4em; font-size: 12px;
        .desc {margin-top: .3em;}
      }
    }
  }
}

#app {
  height: 100%;
  .main-wrap {
    height: 100%; position: relative; font-size: 13px;
    .topbar {
      height: 50px; line-height: 48px; background: #333840; color: #a0b0c0; padding: 0 12px; user-select: none;
    }
    .cctv {
      flex-direction: row;
      .channel,
      .album {
        background: #f3f6f9; border-right: 1px solid $border-color; overflow-y: auto; overflow-x: hidden; user-select: none; padding-bottom: 50px;
        
        ul {
          li {
            white-space: nowrap;
            cursor: pointer;
            @include gray-title();
            &.on {
              background: rgba(0,0,0,.05);
            }
          }
        }
      }
      .channel {
        min-width: 150px;
      }
      .album {
        min-width: 160px;
      }
    }

    .pagination-box {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
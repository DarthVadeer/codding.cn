<template>
  <div class="abs flex-layout cctv">
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
    <div class="auto-flex">
      <div class="abs flex-layout">
        <div class="gray-title lmr">
          <div class="fr">
            <a
              class="btn btn-success btn-xs"
              :href="'http://tv.cctv.com/live/cctv' + $root.channelIndex + '/'"
              target="_blank"
            >官网直播</a>
            <span class="btn btn-info btn-xs"
              v-if="$root.is.supportM3u8"
              @click="$root.updateRouter({videoTitle: $root.router.channel, m3u8: $root.liveUrl}, 'push')"
            >本站直播</span>
          </div>
          <div class="ellipsis">
            <span>{{$root.router.album}}</span>
          </div>
        </div>
        <div class="auto-flex white-bg" @scroll="$root.lazyLoad">
          <div class="relative af">
            <ul class="list-card">
              <li
                v-for="(item, idx) in $root.videos"
                :key="item.id + '-' + idx"
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

          <no-data :is-show="$root.page.total === 0 && !$root.channel.isLoading"></no-data>
          <loading-abs :is-show="$root.page.total === 0 && $root.channel.isLoading"></loading-abs>
        </div>
        <div class="pagination-box c" v-if="$root.page.total > 0">
          <pagin :page="$root.page"></pagin>
        </div>
      </div>

      <div class="abs flex-layout" v-if="$root.router.m3u8">
        <div class="gray-title">
          <div class="fr">
            <span class="btn btn-info btn-xs"
              @click="$root.getVideoUrl($root.router.videoIndex - 1)"
              v-if="($root.page.page - 1) * $root.page.size + $root.router.videoIndex > 0"
            >播左</span>
            <span class="btn btn-info btn-xs"
              @click="$root.getVideoUrl($root.router.videoIndex + 1)"
              v-if="($root.page.page - 1) * $root.page.size + $root.router.videoIndex < $root.page.total - 1"
            >播右</span>
            <span class="btn btn-warning btn-xs"
              @click="$root.clearVideoInfoOnRouter('push')"
            >关闭视频</span>
          </div>
          <div class="ellipsis">
            <span>{{$root.router.videoTitle}}</span>
          </div>
        </div>
        <div class="auto-flex">
          <player></player>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import player from '@/components/player'

export default {
  name: 'cctv',
  rootData() {
    return {
      ...player.rootData.call(this.$root)
    }
  },
  rootMethods: {
    ...player.rootMethods,
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
        // console.warn('channel 在缓存中读取数据成功')
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

      channel.isLoading = true
      
      if (album.children.length > 0) {
        // console.log('videos已经缓存过了，不请求新数据')
        channel.isLoading = false
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
              title: ((v.videoTitle || '').replace(/《.*》/g, '').replace(/\d{8}/, '').replace(/\d{2}:\d{2}/, '').replace(/\s+/g, ' ').trim() || v.videoTitle).trim(),
              desc: ((v.videoBrief || '').replace(/(《.*?》)/g, '').replace('本期节目主要内容：', '').replace(/\s+/g, ' ')).trim(),
              img: (v.videoKeyFrameUrl || v.videoKeyFrameUrl2 || v.videoKeyFrameUrl3 || '').trim(),
              time: parseInt(v.videoProductiontime || v.videoLastmodifyDate || v.videoFocusDate || ''),
            }
          })

          album.children = album.children.concat(data)

          if (data.length < 100 || album.name === '新闻联播') {
            // console.log('保存数据到localStorage', album.name)
            const jsonNoRepeat = {}

            // 通过shareCode去重
            for (let i = 0; i < album.children.length; i++) {
              const item = album.children[i]

              if (jsonNoRepeat[item.title]) {
                album.children.splice(i, 1)
                i--
              }
              jsonNoRepeat[item.title] = jsonNoRepeat[item.title] || 0
              jsonNoRepeat[item.title]++
            }

            channel.isLoading = false

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
      const r = root.router
      const page = root.page
      let videos = root.videos

      if (videoIndex > -1 && videoIndex < videos.length) {
        // 正常区间
      } else {
        if (videoIndex < 0) {
          if (page.page > 1) {
            page.page--
            videos = root.videos
            videoIndex = videos.length - 1
          }
        } else {
          page.page++
          videos = root.videos
          videoIndex = 0
        }
      }

      const script = document.createElement('script')
      const elItem = videos[videoIndex]

      if (!elItem) {
        console.log('没有可以播放的视频了')
        return
      }

      root.updateRouter({
        videoIndex,
        videoTitle: elItem.title,
      })
      script.src = 'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1513429887&vn=2049&vc=747D258B9ACE300ABA7C47B708C99495&uid=B55F93A05CDAE4A93D58FAEC106E2DF2&wlan='
      script.onload = () => {
        document.body.removeChild(script)
      }
      document.body.appendChild(script)
    },
    clearVideoInfoOnRouter(isPush) {
      const root = this.$root
      const r = root.router
      
      root.updateRouter({
        videoTitle: undefined,
        videoIndex: undefined,
        m3u8: undefined
      }, isPush)
    },
  },
  components: {
    player,
  },
  mounted() {
    const root = this.$root
    const r = root.router

    root.lazyLoad()
  }
}

const nodeStyle = document.createElement('style')
nodeStyle.innerHTML = new Array(15).fill().map((_, idx) => {
  let w, per

  w = idx * (idx < 4 ? 200 : 280)
  per = parseInt(100000 / (idx + 1)) / 1000

  return `
    @media (min-width: ${w}px) {
      .list-card li {width: ${per}%;}
    }
  `
}).join('')
document.body.appendChild(nodeStyle)
</script>

<style lang="scss" scoped>
$border-color: rgba(0,0,0,.1);

@mixin gray-title {
  height: 32px; line-height: 1.2em; padding: 8px 12px; border-bottom: 1px solid $border-color; border-top: 1px solid rgba(255,255,255,.5); user-select: none;
}

.gray-title {
  @include gray-title(); background: #f3f6f9;
  strong {vertical-align: top;}
  .fr {
    .btn {
      vertical-align: top; top: -4px;
    }
  }
}

.cctv {
  .pagination-box {
    background: #f3f6f9; border-top: 1px solid rgba(0, 0, 0, 0.1); overflow: auto;
  }
}

// 0...768 pad | mobile
@media (max-width: 768px) {
  .cctv {
    .channel,
    .album {
      overflow: auto; border-bottom: 1px solid $border-color;
      ul {
        white-space: nowrap; margin: 0;
        li {
          display: inline-block; padding: .5em .5em;
          &.on {
            color: #337ab7;
          }
        }
      }
    }
  }
}

// 769...max pc
@media (min-width: 769px) {
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
}

</style>
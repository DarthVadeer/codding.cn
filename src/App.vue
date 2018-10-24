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
      <div class="auto-flex flex-layout">
        <div class="channel">
          <ul>
            <li
              v-for="(item, idx) in $root.channel.list"
              :key="item.name + '-' + idx"
              :class="{on: item.name === $root.router.channel}"
              @click="$root.updateRouter({channel: item.name, album: item.children[0].name}, 'push')"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="album">
          <ul>
            <li
              v-for="(item, idx) in $root.listAlbum"
              :key="item.name + '-' + idx"
              :class="{on: item.name === $root.router.album}"
              @click="$root.updateRouter({album: item.name}, 'push')"
            >{{item.name}}</li>
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
          <div class="auto-flex">
            <div class="relative">
              <div>
              </div>
              <ul class="list-card">
                <li
                  v-for="n in 80"
                  :key="n"
                >
                  <div class="pt">
                    <div class="text-box">
                      <div class="title">阳光灿烂的日子</div>
                      <div class="desc line-2">阳光灿烂的日子阳光灿烂的日子阳光灿烂的日子阳光灿烂的日子阳光灿烂的日子阳光灿烂的日子阳光灿烂的日子阳光灿烂的日子</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="c" style="padding: .8em 0;">pagination</div>
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
  }
}

const nodeStyle = document.createElement('style')
nodeStyle.innerHTML = new Array(15).fill().map((_, idx) => {
  let w, per

  w = idx * (idx < 5 ? 200 : 240)
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
  padding: 4px; user-select: none;
  &:after {
    content: ""; display: block; clear: both;
  }
  li {
    float: left; padding: 1px;
    .pt {
      padding-top: 60%; background: #e3e6e9; position: relative; cursor: pointer;
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
    & > .auto-flex {
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
        width: 150px;
      }
      .album {
        width: 160px;
      }
    }
  }
}
</style>
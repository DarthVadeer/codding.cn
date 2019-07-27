<template>
  <div class="get-data">
    <div class="back">
      <div class="dl-list">
        <dl v-for="(catItem, idx) in group">
          <dt>分组： {{catItem.char}}</dt>
          <dd v-for="(item, idx) in catItem.children">
            <a target="_blank" :href="item.url"
              @click.prevent="clickA(item)"
            >{{item.name}}</a>
          </dd>
        </dl>
      </div>
    </div>
    <template v-if="r.dataInfo">
      <transition name="fade">
        <div class="forward">
          <div style="text-align: center; line-height: 30px;" v-if="!sList">loading...</div>
          <div v-html="sList"
            @click.prevent="handleDeligate"
          ></div>
        </div>
      </transition>
      <transition name="fade">
        <div class="forward" v-if="steps.length > 0">
          <div style="overflow: hidden;">
            <div class="fr">
              <button class="btn btn-danger" @click="steps = []">关闭</button>
            </div>
          </div>
          <ul>
            <li style="margin-bottom: 20px;"
              v-for="(item, idx) in steps"
            >
              <div>{{item.msg}}</div>
              <div>{{item.url}}</div>
            </li>
            <li>{{isDiring ? '加载中...' : '结束'}}</li>
          </ul>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import group from './group'

group.forEach((catItem, idx) => {
  catItem.children.forEach((item, idx) => {
    item.url = 'http://www.i-funbox.com' + item.url
  })
})

export default {
  name: 'getData',
  data() {
    return {
      group,
      sList: '',
      steps: [],
      isDiring: false,
    }
  },
  computed: {
    r() {
      return this.$root.router
    }
  },
  methods: {
    async handleDeligate(e) {
      const sign = this.sign = Math.random()
      const a = e.target.closest('a')

      this.isDiring = true

      if (!a) return

      let url = 'http://www.i-funbox.com' + a.getAttribute('href')
      let isBreak = false

      while (!isBreak && url) {
        await new Promise((next) => {
          $.get('api/get.php', {
            a: 'getStatus',
            url
          }, (header) => {
            if (sign !== this.sign) return

            switch (header.http_code) {
              case 301:
              case 302:
                // 重定向
                this.steps.push({
                  msg: header.http_code + '-重定向',
                  url: header.redirect_url,
                })
                url = header.redirect_url
                break
              case 0:
                this.steps.push({
                  msg: header.http_code + '-跳转结束',
                  url: url,
                })
                isBreak = true
                break
              default:
                isBreak = true
                break
            }

            next()
          })
        })
      }

      this.isDiring = false
    },
    clickA(elItem) {
      const vm = this.$root
      const {name, url} = elItem

      vm.updateRouter({
        dataInfo: elItem
      }, 'push')
    },
    loadUrl() {
      const vm = this.$root
      const r = vm.router
      const url = r.dataInfo.url
      const sign = this.sign = Math.random()

      $.get('api/get.php', {
        a: 'get',
        url
      }, (sHtml) => {
        if (sign !== this.sign) return
        try {
          sHtml = sHtml.slice(sHtml.indexOf('<body>') + 6, sHtml.indexOf('</body>'))
          const div = document.createElement('div')
          div.innerHTML = sHtml
          this.sList = div.getElementsByTagName('ul')[2].outerHTML
        } catch (e) {
          vm.alert('获取数据，发生错误')
          this.$delete(r, 'dataInfo')
        }
      })
    },
  },
  watch: {
    'r.dataInfo.url'(newVal) {
      this.steps = []

      if (!newVal) return

      this.loadUrl()
    }
  },
  mounted() {
    const vm = this.$root

    if (this.r.dataInfo && this.r.dataInfo.url) {
      this.loadUrl()
    }
  }
}
</script>

<style lang="scss">
.get-data {
  & > div {width: 100%; height: 100%; position: absolute; left: 0; top: 0; overflow: auto; background: #fff;}
  .dl-list {
    font-size: 16px;
    dl {
      border: 1px solid #ccc; padding: 15px 15px 10px 15px; margin: 15px;
      dt {font-weight: bold; margin-bottom: 15px;}
      dd {display: inline-block; margin: 0 10px 10px 0;}
    }
  }
  .forward {padding: 20px;}
}

.offer_card{ background:#fff; box-shadow:0 1px 6px rgba(0,0,0,0.16); border-radius:2px; margin-bottom:16px; position:relative; transition:all 0.3s cubic-bezier(.25,.8,.25,1)}
.offer_card:hover{ box-shadow:0 3px 15px rgba(0,0,0,0.16); transition: all 0.4s ease-out}
.card_box{ padding:32px 32px 32px 20px; display:block}
.promo_infor{ width:90px; height:60px; float:left; position:relative}
.promo_infor_box{ width:100%; height:100%; display:table}
.promo_infor_center{ line-height:1; display:table-cell; text-align:center; vertical-align:middle}
.promo_infor span{ display:block; vertical-align:baseline; text-transform:uppercase; color:#666}
.promo_infor span i{ font-size:0.5em; display:inline; vertical-align:top; padding-top:0.025em}
.promo_infor .icon-tags{ font-size:2.5em; color:#666; -moz-transform:rotatey(180deg);-ms-transform:rotatey(180deg); -o-transform:rotatey(180deg); -webkit-transform:rotatey(180deg); transform:rotatey(180deg)}
.offer_big_text{ font-size:1.75em; font-weight:500}
.offer_med_text{ font-size:1.75em; font-weight:500}
.offer_largest_text{ font-size:1.5em; font-weight:500}
.offer_large_text{ font-size:1.25em; font-weight:500}
.offer_lesser_text{ font-size:1em}
.offer_smaller_text{ font-size:0.95em}
.offer_least_text{ font-size:0.85em}
</style>
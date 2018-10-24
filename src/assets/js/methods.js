export default {
  routerInit() {
    const root = this.$root
    const channel = root.channel
    let r = {}

    try {
      r = JSON.parse(decodeURIComponent(location.hash.substring(1)))
    } catch (e) {
      console.warn('hash parse err')
    }

    r.channel = r.channel || channel.list[0].name
    r.album = r.album || ((channel.map[r.channel] || [])[0] || {}).name
    root.router = r
  },
  updateRouter(o, isRouterPush) {
    const root = this.$root

    root.isRouterPush = isRouterPush
    
    for (let key in o) {
      root.$set(root.router, key, o[key])
    }
  },
  json2url(o) {
    return Object.keys(o).map(k => k + '=' + encodeURIComponent(o[k])).join('&')
  },
  jsonp(url, data, cbName, succ, fail) {
    const root = this.$root
    const script = document.createElement('script')

    data[cbName] = ('jsonp_' + Math.random()).replace('0.', '')

    window[data[cbName]] = (data) => {
      succ && succ(data)
      document.body.removeChild(script)
    }

    script.onerror = (e) => {
      fail && fail(e)
    }

    script.src = url + '?' + root.json2url(data)
    document.body.appendChild(script)
  },
  fetchChannel(cb) {
    const root = this.$root
    const r = root.router
    let map = {}
    let page = 0
    
    try {
      cb(JSON.parse(localStorage.channel))
      console.warn('channel 在缓存中读取数据成功')
      return
    } catch (e) {
      console.warn('channel 加载新数据')
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

        if (data.length < 100 || r.channel === '新闻联播') {
          localStorage.channel = JSON.stringify(map)
          cb && cb(map)
        } else {
          loop()
        }
      })
    }

    loop()
  }
}
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

    r.coms = r.coms || ['algo']
    r.countAni = r.countAni || 0
    r.channel = r.channel || channel.list[0].name
    r.album = r.album || ((channel.map[r.channel] || [])[0] || {}).name
    r.page = r.page || 1
    r.pageSize = r.pageSize || 50
    r.searchText = r.searchText || ''
    root.router = r
  },
  updateRouter(o, isRouterPush) {
    const root = this.$root

    root.isRouterPush = isRouterPush
    
    for (let key in o) {
      root.$set(root.router, key, o[key])
    }
  },
  rand(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m)
  },
  log(o) {
    console.log(o)
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
  lazyLoad() {
    const root = this.$root
    const r = root.router
    const dh = window.innerHeight
    
    clearTimeout(root.timerLazyLoad)
    root.timerLazyLoad = setTimeout(() => {
      ;[].slice.call(document.querySelectorAll('[lazy-load]')).forEach((node) => {
        const pos = node.getBoundingClientRect()

        if (pos.top > dh || pos.bottom < 0) return

        node.style.backgroundImage = 'url('+node.getAttribute('lazy-load')+')'
        node.removeAttribute('lazy-load')
      })
    }, 150)
  },
  get(url, data, succ, fail) {
    const root = this.$root
    const xhr = new XMLHttpRequest()
    const sData = root.json2url(data)
    xhr.open('GET', url + (sData ? '?' + sData : sData), true)
    xhr.send()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          succ && succ.call(root, xhr.responseText)
        } else {
          fail && fail.call(root, e)
        }
      }
    }
  }
}
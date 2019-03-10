import Hls from 'hls.js'
import Vue from 'vue'

!location.origin && (location.origin = location.href.split('/').filter(function(_, idx, arr) {
  return idx < 3
}).join('/'))

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

!Array.prototype.fill && (Array.prototype.fill = function(fillBy, start, end) {
  start = start === undefined ? 0 : start
  end = end === undefined ? this.length : end

  for (let i = 0; i < end; i++) {
    this[i] = fillBy
  }

  return this
})

Vue.filter('date', (time, format) => {
  return new Date(time).format('y-m-d')
})

String.prototype.fill = function() {
  return this.length < 2 ? '0' + this : this
}

Date.prototype.format = function(format) {
  const o = {
    y: (this.getFullYear()).toString().fill(),
    m: (this.getMonth() + 1).toString().fill(),
    d: (this.getDate()).toString().fill(),
    h: (this.getHours()).toString().fill(),
    i: (this.getMinutes()).toString().fill(),
    s: (this.getSeconds()).toString().fill(),
  }

  return (format || 'y-m-d h:i:s').replace(/y|m|d|h|i|s/g, (str) => {
    return o[str]
  })
}

window.rand = function(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m)
}

export default {
  rootData() {
    const root = this.$root
    const isLocal = ['808', 'localhost'].some(v => location.origin.indexOf(v) > -1)
    const ua = navigator.userAgent
    const isWin = ua.indexOf('Windows NT') > -1
    const isMac = ua.indexOf('Mac OS X') > -1
    const isIos = ua.indexOf('like Mac OS X') > -1
    const isAndroid = ua.indexOf('Android') > -1
    const isMobile = isIos || isAndroid
    const baseUrl = isLocal ? 'http://192.168.1.109/' : '/'

    let isChrome = ua.indexOf('Chrome/') > -1
    let isSafari = ua.indexOf('Safari/') > -1
    let isEdge = ua.indexOf('Edge/') > -1
    let isFireFox = ua.indexOf('Firefox/') > -1

    isChrome = isChrome && !isEdge
    isSafari = isSafari && !isChrome && !isEdge

    let mapPlayTime = {}
    try {
      mapPlayTime = JSON.parse(localStorage.mapPlayTime)
    } catch (e) {
      console.log('localStorage.mapPlayTime parse err')
    }

    return {
      lenAni: 30,
      baseUrl,
      alertData: {
        isShow: 0,
        msg: 'Hello Again'
      },
      is: {
        win: isWin,
        mac: isMac,
        ios: isIos,
        chrome: isChrome,
        safari: isSafari,
        edge: isEdge,
        fireFox: isFireFox,
        android: isAndroid,
        mobile: isMobile,
        local: isLocal,
        loading: true,
        supportM3u8: !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl'),
        supportHls: Hls.isSupported(),
      },
      mapPlayTime,
      keyMap: {
        '13': 'enter',
        '27': 'esc',
        '32': 'space',
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down',
      },
      urlSearchData: {},
      router: {
        // idxChannel: 0,
        // idxAlbum: 0,
        coms: [],
        page: {
          cur: 0,
          size: 0,
          total: 0,
        },
        videoTitle: '',
        searchText: '',
      },
    }
  }
}
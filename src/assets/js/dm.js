import Hls from 'hls.js'

export default {
  rootData() {
    const isLocal = location.origin.search(/:412|:300/) > -1
    const ua = navigator.userAgent
    const isIos = ua.indexOf('iPhone; CPU iPhone OS') > -1
    const isIpad = ua.indexOf('iPad; CPU OS') > -1
    const isAndroid = ua.indexOf('Linux; Android') > -1
    const isWindows = ua.indexOf('Windows NT') > -1
    const isChrome = navigator.vendor === 'Google Inc.'
    let mapPlayTime

    try {
      mapPlayTime = JSON.parse(localStorage.mapPlayTime)
    } catch (e) {
      mapPlayTime = {}
    }

    return {
      lenAni: 30,
      dw: window.innerWidth,
      dh: window.innerHeight,
      baseUrl: isLocal ? 'http://10.0.1.2/final-app/' : '/',
      algoTimeDelay: 50,
      mapPlayTime,
      search: {},
      router: {},
      is: {
        local: isLocal,
        ios: isIos,
        ipad: isIpad,
        android: isAndroid,
        windows: isWindows,
        loading: true,
        chrome: isChrome,
        supportM3u8: !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl'),
        supportHls: Hls.isSupported(),
      },
      alertData: {
        isShow: false,
        msg: 'Hello',
      },
      confirmData: {
        isShow: false,
        msg: 'Hello',
      },
      keyMap: {
        '8': 'backspace',
        '13': 'enter',
        '27': 'esc',
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down',
        '46': 'delete',
        '65': 'a', '66': 'b', '67': 'c', '68': 'd', '69': 'e',
        '70': 'f', '71': 'g', '72': 'h', '73': 'i', '74': 'j',
        '75': 'k', '76': 'l', '77': 'm', '78': 'n', '79': 'o',
        '80': 'p', '81': 'q', '82': 'r', '83': 's', '84': 't',
        '85': 'u', '86': 'v', '87': 'w', '88': 'x', '89': 'y',
        '90': 'z', 
        '113': 'f2',
      },
    }
  },
  rootMethods: {
    log() {
      window['console'].log(arguments)
    },
    getFileName(path) {
      return (path.split(/\\|\//) || []).last() || ''
    },
    getFilePureName(path) {
      const fileName = this.getFileName(path)
      return (
        fileName.indexOf('.') > -1 ?
        fileName.slice(0, fileName.lastIndexOf('.')) : ''
      )
    },
    getFileType(path) {
      const fileName = this.getFileName(path)
      return (
        fileName.indexOf('.') > -1 ?
        fileName.slice(fileName.lastIndexOf('.') + 1) : ''
      )
    },
    playM3u8() {
      const vm = this.$root
      const r = vm.router
      const videoUrl = r.videoInfo.m3u8
      
      vm.$nextTick(() => {
        const video = document.getElementById('videoPlayer')
        const isSupportM3u8 = vm.is.supportM3u8

        if (!video) {
          window['console'].warn('no video')
          return
        }

        if (isSupportM3u8) {
          video.src = videoUrl
          !vm.is.local && video.play()
        } else if(Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(videoUrl)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            !vm.is.local && video.play()
          })
        } else {
          vm.alert('当前设备不能播放m3u8')
        }

        video.oncanplay = () => {
          video.currentTime = vm.mapPlayTime[r.videoInfo.m3u8] || 0
          video.oncanplay = null
        }
      })
    },
    alert(msg) {
      const vm = this
      vm.alertData.isShow = true
      vm.alertData.msg = msg
    },
    confirm(msg, cb) {
      const vm = this
      vm.confirmData.isShow = true
      vm.confirmData.msg = msg
      vm.cbConfirm = cb
    },
    initEvents() {
      const vm = this

      function handleResize() {
        vm.dw = window.innerWidth
        vm.dh = window.innerHeight
        vm.lazyLoad()
      }

      window.addEventListener('popstate', vm.initRouter.bind(vm), false)
      window.addEventListener('resize', handleResize, false)
      window.addEventListener('orientationchange', handleResize, false)
      setTimeout(vm.lazyLoad.bind(vm), 1000)

      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'y':
              history.forward()
              break
            case 'z':
              history.back()
              break
          }
        } else {
          switch (vm.keyMap[e.keyCode]) {
            case 'esc':
              vm.alertData.isShow = false
              vm.confirmData.isShow = false
              break
          }
        }
      }, false)
    },
  },
}

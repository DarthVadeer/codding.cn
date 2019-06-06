import Hls from 'hls.js'

export default {
  rootData() {
    const ua = navigator.userAgent
    const isLocal = location.port.indexOf('683') > -1
    const isIos = ua.indexOf('like Mac OS X') > -1
    const isAndroid = ua.indexOf('Android') > -1
    const isWin = ua.indexOf('Windows NT') > -1
    let mapPlayTime = {}

    try {
      mapPlayTime = JSON.parse(localStorage.mapPlayTime)
    } catch (e) {}

    return {
      localUrl: 'http://10.0.1.4/codding/',
      dw: window.innerWidth,
      dh: window.innerHeight,
      lenAni: 30,
      mapPlayTime,
      is: {
        local: isLocal,
        loading: true,
        ios: isIos,
        android: isAndroid,
        win: isWin,
        supportM3u8: !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl'),
        supportHls: Hls.isSupported(),
      },
      mapIcon: {
        'jpg': 'img',
        'jpeg': 'img',
        'png': 'img',
        'gif': 'img',
      },
      searchData: {},
      router: {
        coms: [],
        idxChannel: 0,
        idxAlbum: 0,
        playDirection: '0',
        searchText: '',
        videoInfo: {
          id: '',
          pic: '',
          title: '',
          site: '',
          m3u8: '',
        },
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
      console.log(arguments)
    },
    clone(o) {
      return JSON.parse(JSON.stringify(o))
    },
    getFileName(path) {
      return (path.split(/\\|\//) || []).last()
    },
    getFilePureName(path) {
      const fileName = this.getFileName(path)
      return fileName.indexOf('.') > -1 ? fileName.slice(0, fileName.lastIndexOf('.')) : ''
    },
    getFileType(path) {
      const fileName = this.getFileName(path)
      return fileName.indexOf('.') > -1 ? fileName.slice(fileName.lastIndexOf('.') + 1) : ''
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

    getFileFromDataTransfer(dataTransfer, cb) {
      if (dataTransfer.files.length === 0) {
        return []
      }
      let timerRead = 0
      let files = []
      function singleRead(entry) {
        if (entry.isFile) {
          entry.file(function(file) {
            file.fullPath = entry.fullPath
            files.push(file)
            timerRead && clearTimeout(timerRead)
            timerRead = setTimeout(function() {
              cb && cb(files)
            }, 100)
          })
        } else if (entry.isDirectory) {
          entry.createReader().readEntries(function(entries) {
            Array.prototype.slice.call(entries).forEach(singleRead)
          })
        }
      }
      Array.prototype.slice.call(dataTransfer.items).forEach(function(item) {
        if (item.kind === 'file') {
          singleRead(item.webkitGetAsEntry())
        }
      })
    },
  }
}
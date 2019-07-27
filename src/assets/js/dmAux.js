window.d2a = function(deg) {
  return deg / 180 * Math.PI
}

window.a2d = function(angle) {
  return angle / Math.PI * 180
}

window.sleep = function(time) {
  return new Promise(next => time ? setTimeout(next, time) : next())
}

window.rand = function(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m)
}

window.rgba = function(r, g, b, a) {
  const o = {r, g, b, a}
  o.toString = () => {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }
  return o
}

window.randColor = function(a) {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 : a,
  }

  o.toString = function() {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }

  return o
}

window.clone = function(o) {
  return JSON.parse(JSON.stringify(o))
}

window.json2url = function(data) {
  return Object.keys(data).map(k => k + '=' + encodeURIComponent(data[k])).join('&')
}

Array.prototype.swap = function(a, b) {
  const t = this[a]
  this[a] = this[b]
  this[b] = t
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.remove = function(el) {
  el = new Set(el instanceof Array ? el : [el])

  for (let i = 0; i < this.length; i++) {
    if (el.has(this[i])) {
      this.splice(i, 1)
      i--
    }
  }
  
  return this
}

Array.prototype.clone = function() {
  return clone(this)
}

Array.prototype.shuffle = function() {
  for (let len = this.length, i = len - 1; i > -1; i--) {
    this.swap(i, Math.floor(Math.random() * (i + 1)))
  }
  return this
}

Array.prototype.forEachSync = async function (fn) {
  for (let i = 0, len = this.length; i < len; i++) {
    await fn(this[i], i, this)
  }
}

Array.prototype.rnd = function(len, l, r) {
  l = l === undefined ? 0 : l
  r = r === undefined ? len : r
  return new Array(len).fill().map(_ => rand(l, r))
}

Number.prototype.inRange = function(l, r) {
  return this >= l && this <= r
}

Date.prototype.format = function(format) {
  const o = {
    y: this.getFullYear(),
    m: this.getMonth() + 1,
    d: this.getDate(),
    h: this.getHours(),
    i: this.getMinutes(),
    s: this.getSeconds(),
  }

  return (format || 'y-m-d h:i:s').replace(/y|m|d|h|i|s/g, (k) => {
    const n = o[k]
    return n < 10 ? '0' + n : n
  })
}

window.$ = function(selector, context = document) {
  let nodes = []

  if (typeof selector === 'string') {
    nodes = [].slice.call(context.querySelectorAll(selector))
  } else if (selector instanceof Array) {
    nodes = selector
  } else {
    nodes = [selector]
  }

  nodes.__proto__ = $.prototype
  return nodes
}


$.ajax = function(o) {
  return new Promise((next) => {
    const xhr = new XMLHttpRequest()
    const url = vm.is.local && /\.php$/.test(o.url) ? vm.baseUrl + o.url : o.url

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        // let xhr = {status: 0}
        if (xhr.status === 200) {
          let data = xhr.responseText
          try {
            data = JSON.parse(data)
          } catch (e) {
            // console.warn(o.url, 'data parse err')
          }
          o.success && o.success(data, xhr)
        } else {
          if (!navigator.onLine) {
            vm.alert('你断网了，请保持网络畅通')
          } else if (xhr.status === 0) {
            vm.alert(vm.is.local ? '后台服务未开启' : ('你的网络不能正常访问' + location.origin + (vm.is.chrome ? '<br /> 复制下面的地址，尝试清理dns缓存 <br /> chrome://net-internals/#dns' : '')))
          } else {
            vm.alert('其他错误，错误码：' + xhr.status)
          }
          vm.is.loading = false
          o.error && o.error(xhr)
        }
      }
    }

    switch (o.method) {
      case 'GET':
        xhr.open('GET', url + '?' + json2url(o.data), true)
        xhr.send()
        break
      case 'POST':
        const fm = new FormData()
        Object.keys(o.data).forEach(key => fm.append(key, o.data[k]))
        xhr.open('GET', url + '?' + json2url(o.data), true)
        xhr.send(fm)
        break
      default:
        console.log('method not support', o.method)
        break
    }
  })
}

$.get = function(url, data, success, error) {
  return $.ajax({
    method: 'GET',
    url, data, success, error,
  })
}

$.post = function(url, data, success, error) {
  return $.ajax({
    method: 'GET',
    url, data, success, error,
  })
}

$.jsonp = function(url, data, success, error) {
  const cbName = data['?']
  const script = document.createElement('script')
  const fnName = data[cbName] = ('jsonp_' + Math.random()).replace('0.', '')

  delete data['?']

  window[fnName] = script.onerror = (data = {}) => {
    document.body.removeChild(script)
    delete window[fnName]
    const cb = data.type === 'error' ? error : success
    cb && cb(data)
  }

  script.src = url + '?' + json2url(data)
  document.body.appendChild(script)
}

$.loadScript = function(url, success, error) {
  const script = document.createElement('script')
  script.src = url
  script.onload = script.onerror = (e) => {
    const cb = e.type === 'load' ? success : error
    // e.type === 'error' && (vm.is.loading = false)
    cb && cb()
    document.body.removeChild(script)
  }
  document.body.appendChild(script)
}
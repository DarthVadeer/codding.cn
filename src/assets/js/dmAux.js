window.sleep = async function(time) {
  return new Promise((next) => {
    time ? setTimeout(() => {
      next()
    }, time) : next()
  })
}

window.rand = function(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m)
}

window.randColor = function(a) {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 : a,
  }

  return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
}

window.clone = function(o) {
  return JSON.parse(JSON.stringify(o))
}

Array.prototype.clone = function() {
  return clone(this)
}

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.swap = function(a, b) {
  const t = this[a]
  this[a] = this[b]
  this[b] = t
}

Array.prototype.rnd = function(len, rangeL, rangeR) {
  rangeL = rangeL === undefined ? 0 : rangeL
  rangeR = rangeR === undefined ? len : rangeR
  return new Array(len).fill().map(_ => rand(rangeL, rangeR))
}

!location.origin && (location.origin = location.href.split('/').filter((_, idx) => {
  return idx < 3
}).join('/'))

!Array.prototype.fill && (Array.prototype.fill = function(fillBy, from, to) {
  from = from === undefined ? 0 : from
  to = to === undefined ? this.length : to

  for (let i = from; i < to; i++) {
    this[i] = fillBy
  }

  return this
})

Number.prototype.inRange = function(a, b) {
  return this >= a && this <= b
}

Set.prototype.toArray = function() {
  const arr = []

  this.forEach((item) => {
    arr.push(item)
  })

  return arr
}

Date.prototype.format = function(format) {
  const o = {
    y: this.getFullYear(),
    m: (this.getMonth() + 1),
    d: this.getDate(),
    h: this.getHours(),
    i: this.getMinutes(),
    s: this.getSeconds(),
  }

  return (format || 'y-m-d h:i:s').replace(/y|m|d|h|i|s/g, (k) => {
    let str = o[k].toString()
    return str.length < 2 ? '0' + str : str
  })
}

String.prototype.toSize = function() {
  const map = {}
  ;['b', 'k', 'm', 'g', 't', 'p'].forEach((k, idx) => {
    map[k] = Math.pow(1024, idx)
  })
  
  return eval(this.toLowerCase().replace(/b/i, '').replace(/k|m|g|t|p/, (str) => {
    return '*' + map[str]
  }))
}

Number.prototype.toSize = function() {
  const arr = ['', 'K', 'M', 'G', 'T', 'P']

  if (this <= 1) return this + 'B'

  for (let i = arr.length - 1; i > -1; i--) {
    const size = Math.pow(1024, i)

    if (this >= size) {
      return parseFloat((this / size).toFixed(2)) + arr[i] + 'B'
    }
  }
}
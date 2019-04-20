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

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
};

Number.prototype.isInRange = function(a, b) {
  return this >= a && this <= b
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
  const map = {
    b: 1,
    k: 1024,
    m: 1048576,
    g: 1073741824,
    t: 1099511627776,
    p: 1125899906842624,
  }

  return eval(this.toLowerCase().replace('b', '').replace(/k|m|g|t|p/, (str) => {
    return '*' + map[str]
  }))
}

Number.prototype.toSize = function() {
  const arr = ['b', 'k', 'm', 'g', 't', 'p']

  if (this <= 1) return this + 'b'

  for (let i = arr.length - 1; i > -1; i--) {
    const size = Math.pow(1024, i)

    if (this > size) {
      return parseFloat((this / size).toFixed(2)) + arr[i]
    }
  }
}

window.rand = function(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m)
}

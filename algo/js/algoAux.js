window.sleep = function(time, ret) {
  return new Promise(next => time ? setTimeout(_ => next(ret), time) : next(ret))
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

window.d2a = function(deg) {
  return deg / 180 * Math.PI
}

window.a2d = function(angle) {
  return angle / Math.PI * 180
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

Array.prototype.clone = function() {
  return clone(this)
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

// !NodeList.prototype.forEach && (NodeList.prototype.forEach = function(fn) {
//   console.log('a')
//   for (let i = 0; i < this.length; i++) {
//     fn(this[i], i, this)
//   }
// })

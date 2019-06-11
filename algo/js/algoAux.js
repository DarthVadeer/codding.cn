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
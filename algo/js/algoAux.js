function sleep(time) {
  return new Promise(next => time ? setTimeout(next, time) : next())
}

function d2a(deg) {
  return deg / 180 * Math.PI
}

function a2d(angle) {
  return angle / 180 * Math.PI
}

function clone(o) {
  return JSON.parse(JSON.stringify(o))
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

window.rgba = function(r, g, b, a) {
  const o = {r, g, b, a}
  o.toString = () => {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }
  return o
}

function randColor(a, min, max) {
  min = min === undefined ? 0 : min
  max = max === undefined ? 255 : max

  const o = {
    r: rand(min, max),
    g: rand(min, max),
    b: rand(min, max),
    a: a === undefined ? 1 : a,
  }

  o.toString = () => {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }

  return o
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

Array.prototype.clone = function() {
  return clone(this)
}

Array.prototype.rnd = function(len, min, max) {
  min = min === undefined ? 0 : min
  max = max === undefined ? len : max
  return new Array(len).fill().map(_ => rand(min, max))
}

Array.prototype.shuffle = function() {
  for (let len = this.length, i = len - 1; i > -1; i--) {
    this.swap(i, ~~(Math.random() * (i + 1)))
  }
}
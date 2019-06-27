window.rand = function(l, r) {
  return Math.floor(Math.random() * (r - l + 1) + l)
}

window.randColor = function(a) {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 : a,
  }

  o.toString = () => {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }

  return o
}

window.clone = function(o) {
  return JSON.parse(JSON.stringify(o))
}

window.sleep = async function(time) {
  return new Promise(next => time ? setTimeout(next, time) : next())
}

window.d2a = (deg) => {
  return deg / 180 * Math.PI
}

window.a2d = (angle) => {
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

Array.prototype.rnd = function(len, l, r) {
  l = l === undefined ? 0 : l
  r = r === undefined ? len : r
  return new Array(len).fill().map(_ => rand(l, r))
}

Array.prototype.shuffle = function() {
  for (let len = this.length, i = len - 1; i < len; i++) {
    this.swap(i, parseInt(Math.random() * (i + 1)))
  }
  
  return this
}
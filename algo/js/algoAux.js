window.sleep = async (time) => {
  return new Promise(next => time ? setTimeout(next, time) : next())
}

window.a2d = (angle) => {
  return angle / Math.PI * 180
}

window.d2a = (deg) => {
  return deg / 180 * Math.PI
}

window.clone = (o) => {
  return JSON.parse(JSON.stringify(o))
}

window.rand = (l, r) => {
  return Math.floor(Math.random() * (r - l + 1) + l)
}

window.randColor = (a) => {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 :ａ,
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
  for (let len = this.length, i = len - 1; i > -1; i--) {
    this.swap(i, parseInt(Math.random() * (i + 1)))
  }

  return this
}

// shuffle 算法测试
/*{
  const len = 10
  const arr = new Array(len).fill(0)
  const result = new Array(len).fill(0)
  const shuffleTime = 100000

  function resetArr() {
    for (let i = 0; i < len; i++) {
      arr[i] = i < len / 2 ? 1 : 0
    }
  }

  for (let i = 0; i < shuffleTime; i++) {
    resetArr()
    arr.shuffle()

    for (let j = 0; j < len; j++) {
      result[j] += arr[j]
    }
  }

  console.log(result.map(n => n / shuffleTime))
}*/
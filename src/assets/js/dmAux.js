window.clone = function(o) {
  return JSON.parse(JSON.stringify(o))
}

window.rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

window.randColor = (a) => {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 : a
  }

  o.toString = () => {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }

  return o
}

window.sleep = (time) => {
  return time && new Promise(next => setTimeout(next, time))
}

window.d2a = (deg) => {
  return deg / 180 * Math.PI
}

window.a2d = (angle) => {
  return angle / Math.PI * 180
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
  return Array(len).fill().map(_ => rand(min, max))
}

Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i > -1; i--) {
    this.swap(i, parseInt(Math.random() * (i + 1)))
  }
  return this
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.forEachSync = async function (fn) {
  for (let i = 0, len = this.length; i < len; i++) {
    await fn(this[i], i, this)
  }
}

// test shuffle
/*{
  const len = 10
  const arr = Array(len).fill(0)
  const count = Array(len).fill(0)
  const shuffleTime = 10000

  function resetArr() {
    for (let i = 0; i < len; i++) {
      arr[i] = i < len / 2 ? 1 : 0
    }
  }

  for (let i = 0; i < shuffleTime; i++) {
    resetArr()
    arr.shuffle()
    for (let j = 0; j < len; j++) {
      count[j] += arr[j]
    }
  }

  console.log(count)
  count.forEach((n, idx) => {
    console.log(n / shuffleTime)
  })

  console.log((count.max() - count.min()) / shuffleTime)
}*/

export default {
  data() {
    const keyMap = {
      13: 'enter',
      27: 'esc',
    }

    Array(26).fill().forEach((_, idx) => {
      const keyCode = 65 + idx
      keyMap[keyCode] = String.fromCharCode(keyCode).toLowerCase()
    })

    return {
      keyMap,
      is: {
        local: location.port.indexOf('412') > -1,
      },
    }
  }
}
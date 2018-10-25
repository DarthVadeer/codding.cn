import Vue from 'vue'

Vue.filter('date', (time, format) => {
  return new Date(time).format('y-m-d')
})

String.prototype.fill = function() {
  return this.length < 2 ? '0' + this : this
}

Date.prototype.format = function(format) {
  const o = {
    y: (this.getFullYear()).toString().fill(),
    m: (this.getMonth() + 1).toString().fill(),
    d: (this.getDate()).toString().fill(),
    h: (this.getHours()).toString().fill(),
    i: (this.getMinutes()).toString().fill(),
    s: (this.getSeconds()).toString().fill(),
  }

  return (format || 'y-m-d h:i:s').replace(/y|m|d|h|i|s/g, (str) => {
    return o[str]
  })
}
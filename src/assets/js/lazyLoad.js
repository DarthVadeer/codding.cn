export default {
  lazyLoad() {
    const vm = this.$root
    let maxNum = Math.ceil(window.innerWidth / 150) *  Math.ceil(window.innerHeight / 150)

    clearTimeout(vm.timerLazyLoad)

    vm.timerLazyLoad = setTimeout(() => {
      const nodes = [].slice.call(document.querySelectorAll('[lazy-load]')).filter((node) => {
        const pos = node.getBoundingClientRect()
        return !(
          pos.top > window.innerHeight || 
          pos.bottom < 0
        )
      })

      // console.log('nodes.length', nodes.length, 'maxNum', maxNum)
      if (nodes.length > maxNum) {
        // console.log('%c too much ! ', 'color: #a00')
        return
      }

      nodes.forEach((node) => {
        const src = node.getAttribute('lazy-load')
        const img = new Image()

        node.removeAttribute('lazy-load')

        img.onload = (e) => {
          node.loaded = true
          img.onload = null
          node.nodeName.toLowerCase() === 'img' ?
          (node.src = img.src) :
          (node.style.backgroundImage = 'url(' + img.src + ')')
        }
        img.src = src
      })
    }, 240)
  }
}
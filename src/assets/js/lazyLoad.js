export default {
  lazyLoad() {
    const vm = this.$root
    const dh = window.innerHeight
    
    clearTimeout(vm.timerLazyLoad)
    vm.timerLazyLoad = setTimeout(() => {
      ;[].slice.call(document.querySelectorAll('[lazy-load]')).forEach((node) => {
        const pos = node.getBoundingClientRect()

        if (pos.top > dh || pos.bottom < 0) return

        const src = node.getAttribute('lazy-load')
        const oImg = new Image()
        oImg.src = src
        oImg.onload = () => {
          node.style.backgroundImage = 'url(' + src + ')'
        }
        node.removeAttribute('lazy-load')
      })
    }, 240)
  }
}

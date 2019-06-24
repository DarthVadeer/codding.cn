export default {
  lazyLoad() {
    const vm = this.$root

    clearTimeout(vm.timerLazyLoad)

    vm.timerLazyLoad = setTimeout(() => {
      const nodes = document.querySelectorAll('[lazy-load]')
      
      nodes.forEach((node, idx, arr) => {
        const pos = node.getBoundingClientRect()

        if (pos.top > window.innerHeight || pos.bottom < 0) return

        const src = node.getAttribute('lazy-load')
        node.style.backgroundImage = 'url(' + src + ')'
        node.removeAttribute('lazy-load')
      })
    }, 200)
  }
}
export default {
  initEvents() {
    const vm = this

    $(window).on('keydown', (e) => {
      const sKey = vm.keyMap[e.keyCode]

      if (e.ctrlKey && e.shiftKey && e.altKey) {

      } else if (e.ctrlKey && e.shiftKey) {

      } else if (e.ctrlKey && e.altKey) {

      } else if (e.shiftKey && e.altKey) {

      } else if (e.ctrlKey) {
        switch (sKey) {
          case 'y':
            history.forward()
            break
          case 'z':
            history.back()
            break
        }
      } else if (e.shiftKey) {

      } else if (e.altKey) {

      } else {

      }
    }).on('popstate', (e) => {
      vm.initRouter()
    })
  },
}
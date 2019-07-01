export default {
  com() {
    const comList = this.router.coms || []
    let com = comList[0]

    switch (com) {
      case 'x-frame':
        com = comList[1]
        break
      default:
        
        break
    }

    return com || ''
  }
}
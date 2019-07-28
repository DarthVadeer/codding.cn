export default {
  com() {
    return (this.router.coms || [])[0] || ''
  }
}
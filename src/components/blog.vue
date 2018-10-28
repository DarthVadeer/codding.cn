<template>
  <div class="blog auto-scroll white-bg">
    <div class="main">
      <div class="c">
        <img :src="'./static/img/avl.png'" alt="" style="max-width: 100%;">
      </div>
      <div class="space">
        <div>
          <span>感谢</span>
          <a href="https://www.imooc.com/t/108955" target="_blank">@liuyubobobo</a>
          <span>的支持</span>
        </div>
      </div>
      <div class="space">
        <pre>{{$root.avl}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'blog',
  rootData() {
    return {
      avl: '',
    }
  },
  rootMethods: {

  },
  mounted() {
    const root = this.$root
    const r = root.router
    
    root.get('http://codding.cn/avl/', {}, (str) => {
      root.avl = str.trim()
    })
  }
}
</script>

<style lang="scss" scoped>
.blog {
  .main {
    max-width: 800px; margin: 0 auto;
  }
}
</style>
<template>
  <div class="topbar flex">
    <div class="box-logo">
      <a href="javascript:">田小号🎺 <span class="hidden-xs">- Official</span></a>
    </div>
    <div class="auto-flex nav">
      <a href="javascript:"
        v-for="(item, idx) in nav.list"
        :class="{on: item.com === $root.com}"
        @click="$root.pushCom(item.com)"
      >{{item.name}}</a>
    </div>
    <!--  <div>
      <a href="javascript:">登录</a>
      <a href="javascript:">注册</a>
    </div -->
  </div>
</template>

<script>
export default {
  name: 'topbar',
  data() {
    return {
      nav: {
        list: [
          {name: 'CCTV', com: 'cctv'},
          {name: '算法与数据结构', com: 'algo'},
          {name: '创意空间', com: 'creative'},
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.topbar {
  background: #33373e; color: #c3c6c9; overflow: auto;
  line-height: 3.2em; white-space: nowrap; padding: 0 8px; z-index: 10;
  a {display: inline-block; padding: 0 8px;}
  a.on {color: #fff;}
  .box-logo {font-weight: bold;}
}
</style>
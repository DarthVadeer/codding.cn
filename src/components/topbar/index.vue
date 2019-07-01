<template>
  <div class="topbar flex">
    <div class="logo hidden-xs">
      <strong>
        <a tabindex="1" href="javascript:">{{$root.appName}} - Official</a>
      </strong>
    </div>
    <div class="nav auto-flex">
      <a tabindex="1" href="javascript:"
        :class="{on: item.com === $root.com}"
        :data-a="item.com + '-' + $root.com "
        v-for="(item, idx) in nav.list"
        @click="$root.pushCom(item.com)"
      >{{item.name}}</a>
    </div>
    <!-- <div class="nav">
      <a tabindex="1" href="javascript:">登录</a>
      <a tabindex="1" href="javascript:">注册</a>
    </div> -->
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
          {name: '创意空间', com: 'goal'},
          // {name: '迷宫', com: 'algo'},
          // {name: '首页', com: 'index'},
          // {name: 'WebFtp', com: 'webFtp'},
          // {name: 'DBAdmin', com: 'dbAdmin'},
          // {name: 'Talker', com: 'talker'},
          // {name: 'boboFans', com: 'boboFans'},
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.topbar {
  padding: 0 8px; background: #33373e; color: #c3c6c9; font-size: 14px;
  user-select: none; z-index: 2;
  a {display: inline-block; padding: 12px 8px;}
  a.on {color: #fff;}
  .logo {margin-right: 0;}
}
</style>
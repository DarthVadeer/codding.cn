<template>
  <div class="topbar">
    <div class="logo fl">
      <strong tabindex="1">Codding.cn</strong>
    </div>
    <div class="nav fl">
      <ul>
        <li tabindex="1" 
          v-for="(item, idx) in nav.list"
          :class="{on: item.com === $root.com}"
          @click="$root.pushCom(item.com)"
        >{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'topbar',
  data() {
    const me = this
    const vm = me.$root
    const r = vm.router
    const list = [
      {name: 'CCTV', com: 'cctv'},
      // {name: 'webFtp', com: 'webFtp'},
      // {name: 'dbAdmin', com: 'dbAdmin'},
      {name: '算法与数据结构', com: 'algo'},
    ]
    vm.is.local && list.push({
      name: 'webFtp',
      com: 'webFtp'
    })

    return {
      nav: {
        list
      }
    }
  },
  methods: {

  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router
    
    
  },
}
</script>

<style lang="scss" scoped>
.topbar {
  line-height: 3em; white-space: nowrap;
  background: #33373e; color: #c3c6c9;
  position: relative; z-index: 2;
  user-select: none;
  .logo {
    font-size: 16px;
    strong {
      display: block; padding: 0 12px; cursor: pointer;
    }
  }
  ul {
    margin-bottom: 0;
    li {
      display: inline-block; padding: 0 12px; cursor: pointer;
      &.on {color: #fff;}
    }
  }
  .nav {

  }
}
</style>
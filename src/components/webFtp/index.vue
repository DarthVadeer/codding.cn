<template>
  <div class="webFtp">
    <div class="flex-layout">
      <div class="gray-title">
        <div class="fr btn-box">
          <button class="btn btn-primary btn-xs">打开文件夹</button>
          <button class="btn btn-primary btn-xs">自动排版</button>
          <button class="btn btn-danger btn-xs">删除</button>
        </div>
        <div class="ellipsis">
          <i class="glyphicon glyphicon-info-sign" style="top: 2px;"></i>
          <span>快捷操作</span>
        </div>
      </div>
      <div class="auto-flex">
        auto-flex
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'webFtp',
  data() {
    return {}
  },
  methods: {

  },
  beforeCreate() {
    this.$root.webFtp = this
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router
    
    
  },
}
</script>
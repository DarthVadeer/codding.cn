<template>
  <div class="webFtp">
    webFtp
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
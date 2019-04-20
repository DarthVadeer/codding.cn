<template>
  <div class="dbAdmin">
    dbAdmin
  </div>
</template>

<script>
export default {
  name: 'dbAdmin',
  data() {
    return {}
  },
  methods: {

  },
  beforeCreate() {
    this.$root.dbAdmin = this
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router
    
    
  },
}
</script>
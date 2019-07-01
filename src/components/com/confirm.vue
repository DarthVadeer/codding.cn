<template>
  <transition name="fade">
    <div class="panel-notice" id="panel-confirm"
      v-if="$root.confirmData.isShow"
    >
      <div class="inner">
        <div class="box-msg" v-html="$root.confirmData.msg"></div>
        <div class="flex-row btn-box">
          <div class="_1 text-blue" tabindex="1" @click="handleConfirm">确定</div>
          <div class="_2" tabindex="1" @click="$root.confirmData.isShow = false">取消</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'confirm',
  data() {
    return {

    }
  },
  methods: {
    handleConfirm(e) {
      const vm = this.$root

      vm.confirmData.isShow = false
      vm.cbConfirm && vm.cbConfirm()
      delete vm.cbConfirm
    },
  },
}
</script>

<style lang="scss" scoped>
.confirm {

}
</style>

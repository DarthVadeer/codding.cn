<template>
  <transition name="fade">
    <div class="panel-notice" id="panel-alert"
      v-if="$root.alertData.isShow"
    >
      <div class="inner">
        <div class="box-msg" v-html="$root.alertData.msg"></div>
        <div class="flex-row btn-box">
          <div class="_1 text-blue" tabindex="1" @click="$root.alertData.isShow = false">确定</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'alert',
  data() {
    return {

    }
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.alert {

}
</style>

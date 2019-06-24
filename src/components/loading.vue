<template>
  <transition name="fade">
    <div class="loading"
      v-if="isShow"
    >
      <loading-div></loading-div>
    </div>
  </transition>
</template>

<script>
import LoadingDiv from '@/components/loadingDiv'

export default {
  name: 'loading',
  props: ['isShow'],
  data() {
    return {

    }
  },
  methods: {

  },
  components: {
    LoadingDiv,
  }
}
</script>

<style lang="scss" scoped>
.loading {

}
</style>

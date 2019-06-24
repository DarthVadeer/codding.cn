<template>
  <div
    :class="['toggle', {on: value}]"
    @click="$emit('change', !value)"
  >
    <div class="circle"></div>
  </div>
</template>

<script>
export default {
  name: 'toggle',
  data() {
    return {

    }
  },
  methods: {

  },
  props: {
    value: Boolean,
  },
  model: {
    prop: 'value',
    event: 'change',
  }
}
</script>

<style lang="scss" scoped>
.toggle {

}
</style>

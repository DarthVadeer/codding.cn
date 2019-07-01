<template>
  <div class="loading-div"
    style="transform: scale(.8)"
  >
    <ul>
      <li
        v-for="n in len"
        :style="{transform: 'rotate(' + (n * (360 / len)) + 'deg) translateY(-16px) scale(.8, 1)', backgroundColor: 'rgba(' + getColorN(n) + ',' + getColorN(n) + ',' + getColorN(n) + ',1)'}"
      ></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'loading-div',
  data() {
    return {
      len: 12
    }
  },
  methods: {
    getColorN(idx) {
      return parseInt(idx / this.len * 100 + 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-div {

}
</style>

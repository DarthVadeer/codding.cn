const fs = require('fs')
const files = [
  // 'player',
  // 'loadingDiv',
  // 'loading',
  // 'alert',
  // 'confirm',
  // 'toggle',
]

files.forEach((name, idx, arr) => {
  const path = './components/' + name + '.vue'
  console.log(path)
  fs.writeFileSync(path, 
`<template>
  <div class="${name}">
    ${name}
  </div>
</template>

<script>
export default {
  name: '${name}',
  data() {
    return {

    }
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.${name} {

}
</style>
`
  )
})
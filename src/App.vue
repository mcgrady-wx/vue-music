<template>
  <div id="app">
    hello.word!!
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus" scoped>
@import './common/stylus/variable'
#app
  color: $color-theme 

</style>

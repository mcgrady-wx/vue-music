<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view/>
    <player></player>
  </div>
</template>

<script>
import MHeader from "./components/m-header/m-header"
import tab from "./components/tab/tab"
import player from './pages/player/player'
export default {
  name: 'App',
  components:{
    MHeader,tab,player
  }
}
</script>

<style lang="stylus" scoped>

</style>

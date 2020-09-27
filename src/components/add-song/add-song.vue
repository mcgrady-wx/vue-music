<template>
    <!-- 添加歌曲组件 -->
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex='currentIndex' @switch="switchItem"></switches>
        <div class="list-wrapper">
            <scroll class="list-scroll" :data="playHistory" v-if="currentIndex===0">
                <div class="list-inner">
                    <song-list :data="playHistory" @select="selectSong"></song-list>
                </div>
            </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
       <suggest :showSinger="showSinger" :query="query" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {searchMixin} from '../../common/js/mixin'
  import SearchBox from '../search-box/search-box'
  import suggest from '../suggest/suggest'
  import switches from '../switches/switches'
  import scroll from '../scroll/scroll'
  import songList from '../song-list/song-list'
  import {mapGetters,mapActions} from 'vuex'
  import Song from '../../common/js/song'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        songs: [],
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
        ]
      }
    },
    computed: {
     ...mapGetters([
         'playHistory'
     ])
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      selectSuggest(){//点击搜索的歌曲
        this.saveSearch()//添加到历史记录
      },
      switchItem(index){//切换栏
        this.currentIndex=index
      },
      selectSong(song, index){//通过自定义函数，子元素点击传递回来的歌曲，把歌曲添加到播放列表
        if (index !== 0) {//表示不是当前播放歌曲
            this.insertSong(new Song(song))
        }
      },
      ...mapActions([
          'insertSong'
      ])
    },
    components: {
        SearchBox,
        suggest,
        switches,
        scroll,
        songList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" class="item" v-for="(song,index) in data" :key="song.id">
         <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer}}.{{song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name:'songlist',
    props: {
      data: {
        type: Array,
        default: []
      },
      rank: {//用于来表示是否显示奖杯，默认false不显示
        type: Boolean,
        default: false
      }
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      selectItem(song,index){//开启播放器
        //传入数据，歌曲列表和当前播放歌曲序号
        this.selectPlay({
          list:this.data, //歌曲列表
          index
        })
      },
      getRankCls(index) {//前三显示奖杯，后面显示数值
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index) { //显示数值
        if (index > 2) {
          return index + 1
        }
      }
    },
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
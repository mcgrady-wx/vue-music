<template>
    <!-- 播放歌曲列表组件 -->
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li :key="item.id" ref="listItem" class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex'
  import {playMode} from '../../common/js/config'
  import Scroll from '../../components/scroll/scroll'
  import Confirm from '../../components/confirm/confirm'
  import {playerMixin} from '../../common/js/mixin'//play和playlist共用的一些computed、methods，可以直接使用computed、methods中的函数
  import confirm from '../../components/confirm/confirm'
  import AddSong from '../../components/add-song/add-song'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        refreshDelay: 120 //设置scroll组件刷新时间
      }
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      },
      //引入了playerMixin，可以直接使用下面的mapGetters
      // ...mapGetters([
      //     'sequenceList',
      //     'currentSong',
      //     'playlist',
      //     'mode'
      // ])
    },
    methods: {
      show() {//显示歌曲播放列表,显示歌曲列表为sequenceList,而实际播放的列表playlist
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()//显示列表后刷新,避免第一次打开无法滚动
          this.scrollToCurrent(this.currentSong) //把当前播放歌曲放在第一个位置
        }, 20)
      },
      hide() {//关闭歌曲播放列表
        this.showFlag = false
      },
      scrollToCurrent(current) {//让当前播放歌曲在第一个位置(列表滚动到当前播放歌曲处)
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })//查找到当前播放歌曲在顺序列表中的位子
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)//滚动到下标为index的li标签处,动画300毫秒
      },
      selectItem(item,index){//点击歌曲,实现歌曲切换
        //如果是顺序播放,那么index就是下一首要播放歌曲的下标,如果是随机播放,那边下标就要在playlist里查找
        if (this.mode === playMode.random) {//表示随机播放,需要找到下标
            index=this.playlist.findIndex((song)=>{
                return item.id === song.id
            })
        }
        this.getCurrentIndex(index)//切换当前播放歌曲
        this.getPlaying(true)//实现播放
      },
      getCurrentIcon(item){//当前播放歌曲显示播放图标
        if (item.id===this.currentSong.id) {
            return 'icon-play'
        }
        return ''
      },
      deleteOne(item){//删除一首歌曲
        this.deleteSong(item)
        if (!this.playlist.length) {//防止当播放列表删除完后,重新点击一首歌曲后,播放列表会直接显示出来的BUG
        //BUG原因:在父元素上点击了歌曲列表图标,组件是显示状态,当playlist.length为0的时候整个父元素状态为hide
        //当有playlist的时候,父元素显示,且本元素showFlag为true也是显示状态,所以要设置showFlag的状态为false
          this.hide()
        }
      },
      showConfirm(){//点击弹出是否删除小窗口
        this.$refs.confirm.show()
      },
      confirmClear(){//确定删除播放列表
        this.deleteSongList()//删除歌曲列表
        this.hide()//关闭歌曲列表
      },
      addSong(){//显示添加歌曲页面
        this.$refs.addSong.show()
      },
      //引入了playerMixin，可以直接使用下面的mapMutations
      // ...mapMutations([
      //     'getCurrentIndex',
      //     'getPlaying'
      // ]),
      ...mapActions([
          'deleteSong',
          'deleteSongList'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      confirm,
      AddSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
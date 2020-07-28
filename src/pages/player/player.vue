<template>
    <div class="player" v-show="playlist.length>0">
        <!-- 大播放器 -->
        <transition name='normal' @enter="enter"  @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
          <div class="normal-player" v-show="fullScreen">
            <!-- 背景 -->
            <div class="background">
              <img width="100%" height="100%" :src="currentSong?currentSong.image:''">
            </div>
            <!-- 顶部 -->
            <div class="top">
              <div class="back" @click="back">
                <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentSong?currentSong.name:' '"></h1>
              <h2 class="subtitle" v-html="currentSong?currentSong.singer:' '"></h2>
            </div>
            <!-- 中间CD部分 -->
            <div class="middle">
              <div class="middle-l">
                <div class="cd-wrapper" ref="cdWrapper"> 
                  <div class="cd" :class="cdCls">
                    <img class="image" :src="currentSong?currentSong.image:''">
                  </div>
                </div>
              </div>
            </div>
            <!-- 按钮部分 -->
            <div class="bottom">
              <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
                </div>
                <span class="time time-r">{{currentSong?format(currentSong.duration):0}}</span>
              </div>
              <div class="operators">
                <div class="icon i-left" @click="changeMode">
                  <i :class="iconMode"></i>
                </div>
                <div class="icon i-left" :class="disableCls">
                  <i @click="prev" class="icon-prev"></i>
                </div>
                <div class="icon i-center" :class="disableCls">
                  <i :class="playIcon" @click="handleplay"></i>
                </div>
                <div class="icon i-right" :class="disableCls">
                  <i @click="next" class="icon-next"></i>
                </div>
                <div class="icon i-right">
                  <i class="icon icon-not-favorite"></i>
                </div>
              </div>  
            </div>   
          </div>
        </transition>
        <!-- 小播放器 -->
        <transition name="mini">
          <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
              <img :class="cdCls" width="40" height="40" :src="currentSong?currentSong.image:''">
            </div>
            <div class="text">
              <h2 class="name" v-html="currentSong?currentSong.name:' '"></h2>
              <p class="desc" v-html="currentSong?currentSong.singer:' '"></p>
            </div>
            <div class="control">
              <progress-circle :radius='radius' :percent="percent">
                <i class="icon-mini" :class="miniIcon" @click.stop="handleplay"></i>
              </progress-circle>
            </div>
            <div class="control">
              <i class="icon-playlist"></i>
            </div>
          </div>
        </transition>
        <!-- onplay自带事件，表示当视频或音频开始播放时候触发
        onerror自带事件，表示当视频或者音频发生错误时候触发 
        ontimeupdate自带事件，获得当前视频或者音频的播放时间
        -->
        <audio ref="audio" :src="currentSong?currentSong.url:' '" @play="ready" @error="error" @timeupdate="timeupdate"></audio>  
    </div>   
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'//过度动画第三方库
  import progressBar from '../../components/progress-bar/progress-bar.vue'
  import progressCircle from '../../components/progress-circle/progress-circle.vue'
  import { playMode } from '../../store/config'
  import { shuffle } from '../../common/js/util.js'
  
  export default {
      name:'player',
      data(){
        return {
          songReady:false, //歌曲是否准备好播放的标记
          currentTime:0, //当前播放时间
          radius: 32,//小播放按钮外圈的大小
        }
      },
      computed: {
        iconMode(){//播放模式
          return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
        },
        cdCls() {//cd是否旋转
          return this.playing ? 'play' : 'play pause'
        },
        playIcon(){//播放图标样式
          return this.playing ? 'icon-pause' : 'icon-play'
        },
        miniIcon(){//小播放图标样式
          return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        disableCls(){//歌曲是否准备好，没准备好图标显示灰色
          return this.songReady ? '' : 'disable'
        },
        percent() {//播放比例
          if(this.currentSong){
            return this.currentTime / this.currentSong.duration //currentSong.duration是歌曲总时长
          }
        },
        ...mapGetters([
          'fullScreen',
          'playlist',
          'currentSong',
          'playing',
          'currentIndex',
          'mode',
          'sequenceList'
        ])
      },
      watch: {
        currentSong(newSong,oldSong){
          if (newSong.id===oldSong.id) {
            return 
          }
          this.$nextTick(()=>{//做延时
            this.$refs.audio.play()//播放歌曲
          })
        },
        playing(newPlay){//做歌曲的暂停、播放
          this.$nextTick(()=>{//做延时
            newPlay?this.$refs.audio.play():this.$refs.audio.pause() //true播放 false暂停
          })
        },
      },
      methods: {
        changeMode(){//改变播放模式
            let mode=(this.mode+1)%3
            this.getMode(mode)
            //改变播放列表
            let list=null
            //存在问题，当切换的时候当前播放歌曲就会变化
            if (mode===playMode.random) {//随机播放
                list=shuffle(this.sequenceList)//打乱顺序播放列表
            } else {
               list=this.sequenceList
            }
            this.resetcurrentIndex(list)//设置当前播放歌曲在新列表中的下标
            this.getPlaylist(list) //设置播放列表
        },
        resetcurrentIndex(list){//获得当前播放歌曲，在新的list中的下标,并发送mutation设置当前播放歌曲的下标
            const index=list.findIndex((item)=>{
              return item.id===this.currentSong.id
            })
            //console.log(index)
            //设置下标
            this.getCurrentIndex(index)
        },
        ready(){//歌曲是否已经准备好播放
            this.songReady=true
        },
        error(){//歌曲发生错误触发，为了能正常使用按键，也当作准备好
            this.songReady=true
        },
        prev(){//后退
          if (!this.songReady) {//没准备好，直接他return
            return
          }
          let index=this.currentIndex-1
          if (index===-1) {
            index=this.playlist.length-1
          }
          if (!this.playing) {//暂停
            //启动播放
            this.handleplay()
          }
          this.getCurrentIndex(index)
        },
        next(){//前进
           if (!this.songReady) {//没准备好，直接他return
            return
          }
          let index=this.currentIndex+1
          if (index===this.playlist.length) {
            index=0
          }
          if (!this.playing) {//暂停
            //启动播放
            this.handleplay()
          }
          this.getCurrentIndex(index)
        },
        handleplay(){//暂停、播放
          this.getPlaying(!this.playing)
        },
        back(){//显示小播放器
          this.getFullScreen(false)
        },
        open(){//显示全屏播放器
          this.getFullScreen(true)
        },
        timeupdate(e){//获得播放时间 
          //console.log(e.target.currentTime)
          this.currentTime=e.target.currentTime
        },
        format(interval) {//设置时间戳
          interval = interval | 0
          const minute = Math.floor(interval / 60 )
          const second = this._pad(interval % 60)
          return `${minute}:${second}`
        },
        _pad(num, n = 2) {//位数不够补零
          let len = num.toString().length //数字的位数
          while (len < n) {
            num = '0' + num
            len++
          }
          return num
        },
        percentChange(percent){//处理返回的比例值，得到新的播放时间
          this.$refs.audio.currentTime = percent*this.currentSong.duration //通过audio的属性currentTime 设置新的播放时间，currentSong.duration是歌曲总时长
          if (!this.playing) {//如果是暂停
             //启动播放
            this.handleplay()
          }
        },
        enter(el,done){
          const {x,y,scale}=this.getcdxy()//获得小cd的初始状态
          //设置运动状态
          let animation={
            0:{//初始状态
              transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60:{
              transform:`translate3d(0,0,0) scale(1.1)`
            },
            100:{
              transform:`translate3d(0,0,0) scale(1)`
            },
          }
          //创建过度动画
          animations.registerAnimation({
            name: 'move',//动画名
            animation,//动画运动状态
            presets: {
              duration: 400,// 动画时长
              easing: 'linear'// 动画曲线
            }
          })
          //执行动画，绑定动画元素，并执行回调函数done进入下一阶段afterenter
          animations.runAnimation(this.$refs.cdWrapper, 'move', done)

        },
        afterEnter(){
          //结束动画
          animations.unregisterAnimation('move')
          //属性值为空
          this.$refs.cdWrapper.style.animation = ''
        },
        leave(el,done){
          const {x,y,scale}=this.getcdxy()//获得小cd的初始状态
          //设置运动状态
          let animation={
            0:{//初始状态
              transform:`translate3d(0,0,0) scale(1)`
            },
            60:{
              transform:`translate3d(0,0,0) scale(1.1)`
            },
            100:{
              transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
            },
          }
          //创建过度动画
          animations.registerAnimation({
            name: 'out',//动画名
            animation,//动画运动状态
            presets: {
              duration: 400,// 动画时长
              easing: 'linear'// 动画曲线
            }
          })
          //执行动画，绑定动画元素，并执行回调函数done进入下一阶段afterenter
          animations.runAnimation(this.$refs.cdWrapper, 'out', done)
        },
        afterLeave(){
          //结束动画
          animations.unregisterAnimation('out')
          //属性值为空
          this.$refs.cdWrapper.style.animation = ''
        },
        getcdxy(){//获得小cd到大cd，X和Y轴的移动距离，和scale的比例
          const targetWidth = 40 //小cd的宽度
          const paddingLeft = 40 //小cd中心点距离左边的距离
          const paddingBottom = 30 //小cd中心点距离底部的距离
          const paddingTop = 80 //大cd距离顶部的距离
          const width = window.innerWidth * 0.8 //大cd的宽度
          const scale = targetWidth / width //缩放比例
          const x=-(window.innerWidth/2-paddingLeft) //从小到大，x轴的移动距离
          const y = window.innerHeight - paddingTop - width / 2 - paddingBottom //从小到大，y轴的移动距离

          return {
            x,y,scale
          }
        },
        ...mapMutations([
          'getFullScreen',
          'getPlaying',
          'getCurrentIndex',
          'getMode',
          'getPlaylist'
        ]),
      },
      components:{
        progressBar,
        progressCircle
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
          

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
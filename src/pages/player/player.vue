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
            <!-- 中间部分 -->
            <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
              <!-- CD部分 -->
              <div class="middle-l" ref="middleL">
                <div class="cd-wrapper" ref="cdWrapper"> 
                  <div class="cd" :class="cdCls">
                    <img class="image" :src="currentSong?currentSong.image:''">
                  </div>
                </div>
                <!-- 当前歌词 -->
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric">{{playingLyric}}</div>
                </div>
              </div>  
              <!-- 歌词部分 -->
               <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                  <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                      <p ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" v-for="(line, index) in currentLyric.lines" :key="line.time">{{line.txt}}</p>
                    </div>
                  </div>
                </scroll>
            </div>
            <!-- 按钮部分 -->
            <div class="bottom">
              <div class="dot-wrapper">
                <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
              </div>
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
        noended自带事件，表示当歌曲播放完后处理
        -->
        <audio ref="audio" :src="currentSong?currentSong.url:' '" @play="ready" @error="error" @timeupdate="timeupdate" @ended="end"></audio>  
    </div>   
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'//过度动画第三方库
  import progressBar from '../../components/progress-bar/progress-bar.vue'
  import progressCircle from '../../components/progress-circle/progress-circle.vue'
  import { playMode } from '../../store/config'
  import { shuffle } from '../../common/js/util.js'
  import {getSongVkey} from '../../api/singer'
  import Lyric from 'lyric-parser' //第三方歌词解析的方法，带API
  import Scroll from '../../components/scroll/scroll'
  
  export default {
      name:'player',
      data(){
        return {
          songReady:false, //歌曲是否准备好播放的标记
          currentTime:0, //当前播放时间
          radius: 32,//小播放按钮外圈的大小
          currentLyric:null, //歌词
          currentLineNum:0, //表示第几行歌词
          currentShow:'cd',
          playingLyric:'', //当前歌词
          timer:'' //保存计时器

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
          if (!newSong.id) {
            return
          }
          if (newSong.id === oldSong.id) {//判断切换模式的时候如果是同一首歌曲，直接跳过后面的程序
            return
          }
          if (this.currentLyric) {//因为歌词插件里面有计时器，所以如果切歌的时候计时器一直在工作，要判断如果有歌词就停掉计时器，不然有BUG
             this.currentLyric.stop()
          }
          getSongVkey(newSong.mid).then((res)=>{//获取到了Vkey，但是匹配起来也无法访问，每次请求的vkey都不一样
            //console.log(`http://223.221.162.25/amobile.music.tc.qq.com/C400${newSong.strMediaMid}.m4a?guid=1712033339&vkey=${res.data.req.data.vkey}&uin=0&fromtag=66`)
          })
          //每次当前歌曲变化的时候，先清理掉上次的计时器
          clearTimeout(this.timer)
          this.timer =setTimeout(()=>{//做延时，防止BUG
            this.$refs.audio.play()//播放歌曲
            this.getLyric()//获取到歌词
          },1000)
        },
        playing(newPlay){//做歌曲的暂停、播放
          this.$nextTick(()=>{//做延时
            newPlay?this.$refs.audio.play():this.$refs.audio.pause() //true播放 false暂停
          })
        },
      },
      created() {
        this.touch={}//用于记录touch事件时候的一些共享属性
      },
      methods: {
        middleTouchStart(e){//事件按下
            this.touch.initiated = true //表示已经按下
            this.touch.startX = e.touches[0].pageX //按下地点距离X轴位置
            this.touch.startY = e.touches[0].pageY //按下地点距离Y轴位置
        },
        middleTouchMove(e){//事件移动
            if (!this.touch.initiated) {
              return
            }
            const deltaX = e.touches[0].pageX - this.touch.startX //在X轴的移动距离
            const deltaY = e.touches[0].pageY  - this.touch.startY //在Y轴的移动距离
      
            if (Math.abs(deltaY) > Math.abs(deltaX)) {//表示在Y轴的移动距离大于X轴，则认为是歌词在移动，不滑动
              return
            }
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth //表示歌词所在DOM距离左边的距离，如果显示的CD表示0，如果是-window.innerWidth就表示页面显示的歌词
            //获取到活动范围,向左拉最多到-window.innerWidth，向右拉最多到0
            //向左拉deltaX为负数，向右拉为正数
            const offsetWidth=Math.min(0,Math.max(-window.innerWidth, left + deltaX))
            //获得移动距离在整个窗口的移动比例
            this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
            //console.log(this.touch.percent) //向左拉比例是0-1 向右拉1-0
            //console.log(offsetWidth)
            //移动DOM
            this.$refs.lyricList.$el.style['transform']=`translate3d(${offsetWidth}px,0,0)` //移动距离
            this.$refs.lyricList.$el.style['webkitTransform']=`translate3d(${offsetWidth}px,0,0)` //移动距离
            this.$refs.lyricList.$el.style['transition-duration'] = 0 //歌词过度时间
            this.$refs.middleL.style.opacity=1-this.touch.percent //CD透明度
            this.$refs.middleL.style['transition-duration'] = 0 //CD过度时间

        },
        middleTouchEnd(){//事件结束
          let offsetWidth
          let opacity
          if (this.currentShow==='cd') {//是CD画面，向左拉
            if (this.touch.percent>0.2) {//拉动距离大于20%的时候，就要显示歌词画面了
                offsetWidth=-window.innerWidth
                opacity=0
                this.currentShow = 'lyric'
            } else {//还是显示原来的画面
                offsetWidth=0
                opacity=1
            }
          } else {//是歌词页面，向右拉
            if (this.touch.percent<0.8) {//拉动距离小于80%的时候，就要显示CD画面了
                offsetWidth=0
                opacity=1
                this.currentShow = 'cd'
            } else {//还是显示原来的画面
                offsetWidth=-window.innerWidth
                opacity=0
            }
          }
          //移动DOM
          this.$refs.lyricList.$el.style['transform']=`translate3d(${offsetWidth}px,0,0)` //移动距离
          this.$refs.lyricList.$el.style['webkitTransform']=`translate3d(${offsetWidth}px,0,0)` //移动距离
          this.$refs.lyricList.$el.style['transition-duration'] = '300ms' //歌词过度时间
          this.$refs.middleL.style.opacity=opacity //CD透明度
          this.$refs.middleL.style['transition-duration'] = '300ms' //CD过度时间


        },
        getLyric(){//解析歌词的方法
            //获取每首歌的歌词getLyric()方法已经用工厂创建song对象的时候添加到每个歌曲对象中，所有可以用当前歌曲对象直接调用发起请求
            this.currentSong.getLyric().then((lyric)=>{//得到歌词
               if (this.currentSong.lyric !== lyric) {
                  return
                }
              this.currentLyric = new Lyric(lyric, this.handleLyric) //使用Lyric方法解析歌词，创建实例，第二个参数是回调函数
              //console.log(this.currentLyric)
              if (this.playing) {//如果是播放状态，歌词也播放
                this.currentLyric.play()//lyric-parser插件自带的API方法
              } 
            }).catch(()=>{//如请求失败，把歌词数据置为空
              this.currentLyric=null //歌词设置为空
              this.currentLineNum=0  //显示第0行
              this.playingLyric=""   //当前显示的歌词设置为空
            })

        },
        handleLyric({lineNum, txt}) { //解析歌词的回调函数，lineNum播放行数，当前行的歌词内容
          this.currentLineNum = lineNum
          if (lineNum > 5) {//如果已经播放到大于5行，高亮显示不在移动，歌词开始滚动
            let lineEl = this.$refs.lyricLine[lineNum - 5] //固定在第几行的位置
            this.$refs.lyricList.scrollToElement(lineEl, 1000) //滚动多少行
          } else {//高亮滚动
            this.$refs.lyricList.scrollTo(0, 0, 1000)
          }
          this.playingLyric = txt
        },
        end(){//当前播放列表播放完
            if (this.mode === playMode.loop) {
              this.loop() //单曲循环
            } else { 
              this.next() //前进到下一首
            }
        },
        loop(){//单曲循环，只需要把播放时间设置到最开始，然后启动播放
            this.$refs.audio.currentTime=0
            this.$refs.audio.play()
            //当重新开始的时候歌词不会重新开始，需要设置
            if (this.currentLyric) {//如果有歌词
              this.currentLyric.seek(0) //lyric-parser插件自带的API方法
            }
        },
        changeMode(){//改变播放模式
            let mode=(this.mode+1)%3
            this.getMode(mode)
            //改变播放列表
            let list=null
            //存在问题，当切换的时候当前播放歌曲就会变化，同时因为currentSong发生变化，在监测中一变化就会执行歌曲播放
            if (mode===playMode.random) {//随机播放
                list=shuffle(this.sequenceList)//打乱顺序播放列表
            } else {
               list=this.sequenceList
            }
            this.resetcurrentIndex(list)//设置当前播放歌曲在新列表中的下标，解决切换模式当前播放歌曲会变化的BUG
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
          if (!this.songReady) {//没准备好，直接return
            return
          }
          if (this.playlist.length === 1) {//如果播放列表只有1首歌，那么就直接执行单曲播放
            this.loop()
            return
          } else {
            let index=this.currentIndex-1
            if (index===-1) {
              index=this.playlist.length-1
            }
            if (!this.playing) {//暂停
              //启动播放
              this.handleplay()
            }
            this.getCurrentIndex(index)
          }

          this.songReady = false //置为false，当准备好后播放下一首
        },
        next(){//前进
           if (!this.songReady) {//没准备好，直接return
            return
          }
          if (this.playlist.length === 1) {//如果播放列表只有1首歌，那么就直接执行单曲播放
            this.loop()
            return
          } else {
            let index=this.currentIndex+1
            if (index===this.playlist.length) {
              index=0
            }
            if (!this.playing) {//暂停
              //启动播放
              this.handleplay()
            }
            this.getCurrentIndex(index)
          }

          this.songReady = false //置为false，当准备好后播放下一首
        },
        handleplay(){//暂停、播放
          this.getPlaying(!this.playing)
          if (this.currentLyric) {//如果有歌词，歌曲暂停歌词也暂停
            this.currentLyric.togglePlay() //lyric-parser插件自带的API方法
          }
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
        percentChange(percent){//处理返回的比例值，得到新的播放时间，同时改变歌词的显示
          const time=percent*this.currentSong.duration//获得新的播放时间，currentSong.duration是歌曲总时长
          this.$refs.audio.currentTime = time //通过audio的属性currentTime 设置新的播放时间
          if (!this.playing) {//如果是暂停
             //启动播放
            this.handleplay()
          }
          if (this.currentLyric) {//如果有歌词，让歌词显示相对应的位置
            this.currentLyric.seek(time*1000) //lyric-parser插件自带的API方法
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
        progressCircle,
        Scroll
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
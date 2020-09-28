<template>
  <!-- 歌手、歌单详情页面 -->
  <div class="music-list">
    <!-- 返回上一级图标 -->
    <div class="back" @click="gotoback">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <!-- 背景图片区域 -->
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <!-- 播放图标 -->
      <div class="play-wrapper">
        <div ref="playBtn" class="play" v-show="data.length>0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 用于实现高斯模糊 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 用于拉动遮住背景 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌曲列表区域 -->
    <music-scroll :data="data" @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list" :style="playlist.length?styleObject:'0'">
      <div class="song-list-wrapper">
        <song-list :data="data" :rank="rank" @select="play"></song-list>
      </div>
      <div v-show="!data.length" class="loading-container">
        <loading></loading>
      </div>
    </music-scroll>
    <!-- <div class="list" ref="list" @touchstart="handlestart" @touchmove="handlemove" @touchend="hendleend">
      <div class="song-list-wrapper">
        <song-list :data="data"></song-list>
      </div>
      <div v-show="!data.length" class="loading-container">
        <loading></loading>
      </div>
    </div>       -->
  </div>
</template>

<script>
  import loading from '../loading/loading.vue'
  import songList from '../song-list/song-list.vue'
  import musicScroll from '../scroll/scroll.vue'
  import {mapActions,mapGetters} from 'vuex'
  const RESERVED_HEIGHT = 40 //最多滚动到距离顶部40像素
  export default {
      name:'musiclist',
      data(){
        return {
          probeType : 3,
          listenScroll : true,
          scrollY:0,//滚动距离
          bgHeight:0,//背景图片的高度
          styleObject:{//用于当打开播放器后，列表拉到最下面会被挡，如打开了播放器表示已经有播放列表，如果有播放列表那么bottom变成60
            bottom:'60px'
          }
        }
      },
      mounted(){//获得背景图片的高度，设置歌曲列表距离顶部的位置
        this.bgHeight = this.$refs.bgImage.clientHeight
        //最高滚动距离
        this.minTransalteY = -this.bgHeight + RESERVED_HEIGHT
        //设置列表距离顶部距离
        this.$refs.list.$el.style.top=`${this.bgHeight}px`
      },
      computed: {
        bgStyle(){//设置背景图片
          return `background-image:url(${this.bgImg})`
        },
        //获得播放列表，用于判断是否开启了播放器
        ...mapGetters([
          'playlist'
        ])

      },
      watch:{
        scrollY(newVal){//监控scrollY值的变化，当变化的时候移动DOM元素layer
            //获得移动距离,最多滚动到this.minTransalteY这个位置，
            let translateY = Math.max(this.minTransalteY,newVal)
            //显示优先级
            let zIndex = 0
            //设置向下拉放大系数
            let scale = 1
            //设置向上模糊系数
            let blur = 0
            //比例系数，取绝对值
            const percent = Math.abs(newVal / this.bgHeight)
            if (newVal > 0) {//表示向下拉 ，设置背景图放大系数
              scale = 1 + percent
              zIndex = 10
            } else {//表示向上拉，设置背景图模糊系数
              blur = Math.min(20, percent * 20)//模糊比例，最大20
            }
            //移动元素，兼容写法
            this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
            this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
            //设置高斯模糊
            this.$refs.filter.style['backdrop'] = `blur(${blur}px)`
            this.$refs.filter.style['webkitBackdrop'] = `blur(${blur}px)`
            
            if (newVal<this.minTransalteY) {//小于，表示已经上拉到最高点，改变背景图的css样式
              zIndex = 10
              //改变背景图片的css属性
              this.$refs.bgImage.style.paddingTop = 0
              this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
              //隐藏随机播放图标
              this.$refs.playBtn.style.display = 'none'
            } else {//大于，表示在正常拉动范围，还原背景图的css样式
              //把背景图片的css还原
              this.$refs.bgImage.style.paddingTop = '70%'
              this.$refs.bgImage.style.height =''
              //显示随机播放图标
              this.$refs.playBtn.style.display = ''
            }
            //背景图片放大
            this.$refs.bgImage.style['transform'] = `scale(${scale})`
            this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
            //设置背景图片的显示优先级
            this.$refs.bgImage.style.zIndex = zIndex
        }
      },
      methods:{
        random(){//点击随机播放按钮,启动播放器，传入数据
          this.randomPlay({
            list:this.data
          })
        },
        scroll(pos){//自定义的事件，pos是子元素调用$emit方法使用事件传递回来的参数，具体是元素的滚动距离的对象
          //console.log(pos)
          this.scrollY=pos.y
        },
        gotoback(){
          //this.$router.go(-1)
          this.$router.back()
        },
        play(song,index){//开启播放器并播放歌曲,自定义函数，让子元素调用，传回数据（当前点击歌曲和下标）
          //传入数据，歌曲列表和当前播放歌曲序号
          this.selectPlay({
            list:this.data, //歌曲列表
            index
          })
        },
        ...mapActions([
          'randomPlay',
          'selectPlay'
        ]) 
      },
      components:{
        loading,
        songList,
        musicScroll
      },
      props: {
        bgImg: {
          type: String,
          default: ''
        },
        data: {
          type: Array,
          default: []
        },
        title: {
          type: String,
          default: ''
        },
        rank: {//默认false，表示歌曲列表不显示排行榜
          type: Boolean,
          default: false
        }
      },
      /*data(){
        return {
          loop:"",//计数器
          flag:false,
          startY:0,//开始时Y轴坐标
          mouseY:0,//移动中Y轴坐标
          domY:0,//需要移动的距离
          bgHeight:0,//背景图片的高度
          domHeight:0//元素距离顶部的距离
        }
      },
      props:['title','data','bgImg'],
      computed: {
        bgStyle(){//设置背景图片
          return `background-image:url(${this.bgImg})`
        }
      },
      mounted() {//获得背景图的高度，得到歌曲列表距离顶部多少
        //console.log(this.$refs.bgImage.clientHeight)
        this.bgHeight=this.$refs.bgImage.clientHeight
        //console.log(this.$refs.list)
        this.$refs.list.style.top=`${this.bgHeight}px`
      },
      methods: {
        handlestart (e) {//长按
          clearTimeout(this.loop); //再次清空定时器，防止重复注册定时器
          //console.log(e)
          //获得元素距离顶部的距离
          this.domHeight=this.$refs.list.offsetTop
          //获取按下后初始的Y轴坐标
          this.startY=e.targetTouches[0].clientY
          this.loop = setTimeout(() => {
            //启动移动事件
            this.flag=true
          }, 1000);
        },
        handlemove(e){
          if (this.flag) {
            //隐藏随机播放
            this.$refs.playBtn.style.display="none"
            //获取按下后鼠标的Y轴坐标
            this.mouseY=e.targetTouches[0].clientY
            //计算出移动的距离
            this.domY=this.startY-this.mouseY
            //计算出移动中元素距离顶部的距离
            let topY=this.domHeight-this.domY
            //console.log(this.domY)
            //固定移动的范围
            if (this.domY>=(this.domHeight-40)) {//当移动距离大于了
              this.$refs.list.style.top=`40px`
            } else if(this.domY<=0){//当移动距离小于0，说明是向下拉
              if (topY>=this.bgHeight) {//当元素距离顶部的距离大于等于了背景图的高度时
                //显示随机播放
                this.$refs.playBtn.style.display="block"
                this.$refs.list.style.top=`${this.bgHeight}px`
                this.flag=false//停止移动事件
              } else {//当元素距离顶部的距离小于背景图的高度时
                 this.$refs.list.style.top=`${topY}px`
              }
            } else {//其他
              this.$refs.list.style.top=`${topY}px`
            }
          }
        },
        hendleend () {
          clearTimeout(this.loop); //清空定时器，防止重复注册定时器
          //console.log("松开了")
        },
        gotoback(){
          //this.$router.go(-1)
          this.$router.back()
        }
      },
      components:{
        songList,
        loading,
      }*/
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
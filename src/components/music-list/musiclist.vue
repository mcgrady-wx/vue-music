<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper">
        <div ref="playBtn" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="list" ref="list" @touchstart="handlestart" @touchend="hendleend" @touchmove.prevent="handlemove"> 
      <div class="song-list-wrapper">
        <song-list :data="data"></song-list>
      </div>
      <div v-show="!data.length" class="loading-container">
        <loading></loading>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from '../../components/loading/loading'
  import songList from '../song-list/song-list.vue'
  export default {
      name:'musiclist',
      data(){
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
      mounted() {//获得背景图得高度，得到歌曲列表具体顶部多少
        //console.log(this.$refs.bgImage.clientHeight)
        this.bgHeight=this.$refs.bgImage.clientHeight
        this.$refs.list.style.top=`${this.bgHeight}px`
        
      },
      methods: {
        handlestart (e) {//长按
          clearTimeout(this.loop); //再次清空定时器，防止重复注册定时器
          //console.log(e)
          //获得元素距离顶部的距离
          this.domHeight=this.$refs.list.offsetTop
          //获取按下后初始的Y轴坐标
          this.startY=e.targetTouches[0].clientY
          this.loop = setTimeout(() => {
            //启动移动事件
            this.flag=true
          }, 1000);
        },
        handlemove(e){
          if (this.flag) {
            //获取按下后鼠标的Y轴坐标
            this.mouseY=e.targetTouches[0].clientY
            //计算出移动的距离
            this.domY=this.startY-this.mouseY
            //计算出移动中元素距离顶部的距离
            let top=this.domHeight-this.domY
            //console.log(this.domY)
            //固定移动的范围
            if (this.domY>=(this.domHeight-40)) {//当移动距离大于了
              this.$refs.list.style.top=`40px`
            } else if(this.domY<=0){//当移动距离大于0，说明是向下拉
              if (top>=this.bgHeight) {//当元素距离顶部的距离大于等于了背景图的高度时
                this.$refs.list.style.top=`${this.bgHeight}px`
                this.flag=false//停止移动事件
              } else {//当元素距离顶部的距离小于背景图的高度时
                 this.$refs.list.style.top=`${top}px`
              }
            } else {//其他
              this.$refs.list.style.top=`${top}px`
            }
          }
        },
        hendleend () {
          clearTimeout(this.loop); //清空定时器，防止重复注册定时器
          //console.log("松开了")
        }
      },
      components:{
        songList,
        loading
      }
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
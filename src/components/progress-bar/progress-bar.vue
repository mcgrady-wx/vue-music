<template>
  <!-- 歌曲进度条组件 -->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
       <!-- 显示的进度条  -->
      <div class="progress" ref="progress"></div>
      <!-- 小球 -->
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const progressBtnWidth=16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {} //用于记录touch事件时候的一些共享属性
    },
    methods: {
        _offset(offsetWidth) {//移动函数，显示已播放进度条和小圆点移动距离
            this.$refs.progress.style.width = `${offsetWidth}px` //进度条显示距离
            this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)` //小圆点移动距离
            this.$refs.progressBtn.style['webkitTransform'] = `translate3d(${offsetWidth}px,0,0)`
        },
        progressTouchStart(e){//事件按下
            //console.log(e.touches[0].pageX)
            this.touch.initiated = true //表示已经按下
            this.touch.startX = e.touches[0].pageX //初始按下小圆点X轴位置
            this.touch.left = this.$refs.progress.clientWidth //获得小球距离进度条左边的距离/进度条显示的距离
            //console.log(this.touch.left)
        },
        progressTouchMove(e){//事件移动
            //console.log(e.touches[0].pageX)
            if (!this.touch.initiated) {
                return false
            }
            const deltaX=e.touches[0].pageX-this.touch.startX //获得移动距离
            const offsetWidth=Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left+deltaX)) //获得最终位置，,设定范围，最小为0，最大为进度条显示宽度
            this._offset(offsetWidth)
        },
        progressTouchEnd(){//事件松开
            this.touch.initiated = false
            this._triggerPercent()
        },
        _triggerPercent() {//重新计算percent比例，然后通过emit事件，把比例值返回去设置已播放时间
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth //进度条总长度
            const percent = this.$refs.progress.clientWidth / barWidth //设置比例
            this.$emit('percentChange', percent)
        },
        progressClick(e){//点击切换进度
            const rect = this.$refs.progressBar.getBoundingClientRect().left //获得进度条距离左边的距离
            const offsetWidth=e.pageX-rect // e.pageX 是点击位置距离左边的距离。减去进度条距离左边的距离获得移动距离
            this._offset(offsetWidth) //设置进度条显示
            this._triggerPercent() //设置时间 

        }
    },
    watch: {
        percent(newPercent){
            if (newPercent>0 && !this.touch.initiated) {//且没有启动touchstart时，如不设置拖拽的时候会重新弹回去原来的位置
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth //获得进度条显示的总长度
                const offsetWidth=newPercent*barWidth //得到移动的位置
                this._offset(offsetWidth)
            }
        }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
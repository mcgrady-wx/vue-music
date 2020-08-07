<template>
    <div class="recommend" ref="recommend" :style="playlist.length?styleObject:'0'">
      <scroll ref="scroll" class="recommend-content" :data="disclist">
        <div>
          <!--mint-ui 轮播图 -->
          <mt-swipe :auto="4000">
              <mt-swipe-item v-for="(img, index) in imgs" :key="index">
                  <img :src="img.banner">
              </mt-swipe-item>
          </mt-swipe>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <!-- keep-alive是vue内置标签，快速实现页面缓存，避免二次请求数据 -->
            <keep-alive>
              <ul>
                <li v-for="item in disclist" :key="item.content_id" class="item" @click="gotodisc(item)">
                  <div class="icon">
                    <img width="60" height="60" v-lazy="item.cover">
                  </div>
                  <div class="text">
                    <h2 class="name" v-html="item.title"></h2>
                    <p class="desc" v-html="item.username"></p>
                  </div>
                </li>
              </ul>
            </keep-alive>
          </div>
        </div>
        <div class="loading-container" v-show="!disclist.length">
            <loading></loading>
        </div>
      </scroll>
      <transition name="slide">
        <router-view></router-view>
      </transition>
    </div>
</template>

<script>
import loading from '../../components/loading/loading'
import base from '../../api/base'
import Scroll from '../../components/scroll/scroll'
import {getDiscList} from '../../api/recommend'
import {mapGetters,mapMutations} from 'vuex'
export default {
    name:"recommend",
    data(){
        return {
            // 获取到本地的banner图片
            imgs:[
               { banner:require('../../common/image/banner1.jpg')},
               { banner:require('../../common/image/banner2.jpg')},
               { banner:require('../../common/image/banner3.jpg')},
               { banner:require('../../common/image/banner4.jpg')}
            ],
            //歌单推存列表
            disclist:[],
            styleObject:{//用于当打开播放器后，列表拉到最下面会被挡，如打开了播放器表示已经有播放列表，如果有播放列表那么bottom变成60
              bottom:'60px'
            }
        }
    },
    methods: {
        _getDiscList(){
            // this.$axios.get(base.disclist).then((res)=>{//使用static中的模拟数据
            //     //console.log(res.data.data.list)
            //     this.disclist=res.data.data.list
            // })
            getDiscList().then((res)=>{//线上真实数据
              //console.log(res.recomPlaylist.data.v_hot)
              this.disclist=res.recomPlaylist.data.v_hot
            })
        },
        gotodisc(item){//跳转页面
          this.$router.push(`/recommend/${item.content_id}`)
          //修改推荐歌单信息
          this.getDisc(item)
        },
        ...mapMutations([
          'getDisc'
        ])
    },
    mounted() {
      // //测试loading
      // setTimeout(()=>{
      //   this.getDiscList() 
      // },2000)
      this._getDiscList()  
    },
    computed: {
      //获得播放列表，用于判断是否开启了播放器
      ...mapGetters([
        'playlist'
      ])
    },
    components:{
        loading,
        Scroll
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/variable"
.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .mint-swipe
        height:150px
        .mint-swipe-item
            img 
                width :100%
                height :100%
    .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    .slide-enter-active, .slide-leave-active
      transition: all 0.3s
    .slide-enter, .slide-leave-to
      transform: translate3d(100%, 0, 0)        
</style>
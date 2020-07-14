<template>
    <div class="recommend">
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
              <li v-for="item in disclist" :key="item.dissid" class="item">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </keep-alive>
        </div>
        <div class="loading-container" v-show="!disclist.length">
            <loading></loading>
        </div>
    </div>
</template>

<script>
import loading from '../../components/loading/loading'
import base from '../../api/base'
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
            disclist:[]
        }
    },
    methods: {
        getDiscList(){
            this.$axios.get(base.disclist).then((res)=>{
                //console.log(res.data.data.list)
                this.disclist=res.data.data.list
            })
        }
    },
    mounted() {
      // //测试loading
      // setTimeout(()=>{
      //   this.getDiscList() 
      // },2000)
      this.getDiscList()  
    },
    components:{
        loading
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/variable"
.recommend
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
</style>
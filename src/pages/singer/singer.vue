<template>
    <!-- 歌手列表页面 -->
    <div class="singer">
        <div class="listview">
            <mt-index-list >
                <mt-index-section class="list-group" v-for="value in singers" :key="value.title" :index="value.title">
                    <mt-cell v-for="singer in value.items" :key="singer.id" :title="singer.name" class='list-group-item' @click.native="gotoDetail(singer)">
                        <img v-lazy="singer.singerUrl" class="avatar">
                    </mt-cell>
                </mt-index-section>
            </mt-index-list>
        </div>
        <transition name="detail">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import base from '../../api/base'
import {mapMutations} from "vuex"
import {getSingerList} from '../../api/singer'
export default {
    name:"singer",
    data(){
        return {
            singers:[]
        }
    },
    methods: {
        ...mapMutations([
            'getSingerDetail'
        ]),
        //获取歌手列表
        getSingers(){
            //数据的顺序并非自己需要的样式，需要自己重新整理排序
            let HOT_NUM=10 //设置数据前十个为热门歌手
            let data=[] //接收获取到的歌手数据
            let singer={
                    hot:{
                        title:'热门',
                        items:[]
                     }
                 }//用于获取整理后的数据样式
            //发起请求获取数据
            getSingerList().then((res)=>{
                //console.log(res.data.data.list)
                console.log(res.data)
                data=res.data.list
                //遍历数据，添加到需要整理的对象中
                data.forEach((item,index)=>{
                    if (index<HOT_NUM) { //设置热门歌手数量
                        singer.hot.items.push({
                            name: item.Fsinger_name,
                            id: item.Fsinger_mid,
                            singerUrl:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
                        })
                    }
                    let key=item.Findex //标识A-Z的分类
                    if (!singer[key]) {//如果不存在就设置该类，如果有直接把数据添加到该类
                        singer[key]={
                            title:key,
                            items:[]
                        }
                    }
                    //把数据添加到该类别
                    singer[key].items.push({
                        name: item.Fsinger_name,
                        id: item.Fsinger_mid,
                        singerUrl:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
                    })

                })
                //得到想要的数据样式后，发现排序不是自己想要的，整理排序
                let hot=[] //存放热门歌手
                let other=[] //其他歌手
                //遍历数据对象
                for (const key in singer) {
                    let _data=singer[key]//获得每个数据对象 
                    if (_data.title==='热门') {
                        hot.push(_data)
                    } else if (_data.title.match(/[a-zA-Z]/)) {//使用match方法检索是否包含A-Z
                        other.push(_data)
                    }
                }
                //排序
                other.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                //合并数组并且赋值给singers
                this.singers=hot.concat(other)

                // console.log(data) //元素数据
                // console.log(singer) //按照需求的对象格式 
                // console.log(this.singers) //最终需要的数组数据
            })
        },
        //跳转到歌手详情页面
        gotoDetail(data){
            //console.log(id)
            this.$router.push(`/singer/${data.id}`)
            //保存歌手信息
            this.getSingerDetail(data)
        }
    },
    mounted() {
        this.getSingers()
    },
}
</script>

<style lang="stylus">
 @import "../../common/stylus/variable"
 @import "../../common/stylus/mixin"
 .singer
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    touch-action: none //处理默认错误
    background: $color-background
    .mint-indexlist-content
        margin-right :0!important
    .list-group
      padding-bottom: 30px
      p
        height: 30px
        padding :0
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        background:$color-background
        .mint-cell-wrapper
          flex-direction :row-reverse
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        span
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .mint-indexlist-nav
      position: absolute
      z-index: 30
      right: 0
      bottom :auto
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      border: 0
      .mint-indexlist-navitem
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
 .detail-enter-active,.detail-leave-active
    transition: all 0.3s
 .detail-enter,.detail-leave-to
    transform: translate3d(100%, 0, 0)  
    
</style>
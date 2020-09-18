<template>
    <div class="rank" :style="playlist.length?styleObject:'0'">
        <scroll :data="toplist" class="toplist">
            <ul>
                <li class="item" v-for="item in toplist" :key="item.id" @click="gotoTopList(item)">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl"/>
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList" :key="index">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!toplist.length">
                <loading></loading>
            </div>
        </scroll>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import {getTopList} from '../../api/rank' 
import scroll from '../../components/scroll/scroll'
import {mapMutations,mapGetters} from 'vuex'
import Loading from '../../components/loading/loading'

export default {
    name:"rank",
    data(){
        return {
            toplist:[],
            styleObject:{//用于当打开播放器后，列表拉到最下面会被挡，如打开了播放器表示已经有播放列表，如果有播放列表那么bottom变成60
              bottom:'60px'
            }
        }
    },
    created() {
        this._getTopList()
    },
    computed: {
      //获得播放列表，用于判断是否开启了播放器
      ...mapGetters([
        'playlist'
      ])
    },
    methods: {
        _getTopList(){
            getTopList().then(res=>{
                //console.log(res)
                if (res.code===0) {
                    this.toplist=res.data.topList
                }
            })
        },
        gotoTopList(item){//跳转到排行歌单页面
            this.$router.push(`/rank/${item.id}`)
            this.getTopList(item)//保存top信息
        },
        ...mapMutations([
            'getTopList'
        ]),
    },
    components:{
        scroll,
        Loading
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/variable"


  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s ease
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
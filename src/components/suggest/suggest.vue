<template>
  <!-- 搜索结果页面 -->
  <scroll ref="suggest" :pullup="pullup" class="suggest" @scrollToEnd="searchMore" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
           <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from '../../api/search'
import {createSong} from '../../common/js/song'
import Scroll from '../../components/scroll/scroll'
import Loading from '../../components/loading/loading'
import {mapMutations,mapActions} from 'vuex'
import NoResult from '../../components/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {//是否搜索歌手
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        pullup: true,//设置上拉刷新
        beforeScroll: true, //启动滚动列表时候收起小键盘
        hasMore: true,
        result: []
      }
    },
    methods: {
      ...mapMutations([
            'getSingerDetail'
        ]),
      ...mapActions([
        'insertSong'
      ]),
      refresh() {//用于父元素调用,目的是刷新
        this.$refs.suggest.refresh()
      },
      listScroll() {//滚动的时候关闭小键盘
        this.$emit('listScroll')
      },
      _search() {//发起搜索请求
        this.page = 1//首次请求确保请求的是第一页
        this.hasMore = true//允许上拉刷新
        this.$refs.suggest.scrollTo(0, 0)//设置页面的初始位置
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this._genResult(res.data)
            //console.log(this.result)
            this._checkMore(res.data)//判断是否没有数据了
          }
        })
      },
      searchMore(){//通过自定义函数，让子组件调用该方法发起搜索请求实现上拉刷新
        if (!this.hasMore) {//如果是false，表示没有数据了上拉就不发起搜索请求
          return
        }
        this.page++
        //再次发起搜索请求
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result =this.result.concat(this._genResult(res.data)) 
            //console.log(this.result)
            this._checkMore(res.data)//判断是否没有数据了
          }
        })
      },
      _checkMore(data) {//判断是否已经没有数据了
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false//如果没有数据了就设置成false，不在发起请求
        }
      },
      _genResult(data) {//处理获得数据
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {//创建工厂song
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      selectItem(item) {//点击跳转
        if (item.type === TYPE_SINGER) {//如果点的是歌手
          const singer = {
            name: item.singername,
            id: item.singermid,
            singerUrl:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`
          }
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.getSingerDetail(singer)//保存歌手信息到vuex中
        } else {//如果点击的是歌曲，把歌曲保存到播放列表中并播放
          this.insertSong(item)
        }
        this.$emit('select', item)//调用父元素传递过来的自定义方法，把数据传回给父元素
      },
      getIconCls(item) {//根据类型设置列表样式
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {//设置搜索出来的内容显示
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
    },
    watch: {
      query(newQuery) {
        this._search()
      }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
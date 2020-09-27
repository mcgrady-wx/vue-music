<template>
    <!-- 搜索页面 -->
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
            <scroll ref="shortcut" class="shortcut" :data="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li class="item" v-for="item in hotKey" :key="item.n" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                        <span class="text">搜索历史</span>
                        <span @click="showConfirm" class="clear">
                            <i class="icon-clear"></i>
                        </span>
                        </h1>
                        <search-list :searches="searchHistory" @select="addQuery" @delete='deleteHistory'></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
        </div>
        <confirm ref="confirm" @confirm="clearHistory" text="是否清空所有搜索记录"></confirm>
        <router-view></router-view>
    </div>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
import SearchBox from '../../components/search-box/search-box'
import suggest from '../../components/suggest/suggest'
import {getHotKey} from '../../api/search'
import {mapActions} from 'vuex'
import SearchList from '../../components/search-list/search-list'
import confirm from '../../components/confirm/confirm'
import {playlistMixin,searchMixin} from '../../common/js/mixin' //处理播放器打开后，显示页面bottom的值变化。searchMixin共用的一些数据和方法
export default {
    name:"search",
    mixins: [playlistMixin,searchMixin],
    data(){
        return {
            hotKey: [],
            //query:''
        }
    },
    created() {
      this._getHotKey()
    },
    computed: {
        shortcut(){
            return this.hotKey.concat(this.searchHistory)
        },
        // ...mapGetters([
        //     'searchHistory'
        // ])
    },
    methods: {
        handlePlaylist(playlist) {//处理播放器挡住最下面的问题，播放器打开后，显示页面bottom的值要变成60px 没打开默认为0
            const bottom = playlist.length > 0 ? '60px' : '' //如果有播放列表 bottom的值为60px 没有播放列表就为空

            //设置两个用了scroll组件的组件bottom的值
            this.$refs.searchResult.style.bottom = bottom //设置搜索结果列表的bottom
            this.$refs.suggest.refresh()//调用子元素方法,刷新搜索结果组件

            this.$refs.shortcutWrapper.style.bottom = bottom //设置搜索页面的bottom
            this.$refs.shortcut.refresh()//调用子元素方法,刷新当前组件
        },
        ...mapActions([
            //'saveSearchHistory',
            //'deleteSearchHistory',
            'clearSearchHistory'
        ]),
        _getHotKey(){
            getHotKey().then(res=>{
                //console.log(res)
                if (res.code===0) {//请求热门搜索，取前十个搜索
                    this.hotKey=res.data.hotkey.slice(0,10)
                }
            })
        },
        // addQuery(name){//点击，让点击的文字显示在输入框
        //     this.$refs.searchBox.setQuery(name)//调取子组件的方法
        // },
        // onQueryChange(query){//通过自定义函数，子组件用emit事件把新的query值返回给父元素
        //     this.query=query
        // },
        // blurInput(){//优化输入框失去焦点的时候收起小键盘
        //     this.$refs.searchBox.blur()
        // },
        // saveSearch(){//传递给子元素的自定义方法，当子元素点击跳转后，把query的内容保存到历史记录
        //     this.saveSearchHistory(this.query)
        // },
        showConfirm(){//点击垃圾桶显示弹窗小窗口
            this.$refs.confirm.show()
        },
        deleteHistory(item){//删除当前的历史记录
            this.deleteSearchHistory(item)
        },
        clearHistory(){//清空历史记录
            this.clearSearchHistory()
        }
    },
    watch: {
        query(newQuery){//监测query的变化，存在BUG，当添加了历史后退回到搜索页面，不能滚动，只需要监测变化，当没有query的时候刷新页面
            if (!newQuery) {
                setTimeout(() => {
                    this.$refs.shortcut.refresh()//刷新
                }, 20)
            }
        }
    },
    components:{
        SearchBox,
        suggest,
        Scroll,
        SearchList,
        confirm
    }

}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"
.search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
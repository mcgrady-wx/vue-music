<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
            <scroll ref="shortcut" class="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li class="item" v-for="item in hotKey" :key="item.n" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest ref="suggest" :query="query"></suggest>
        </div>
    </div>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
import SearchBox from '../../components/search-box/search-box'
import suggest from '../../components/suggest/suggest'
import {getHotKey} from '../../api/search'
export default {
    name:"search",
    data(){
        return {
            hotKey: [],
            query:''

        }
    },
    created() {
      this._getHotKey()
    },
    methods: {
        _getHotKey(){
            getHotKey().then(res=>{
                //console.log(res)
                if (res.code===0) {//请求热门搜索，取前十个搜索
                    this.hotKey=res.data.hotkey.slice(0,10)
                }
            })
        },
        addQuery(name){//点击热门搜索，修改输入框文字
            this.$refs.searchBox.setQuery(name)//调取子组件的方法
        },
        onQueryChange(query){//通过自定义函数，子组件用emit事件把新的query值返回给父元素
            this.query=query
        }
    },
    components:{
        SearchBox,
        suggest,
        Scroll
    }

}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
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
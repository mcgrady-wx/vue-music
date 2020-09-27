import {mapGetters, mapMutations, mapActions} from 'vuex'
import { playMode } from '../../store/config'
import { shuffle } from '../../common/js/util.js'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {//play和playlist共用的一些computed、methods
  computed: {
    iconMode(){//播放模式显示
      return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      //'favoriteList'
    ])
  },
  methods: {
    changeMode(){//改变播放模式
      let mode=(this.mode+1)%3
      this.getMode(mode)
      //改变播放列表
      let list=null
      //存在问题，当切换的时候当前播放歌曲就会变化，同时因为currentSong发生变化，在监测中一变化就会执行歌曲播放
      if (mode===playMode.random) {//随机播放
          list=shuffle(this.sequenceList)//打乱顺序播放列表
      } else {
         list=this.sequenceList
      }
      this.resetcurrentIndex(list)//设置当前播放歌曲在新列表中的下标，解决切换模式当前播放歌曲会变化的BUG
      this.getPlaylist(list) //设置播放列表
    },
    resetcurrentIndex(list){//获得当前播放歌曲，在新的list中的下标,并发送mutation设置当前播放歌曲的下标
        const index=list.findIndex((item)=>{
          return item.id===this.currentSong.id
        })
        //console.log(index)
        //设置下标
        this.getCurrentIndex(index)
    },
    // toggleFavorite(song) {
    //   if (this.isFavorite(song)) {
    //     this.deleteFavoriteList(song)
    //   } else {
    //     this.saveFavoriteList(song)
    //   }
    // },
    // getFavoriteIcon(song) {
    //   if (this.isFavorite(song)) {
    //     return 'icon-favorite'
    //   }
    //   return 'icon-not-favorite'
    // },
    // isFavorite(song) {
    //   const index = this.favoriteList.findIndex((item) => {
    //     return item.id === song.id
    //   })
    //   return index > -1
    // },
    ...mapMutations([
        'getPlaying',
        'getCurrentIndex',
        'getMode',
        'getPlaylist'
    ]),
    // ...mapActions([
    //   'saveFavoriteList',
    //   'deleteFavoriteList'
    // ])
  }
}

export const searchMixin = {//search和addSong组件共用关于搜索的一些数据和方法
  data() {
    return {
      query: '',
      //refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query){//通过自定义函数，子组件用emit事件把新的query值返回给父元素
      this.query=query
    },
    blurInput(){//优化输入框失去焦点的时候收起小键盘
      this.$refs.searchBox.blur()
    },
    addQuery(name){//点击，让点击的文字显示在输入框
      this.$refs.searchBox.setQuery(name)//调取子组件的方法
    },
    saveSearch(){//传递给子元素的自定义方法，当子元素点击跳转后，把query的内容保存到历史记录
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}

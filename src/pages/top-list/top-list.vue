<template>
    <music-list :title="title" :bgImg='bgImage' :data="songs" :rank="rank"></music-list>
</template>

<script type="text/ecmascript-6">
  import MusicList from '../../components/music-list/musiclist'
  import {getMusicList} from '../../api/rank'
  import {mapGetters} from 'vuex'
  import {createSong} from '../../common/js/song' //引入工厂创建song的方法

  export default {
    computed: {
       ...mapGetters([
            'toplist'
        ]),
        title() {
            return this.toplist.topTitle
        },
        bgImage() {
            if (this.songs.length) {//使用第一首歌的图片作为背景图
            return this.songs[0].image
            }
            return ''
        },
    },
    data() {
      return {
        songs: [],
        rank: true //传入参数，true表示让歌曲列表显示排行显示
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.toplist.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.toplist.id).then((res) => {
          if (res.code === 0) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {//获得想要歌曲的数据样式
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  
</style>
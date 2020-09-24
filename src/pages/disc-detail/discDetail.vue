<template>
    <!-- 推荐页面的推荐歌单详情页 -->
    <transition name="slide">
        <music-list :data="songs" :title="title" :bgImg="bgImage" @click="_getSongList"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
  import musicList from '../../components/music-list/musiclist.vue'
  import {mapGetters} from 'vuex'
  import {getSongList} from "../../api/recommend"

  export default {
    computed: {
      title() {
        return this.disc.title
      },
      bgImage() {
        return this.disc.cover
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
        this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.content_id) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.content_id).then((res) => {
         
              console.log(res)
            //this.songs = this._normalizeSongs(res.cdlist[0].songlist)
 
        })
      },
    //   _normalizeSongs(list) {
    //     let ret = []
    //     list.forEach((musicData) => {
    //       if (musicData.songid && musicData.albummid) {
    //         ret.push(createSong(musicData))
    //       }
    //     })
    //     return ret
    //   }
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
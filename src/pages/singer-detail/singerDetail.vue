<template>
    <div class="singer-detail">
        <music-list :data="list" :title="singerDetail.name" :bgImg="singerDetail.singerUrl"></music-list>
    </div>
   
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from '../../api/singer'
import musicList from '../../components/music-list/musiclist.vue'
import {createSong} from '../../common/js/song' //引入工厂创建song的方法

export default {
    name:'singer-detail',
    data(){
        return {
            list:[]
        }
    },
    computed: {
        ...mapGetters([
            'singerDetail'
        ]),
    },
    methods: {
        getDetail(){
            //console.log(this.singerDetail.id)
            if (!this.singerDetail.id) {//如果歌手信息不存在
                this.$router.push('/singer')
                return
            }
            //存在就发起jsonp请求数据
            getSingerDetail(this.singerDetail.id).then((res)=>{
                //console.log(res.data.list)
                //处理拿到的数据
                // this.list=res.data.list.map((item)=>{
                //     // let vkey=""
                //     // getSongVkey(item.musicData.songmid).then((res)=>{
                //     //     //vkey = res.data.items[0].vkey;
                //     //     console.log(res.req)
                //     //    // console.log(res.data.items[0].vkey)
                //     // })
                //     this.songs = this._normalizeSongs(res.data.list)
                //     return {
                //         id: item.musicData.songid,
                //         mid: item.musicData.songmid,
                //         singer: item.musicData.singer[0].name,
                //         name: item.musicData.songname,
                //         album: item.musicData.albumname,
                //         duration: item.musicData.interval,
                //         image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.musicData.albummid}.jpg?max_age=2592000`,
                //         url: `http://125.74.6.23/amobile.music.tc.qq.com/C400${item.musicData.strMediaMid}.m4a?guid=1712033339&vkey=7D7E010BD4A6A45BF9560441267808181728D9BDC57520C8EDA339E0B38123288BDD3E2D3C5F66F1AFEBF3F05CA8678D13706FAE26BD83B5&uin=0&fromtag=66`
                //     }
                // })
                //console.log(this.list)
                if (res.code === 0) {//如果请求成功，得到数据
                    this.list = this._normalizeSongs(res.data.list)
                }
            })  
        },
        _normalizeSongs(list) {//处理得到的原始数据得到想要的数据
            let ret = []
            list.forEach((item) => {//遍历数据
                let {musicData} = item
                if (musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData))//工厂方式创建song
                }
            })

            return ret
        }

    },
    created() {
        this.getDetail()
    },
    components:{
        musicList
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/variable"
//  实现页面覆盖
.singer-detail
    position: fixed
    z-index:100
    top:0
    left :0
    right :0
    bottom :0
    background :$color-background


</style>
<template>
    <div class="singer-detail">
        <music-list :data="list" :title="singerDetail.name" :bgImg="singerDetail.singerUrl"></music-list>
    </div>
   
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from '../../api/singer'
import musicList from '../../components/music-list/musiclist.vue'

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
                this.list=res.data.list.map((item)=>{
                    // let vkey=""
                    // getSongVkey(item.musicData.songmid).then((res)=>{
                    //     //vkey = res.data.items[0].vkey;
                    //     console.log(res.req)
                    //    // console.log(res.data.items[0].vkey)
                    // })
                    
                    return {
                        id: item.musicData.songid,
                        mid: item.musicData.songmid,
                        singer: item.musicData.singer[0].name,
                        name: item.musicData.songname,
                        album: item.musicData.albumname,
                        duration: item.musicData.interval,
                        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.musicData.albummid}.jpg?max_age=2592000`,
                        url: `http://110.185.116.159/amobile.music.tc.qq.com/C400${item.musicData.strMediaMid}.m4a?guid=1712033339&vkey=FB7FAEBA6E7D11811F07AE47F2CFEBF8BD6100D965C28AF9E138CAC3C03B4CEF6C2E63077412DE0B322466C2BEAEFE7791BD75FA1D18418E&uin=0&fromtag=66`
                    }
                })
                //console.log(this.list)
            })
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
<template>
    <div class="singer-detail">
        详情
    </div>
   
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from '../../api/singer'

export default {
    name:'singer-detail',
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
                console.log(res.data.list)
            })
        }
    },
    created() {
        this.getDetail()
    },
    
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
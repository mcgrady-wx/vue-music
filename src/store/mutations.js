const mutations={
    getSingerDetail(state,obj){//获得歌手信息
        state.singer=obj
    },
    getPlaying(state,flag){//获得是否播放
        state.playing=flag
    },
    getFullScreen(state,flag){//获得是否全屏
        state.fullScreen=flag
    },
    getPlaylist(state,list){//获得播放列表
        state.playlist=list
    },
    getSequenceList(state,list){//获得顺序播放列表
        state.sequenceList=list
    },
    getMode(state,mode){//获得播放类型
        state.mode=mode
    },
    getCurrentIndex(state,index){//获得当前播放歌曲序号
        state.currentIndex=index
    },
    getDisc(state,obj){//获得推荐歌单
        state.disc=obj
    },
    getTopList(state,toplist){//获得top歌单信息
        state.toplist=toplist
    }
}


export default mutations
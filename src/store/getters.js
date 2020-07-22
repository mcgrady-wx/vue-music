const getters={
    singerDetail(state){//歌手信息
        return state.singer
    },
    playing(state){//是否播放
        return state.playing
    },
    fullScreen(state){//是否全屏
        return state.fullScreen
    },
    playlist(state){//播放列表
        return state.playlist
    },
    sequenceList(state){//顺序播放列表
        return state.sequenceList
    },
    mode(state){//播放类型
        return state.mode
    },
    currentIndex(state){//当前播放歌曲序号
        return state.currentIndex
    },
    currentSong(state){//当前播放歌曲信息
        return state.playlist[state.currentIndex]
    },

}


export default getters
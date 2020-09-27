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
    sequenceList(state){//顺序播放列表（显示出来的歌曲列表）
        return state.sequenceList
    },
    mode(state){//播放类型
        return state.mode
    },
    currentIndex(state){//当前播放歌曲序号
        return state.currentIndex
    },
    currentSong(state){//当前播放歌曲信息 ，没有就返回一个空数组，避免刚点击的时候还没获取到报错
        return state.playlist[state.currentIndex] || {}
    },
    disc(state){//推荐歌单
        return state.disc
    },
    toplist(state){//top歌单信息
        return state.toplist
    },
    searchHistory(state){//搜索历史记录
        return state.searchHistory
    },
    playHistory(state){//播放历史记录
        return state.playHistory
    }
}


export default getters
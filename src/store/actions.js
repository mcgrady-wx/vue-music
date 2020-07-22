const actions={
    selectPlay({commit,state},{list,index}){//开启播放器,处理多个mutations
        commit('getPlaylist',list)//设置播放列表
        commit('getSequenceList',list)//设置顺序播放列表
        commit('getCurrentIndex',index)//设置当前播放歌曲序号
        commit('getPlaying',true)//设置开始播放
        commit('getFullScreen',true)//设置全屏播放
    }
}

export default actions
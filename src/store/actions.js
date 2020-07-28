import { shuffle } from '../common/js/util.js'
import { playMode } from './config'

const actions={
    selectPlay({commit,state},{list,index}){//开启播放器,处理多个mutations
        commit('getPlaylist',list)//设置播放列表
        commit('getSequenceList',list)//设置顺序播放列表
        commit('getCurrentIndex',index)//设置当前播放歌曲序号
        commit('getPlaying',true)//设置开始播放
        commit('getFullScreen',true)//设置全屏播放
    },
    randomPlay({commit},{list}){//开启播放器，随机播放,处理多个mutations
        let randomlist=shuffle(list)//打乱播放列表
        commit('getPlaylist',randomlist)//设置播放列表
        commit('getMode',playMode.random)//设置播放类型为随机播放
        commit('getSequenceList',list)//设置顺序播放列表
        commit('getCurrentIndex',0)//设置当前播放歌曲序号，就从第一首随机播放
        commit('getPlaying',true)//设置开始播放
        commit('getFullScreen',true)//设置全屏播放
    },
}

export default actions
import { shuffle } from '../common/js/util.js'
import { playMode } from './config'

function findIndex(list, song) {//的到歌曲在列表中的下标
    return list.findIndex((item) => {
      return item.id === song.id
    })
}

const actions={
    selectPlay({commit,state},{list,index}){//开启播放器,处理多个mutations
        //存在BUG，如果刚开始直接点击随机播放歌单后，在去单独点某一首歌曲，歌单会改变变成原始的顺序列表
        if (state.mode === playMode.random) {//如果是随机播放模式
            index = findIndex(state.playlist, list[index])//获得歌曲在现有的播放列表中的下标，不设置播放列表
        } else {//如果不是随机播放就设置播放播放列表
            commit('getPlaylist',list)//设置播放列表
        }
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
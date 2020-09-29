import { shuffle } from '../common/js/util.js'
import { playMode } from './config'
import {saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite} from '../common/js/cache'

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
        commit('getSequenceList',list)//设置顺序播放列表（显示出来的歌曲列表）
        commit('getCurrentIndex',index)//设置当前播放歌曲序号
        commit('getPlaying',true)//设置开始播放
        commit('getFullScreen',true)//设置全屏播放
    },
    randomPlay({commit},{list}){//开启播放器，随机播放,处理多个mutations
        let randomlist=shuffle(list)//打乱播放列表
        commit('getPlaylist',randomlist)//设置播放列表
        commit('getMode',playMode.random)//设置播放类型为随机播放
        commit('getSequenceList',list)//设置顺序播放列表（显示出来的歌曲列表）
        commit('getCurrentIndex',0)//设置当前播放歌曲序号，就从第一首随机播放
        commit('getPlaying',true)//设置开始播放
        commit('getFullScreen',true)//设置全屏播放
    },
    insertSong({commit,state},song){//添加歌曲到播放列表，并且播放当前添加的歌曲
        let playlist = state.playlist.slice() //获得当前的播放列表
        let sequenceList = state.sequenceList.slice() //获得当前顺序播放的播放列表
        let currentIndex = state.currentIndex //获得当前播放歌曲的下标
        // 记录当前歌曲
        let currentSong = playlist[currentIndex]
        //处理playlist播放列表
        // 查找当前列表中是否有待插入的歌曲并返回其索引
        let fpIndex = findIndex(playlist, song)
        // 因为是在当前播放歌曲后面插入歌曲，所以索引+1
        currentIndex++
        // 插入歌曲
        playlist.splice(currentIndex, 0, song)
        //判断当前列表是否存在要添加的歌曲，如果当前添加的歌曲已经存在与播放列表，判断插入的位置是在原歌曲的前面或者后面，删除原歌曲
        if (fpIndex>-1) {//存在
            if (currentIndex>fpIndex) {//插入的位置是在原歌曲后面，表示原歌曲索引不变，直接删除
                playlist.splice(fpIndex, 1) //删除原歌曲
                currentIndex-- //数组删除了一个元素，当前播放的歌曲索引就要减一
            } else {//插入的位置是在原歌曲前面，表示原歌曲向后移动一位，索引加一，因为插入的歌曲在前面，当前播放的歌曲下标索引不变
                playlist.splice(fpIndex + 1, 1) 
            }
        }
        
        //同理处理sequenceList顺序播放列表
        //获得将要插入歌曲的插入点下标，在当前播放歌曲的后面一位
        let currentSIndex = findIndex(sequenceList, currentSong) + 1
        //查找当前列表中是否有待插入的歌曲并返回其索引
        let fsIndex = findIndex(sequenceList, song)
        //插入歌曲
        sequenceList.splice(currentSIndex, 0, song)
        //判断当前列表是否存在要添加的歌曲，如果当前添加的歌曲已经存在与播放列表，判断插入的位置是在原歌曲的前面或者后面，删除原歌曲
        if (fsIndex > -1) {//存在
            if (currentSIndex > fsIndex) {//插入的位置是在原歌曲后面，表示原歌曲索引不变，直接删除
                sequenceList.splice(fsIndex, 1)
            } else {//插入的位置是在原歌曲前面，表示原歌曲向后移动一位，索引加一，因为插入的歌曲在前面，当前播放的歌曲下标索引不变
                sequenceList.splice(fsIndex + 1, 1)
            }
        }

        //设置mutations
        commit('getPlaylist',playlist)//设置播放列表
        commit('getSequenceList',sequenceList)//设置顺序播放列表（显示出来的歌曲列表）
        commit('getCurrentIndex',currentIndex)//设置当前播放歌曲序号
        commit('getPlaying',true)//设置开始播放
        commit('getFullScreen',true)//设置全屏播放
    },
    saveSearchHistory({commit},query){//新增历史记录，得到新的搜索历史记录，并保存到本地
        commit('getSearchHistory',saveSearch(query)) 
    },
    deleteSearchHistory({commit},query){//删除历史记录，得到新的搜索历史记录，并保存到本地
        commit('getSearchHistory',deleteSearch(query)) 
    },
    clearSearchHistory({commit}){//清空历史记录，并保存到本地
        commit('getSearchHistory',clearSearch()) 
    },
    deleteSong({commit,state},song){//删除播放列表的一首歌曲
        let playlist = state.playlist.slice() //获得当前的播放列表
        let sequenceList = state.sequenceList.slice() //获得当前顺序播放的播放列表
        let currentIndex = state.currentIndex //获得当前播放歌曲的下标
        //删除在播放列表的歌曲
        let pIndex = findIndex(playlist, song)
        playlist.splice(pIndex,1)
        //删除在顺序播放列表的歌曲
        let sIndex = findIndex(sequenceList, song)
        sequenceList.splice(sIndex,1)

        if (currentIndex > pIndex || currentIndex === playlist.length) {//表示当前播放歌曲在要删除的歌曲后面
            currentIndex--
          }
        //改变播放列表 顺序播放列表 当前播放歌曲下标
        commit('getPlaylist',playlist)//设置播放列表
        commit('getSequenceList',sequenceList)//设置顺序播放列表（显示出来的歌曲列表）
        commit('getCurrentIndex',currentIndex)//设置当前播放歌曲序号

        //如果播放列表为空,改变播放状态
        if (!playlist.length) {
            commit('getPlaying',false)
        } else {
            commit('getPlaying',true)
        }
    },
    deleteSongList({commit}){//清空歌曲播放列表
        //把playlist、sequenceList、currentIndex、playing四个的值设置为初始值
        commit('getPlaylist',[])//设置播放列表
        commit('getSequenceList',[])//设置顺序播放列表（显示出来的歌曲列表）
        commit('getCurrentIndex',-1)//设置当前播放歌曲序号
        commit('getPlaying',false)
    },
    savePlayHistory({commit},song){//新增播放历史记录，得到新的搜索历史记录，并保存到本地
        commit('getPlayHistory',savePlay(song)) 
    },
    saveFavoriteList({commit},song){//添加收藏歌曲
        commit('geFavoriteList',saveFavorite(song)) 
    },
    deleteFavoriteList({commit},song){//取消收藏
        commit('geFavoriteList',deleteFavorite(song)) 
    }
}

export default actions
import { playMode } from './config'
import {loadSearch, loadPlay, loadFavorite} from '../common/js/cache'

const state={
    singer:{} ,//歌手信息
    playing: false,     //是否播放
    fullScreen: false, //是否全屏显示播放器
    playlist: [], //播放列表
    sequenceList: [], //顺序播放列表（显示出来的歌曲列表）
    mode: playMode.sequence, //播放类型，默认顺序播放
    currentIndex: -1, //当前播放歌曲的序号
    disc:{}, //推荐列表信息
    toplist:{}, //top歌单信息
    searchHistory: loadSearch(),//搜索的历史纪录
    playHistory: loadPlay(), //播放历史记录
}


export default state
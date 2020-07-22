import { playMode } from './config'

const state={
    singer:{} ,//歌手信息
    playing: false,     //是否播放
    fullScreen: false, //是否全屏显示播放器
    playlist: [], //播放列表
    sequenceList: [], //顺序播放列表
    mode: playMode.sequence, //播放类型，默认顺序播放
    currentIndex: -1, //当前播放歌曲的序号
}


export default state
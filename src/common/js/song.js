import {getLyric} from '../../api/song'
import {ERR_OK} from '../../api/config'
import {Base64} from 'js-base64'


//创建了一个工厂方法，通过传入歌曲列表数据得到自己一个自己想要的歌曲对象数组

export default class Song {//歌曲对象
  constructor({id, mid, singer, name, album, duration, image, url,strMediaMid}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.strMediaMid = strMediaMid
  }

  getLyric() {//给每个歌曲对象封装一个方法获取到当前歌曲的歌词
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {//工厂方式创建歌曲对象
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://113.142.51.14/amobile.music.tc.qq.com/C400${musicData.strMediaMid}.m4a?guid=1712033339&vkey=7ADF59EB42A861F2F1D6C1FA6188AF73F8467AA1D19E0F61D5A79482F72E25F12F655220B804F03A8625FAFCBA1454B6F01A0E4FB1BA879F&uin=0&fromtag=66`,
    strMediaMid:musicData.strMediaMid
  })
}

function filterSinger(singer) {//处理歌手名字显示
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}


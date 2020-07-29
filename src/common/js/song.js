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
    url: `http://223.221.162.25/amobile.music.tc.qq.com/C400${musicData.strMediaMid}.m4a?guid=1712033339&vkey=82E5B4477ECAD1652D74C8416CDC252E4C4A12D76E64E67A655BC77E3567EFA4958CA254FFD33A5A3FA5927FC74AA6C20F61B38A13B3AB92&uin=0&fromtag=66`,
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


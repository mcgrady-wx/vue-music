import jsonp from '../common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

//获取歌手列表
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

//歌手歌曲详单
export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}

//获取歌曲vkey
export function getSongVkey(songmid) {
  const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
  const data = Object.assign({}, {
    '-': 'getplaysongvkey7736273453744789',
    'g_tk': '1134770451',
    'sign': 'zzaebsfvg4ji8i6hd5p0c000441001b60ab35424bf91be50f1c',
    'loginUin': '384989937',
    'hostUin': 0,
    'format': 'json',
    'inCharset': 'utf8',
    'outCharset': 'utf-8',
    'notice': 0,
    'platform': 'yqq.json',
    'needNewCode': 0,
    'data': {"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"1712033339","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"1712033339","songmid":[`{singmid}`],"songtype":[0],"uin":"384989937","loginflag":1,"platform":"20"}},"comm":{"uin":384989937,"format":"json","ct":24,"cv":0}}
  })
  return axios.get('/api',{params:data}).then((res)=>{
    return Promise.resolve(res,data)
  })
  //return jsonp(url, datas)
}
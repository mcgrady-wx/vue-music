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
  const url = '/api/vkey'
  const data = Object.assign({}, {
    '-': 'getplaysongvkey25481922296110193',
    'g_tk': '5381',
    'sign': 'zzadepq27vnnojgn4822c261c850d12c82720db876d2b1c0',
    'loginUin': 0,
    'hostUin': 0,
    'format': 'json',
    'inCharset': 'utf8',
    'outCharset': 'utf-8',
    'notice': 0,
    'platform': 'yqq.json',
    'needNewCode': 0,
    'data': {"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"1712033339","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"1712033339","songmid":[`${songmid}`],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}
  })
  return axios.get(url,{params:data}).then((res)=>{
    return Promise.resolve(res,data)
  })
  //return jsonp(url, datas)
}
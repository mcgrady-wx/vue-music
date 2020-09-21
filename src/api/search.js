import jsonp from '../common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getHotKey() {//获取到热门搜索
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

// export function search(query, page, zhida, perpage) {
//   const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

//   const data = Object.assign({}, commonParams, {
//     w: query,
//     p: page,
//     perpage,
//     n: perpage,
//     catZhida: zhida ? 1 : 0,
//     zhidaqu: 1,
//     t: 0,
//     flag: 1,
//     ie: 'utf-8',
//     sem: 1,
//     aggr: 0,
//     remoteplace: 'txt.mqq.all',
//     uin: 0,
//     needNewCode: 1,
//     platform: 'h5'
//   })

//   return jsonp(url, data, options)
// }

//获取搜索结果
export function search(query, page, zhida, perpage) {
  const url = '/api/search'
  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return axios.get(url,{params:data}).then((res)=>{
    var strD = res.data.replace('callback(', '')
		var str = strD.substring(0, strD.length - 1)
    var strF = JSON.parse(str)
    return strF
    //return Promise.resolve(res,data)
  })
  //return jsonp(url, datas)
}
import storage from 'good-storage' //第三方本地存储插件

const SEARCH_KEY = '__search__' //搜索存储
const SEARCH_MAX_LEN = 15       //最大存储15条数据

const PLAY_KEY = '__play__' //播放历史
const PLAY_MAX_LEN = 200   //最大播放历史存储量

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) { // 自定义方法，添加获得一个新数组， 第一个参数是当前数组 第二个参数是当前要插入的数据 第三个参数是比较函数 第四个参数是数组最大长度
  const index = arr.findIndex(compare) //查找当前数组中是否有要插入的数据
  if (index === 0) {//表示当前要插入的数据在数组第一个，不做任何操作
    return
  }
  if (index > 0) {//表示当前要插入的数据在数组中，删除原数据
    arr.splice(index, 1)
  }
  arr.unshift(val)//新数据保存到头部
  if (maxLen && arr.length > maxLen) { //如果数组长度大于了15，删除最后一个
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {//自定义方法，删除获得一个新数组， 第一个参数是当前数组 第二个参数是比较函数
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {//添加数据，保存数据结果到本地
  let searches = storage.get(SEARCH_KEY, []) //获取之前保存的本地数据
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN) //得到新的数据
  storage.set(SEARCH_KEY, searches) //设置新的本地存储
  return searches
}

export function deleteSearch(query) {//删除数据，保存数据结果到本地
  let searches = storage.get(SEARCH_KEY, [])//获取之前保存的本地数据
  deleteFromArray(searches, (item) => {
    return item === query
  })//得到新的数据
  storage.set(SEARCH_KEY, searches)//设置新的本地存储
  return searches
}

export function clearSearch() {//清空历史记录
  storage.remove(SEARCH_KEY)//删除本地存储
  return []
}

export function loadSearch() {//获得新的本地存储数据
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {//添加播放历史
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs) //保存到本地
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}


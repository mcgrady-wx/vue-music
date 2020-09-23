//功能性通用小方法


function getRandomInt(min, max) {//获得最小值-最大值的随机数 包括最大值和最小值
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {//打乱数组
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, delay) {//请求节流，节约请求次数
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
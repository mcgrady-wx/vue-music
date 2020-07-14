// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//全局引入mint-ui和ui样式
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
//全局注册
Vue.use(MintUI)

//图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
    loading:require('./common/image/default.png'),
})

//使用axios发送请求
import axios from 'axios'
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios

//引入全局的样式
import './common/stylus/index.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

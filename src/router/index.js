import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../pages/recommend/recommend.vue'
import Singer from '../pages/singer/singer.vue'
import Rank from '../pages/rank/rank.vue'
import Search from '../pages/search/search.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/recommend'  //设置重定向，默认显示页面
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})

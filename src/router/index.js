import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../pages/recommend/recommend.vue'
import Singer from '../pages/singer/singer.vue'
import Rank from '../pages/rank/rank.vue'
import Search from '../pages/search/search.vue'
import SingerDetail from '../pages/singer-detail/singerDetail.vue'
import DiscDetail from '../pages/disc-detail/discDetail.vue'
import TopList from '../pages/top-list/top-list.vue'
import UserCenter from '../pages/user-center/user-center.vue'

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
      component: Recommend,
      children:[
        {
          path:':id',
          component:DiscDetail
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children:[
        {
          path:':id',
          component:TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: UserCenter
    }
  ]
})

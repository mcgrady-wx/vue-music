import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from '../pages/recommend/recommend.vue'
// import Singer from '../pages/singer/singer.vue'
// import Rank from '../pages/rank/rank.vue'
// import Search from '../pages/search/search.vue'
// import SingerDetail from '../pages/singer-detail/singerDetail.vue'
// import DiscDetail from '../pages/disc-detail/discDetail.vue'
// import TopList from '../pages/top-list/top-list.vue'
// import UserCenter from '../pages/user-center/user-center.vue'

Vue.use(Router)

//使用路由懒加载加载组件，实现代码优化
const Recommend = (resolve) => {
  import('../pages/recommend/recommend.vue').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('../pages/singer/singer.vue').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('../pages/rank/rank.vue').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('../pages/search/search.vue').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('../pages/singer-detail/singerDetail.vue').then((module) => {
    resolve(module)
  })
}

const DiscDetail = (resolve) => {
  import('../pages/disc-detail/discDetail.vue').then((module) => {
    resolve(module)
  })
}

const TopList = (resolve) => {
  import('../pages/top-list/top-list.vue').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('../pages/user-center/user-center.vue').then((module) => {
    resolve(module)
  })
}



export default new Router({
  mode:'hash',
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

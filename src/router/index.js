import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login/login'
// @->src   @自动指向src
import Login from '@/components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/users/users.vue'
import Houselist from '@/components/house/houselist.vue'
import Housechecklist from '@/components/house/Housechecklist.vue'
import Orderlist from '@/components/orders/orderlist.vue'
import Fail from '@/components/fail.vue'

import {Message} from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'fail',
      path: '/fail',
      component: Fail
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      redirect: '/users',
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },
      {
        name: 'houselist',
        path: '/houselist',
        component: Houselist
      },
      {
        name: 'housechecklist',
        path: 'housechecklist',
        component: Housechecklist
      },
      {
        name: 'orders',
        path: '/orders',
        component: Orderlist
      }
      ]
    }
  ]
})

// 在路由配置生效之前 统一判断token
// 路由守卫 在路由配置生效之前
// to -> 要去的路由配置
// from -> 当前的路由配置
// next() 下一步,让当前路由配置继续生效
router.beforeEach((to, from, next) => {
  console.log(to, from)
  // 如果要去的是登录
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录') // 这个Message也是单独应用的
      router.push({ // 这里没有this.$router 所以直接使用router
        name: 'login'
      })
      return
    }
    next()
  }
})

export default router

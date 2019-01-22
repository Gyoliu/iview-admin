import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { getToken, setToken, canTurnTo, getMenus, getRouteNameByPath, hasAccess } from '@/libs/util'
import config from '@/config'
const { homeName } = config
// https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html
Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior: () => ({ y: 0 })
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  let caidan = routes
  if (store.state.app.menusList.length > 0) {
    caidan = caidan.concat(store.state.app.menusList)
  }
  if (canTurnTo(to.name, access, caidan)) {
    console.log('to:' + to.name)
    next() // 有权限，可访问
  } else {
    console.log('to:error_401')
    next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
  }
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.app.menusList.length === 0) {
      store.dispatch('getUserInfo').then(async () => {
        const menus = await getMenus()
        store.commit('setMenusList', menus)
        router.addRoutes(menus)
        router.options.routes = router.options.routes.concat(menus)
        // 根据path 找name
        let item = getRouteNameByPath(menus, to.path)
        if (item && hasAccess(store.state.user.access, item) && (to.path === item.path || to.path.endsWith(item.path))) {
          console.log('next to path :' + to.path)
          next(to.path)
        } else {
          turnTo(to, store.state.user.access, next)
        }
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    } else {
      // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
      turnTo(to, store.state.user.access, next)
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router

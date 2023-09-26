import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist白名单：不需要权限可直接进入
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // console.log(to.path);
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasGetUserInfo = store.getters.user//获取本地用户信息

  if(to.meta.auth) {
    // 页面需要鉴权
    if(hasGetUserInfo){
      // vuex中有用户信息 直接放行
      next();
    }else{
      // 没有用户信息 判断是否有token
      const hasToken = localStorage.getItem('adminToken');
      if(hasToken){
        // 有token 验证token是否有效
        try{
          // token有效 
          await store.dispatch('user/getInfo')//相当于前台页面中的whoAmI
          next()
        }catch(error){
          // token无效无法通过getInfo拿到用户信息 需要重置token
          await store.dispatch('user/reserToken');
          Message.error('登录过期，请重新登录');
          // 重新登录成功之后导航到之前的path
          next(`/login?redirect=${to.path}`);
          NProgress.done()//加载完成
        }
        
      }else{
        //说明没有token 重新登录
        next(`/login?redirect=${to.path}`);
        NProgress.done()//加载完成
      }
    }
  }else{
    // 页面不需要鉴权
    if(to.path === '/login' && hasGetUserInfo){
      // 页面去的是login页面且目前是登录状态
      next({path:'/'});
    }else{
      next();
    }
    NProgress.done()//加载完成
}

  // 下方是vue element admin原有的鉴权流程
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     // 进的不是login页面，看一下是否有用户信息
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       // 没有用户信息，但是有token，接下来使用localStorage里的token去服务器拿用户信息
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')
  //         next()
  //       } catch (error) {
  //         // 说明token有问题
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   // 判断是否是白名单
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly如果是白名单，则直接跳转
  //     next()//直接放行
  //   } else {
  //     // 进入的路径不在白名单里面
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

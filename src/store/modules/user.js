import { loginApi, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '..'

const getDefaultState = () => {
  return {
    user:null,//存储登陆后的用户信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_USER:(state,payload) => {
    state.user = payload
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // userInfo是用户提交的数据
    return new Promise((resolve, reject) => {
      loginApi(userInfo).then((resp) => {
        const { data } = resp;//解构
        if(data){
          // data有数据
          commit('SET_USER',data);
          resolve();
          // console.log(data)
        }else{
          reject(resp);
        }
      }).catch(error => {
        reject(error);
      })
    })
    
    // const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info恢复登录状态
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 发送请求
      getInfo().then((resp)=> {
        if(typeof resp === 'string'){
          // 说明未登录或token已过期
          resp = JSON.parse(resp);//将字符串转为对象
          if(resp.code === 401){
            reject(resp.msg);
          }
         
        }else{
          // 验证成功 返回的是一个对象
          commit('SET_USER',resp.data);
          resolve();
        }
        // console.log(resp)
      })



      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     return reject('Verification failed, please Login again.')
      //   }

      //   const { name, avatar } = data

      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first 从localStorage中移除token
      resetRouter() //重置路由
      commit('RESET_STATE')
      resolve()

      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token 重置token
  resetToken({ commit }) {
    console.log({commit});
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  } 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


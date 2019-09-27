import {
  login,
  logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import md5 from 'js-md5'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, { token, expiresTime }) {
      state.token = token
      setToken(token, expiresTime)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()
      password = md5(password)
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(async res => {
          if (res.headers['content-type'] === 'text/html') {
            resolve(res)
          }
          const data = res.data
          commit('setToken', {
            token: data.data.oauth2AccessToken.access_token,
            expiresTime: (data.data.oauth2AccessToken.expires_in + 8 * 60 * 60) / 60 / 60 / 24
          })
          // commit('setAvator', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png')
          commit('setAvator', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80')
          commit('setUserName', data.data.userInfo.firstName)
          commit('setUserId', data.data.userInfo.id)
          let role = []
          data.data.oauth2AccessToken.authenticate.authorities.forEach(x => { role.push(x['authority'].replace('ROLE_', '').toLowerCase()) })
          commit('setAccess', role)
          commit('setHasGetInfo', true)
          sessionStorage.setItem('userInfo', JSON.stringify({
            userId: data.data.userInfo.id,
            username: data.data.username,
            role: role
          }))
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        logout(userInfo.userId).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
        commit('setToken', '')
        commit('setAccess', [])
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
          getUserInfo(userInfo.username).then(res => {
            const data = res.data
            commit('setToken', {
              token: data.data.oauth2AccessToken.access_token,
              expiresTime: (data.data.oauth2AccessToken.expires_in + 8 * 60 * 60) / 60 / 60 / 24
            })
            commit('setAvator', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80')
            commit('setUserName', data.data.userInfo.firstName)
            commit('setUserId', data.data.userInfo.id)
            let role = []
            data.data.oauth2AccessToken.authenticate.authorities.forEach(x => { role.push(x['authority'].replace('ROLE_', '').toLowerCase()) })
            commit('setAccess', role)
            commit('setHasGetInfo', true)
            // commit('setMenusList')

            resolve(role)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount({}).then(res => {
        commit('setMessageCount', res.data.data)
      }).catch(e => {
        commit('setMessageCount', 0)
        console.error(e)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage({ searchKey: 'status', searchValue: 0, page: { num: 0, size: 0 } }).then(res => {
          commit('setMessageUnreadList', res.data.data.list)
          resolve()
        }).catch(error => {
          reject(error)
        })
        getMessage({ searchKey: 'status', searchValue: 1, page: { num: 0, size: 0 } }).then(res => {
          commit('setMessageReadedList', res.data.data.list)
          resolve()
        }).catch(error => {
          reject(error)
        })
        getMessage({ searchKey: 'status', searchValue: 2, page: { num: 0, size: 0 } }).then(res => {
          commit('setMessageTrashList', res.data.data.list)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(id).then(res => {
            const content = res.data.data
            commit('updateMessageContentStore', { id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead([{ id: msg_id }]).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded([{ id: msg_id }]).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

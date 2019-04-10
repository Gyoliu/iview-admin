import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    'username': userName,
    'password': password
  }
  return axios.request({
    url: '/login',
    params: data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const resetPassword = (paramData) => {
  return axios.request({
    url: '/user/reset/password',
    method: 'post',
    data: paramData
  })
}

export const userRegister = (paramData) => {
  return axios.request({
    url: '/user/register',
    method: 'post',
    data: paramData
  })
}

export const getUserOnlineData = (param) => {
  return axios.request({
    url: '/user/online',
    method: 'post',
    data: param
  })
}

export const getUserMenus = async () => {
  let res = await axios.request({
    url: '/system/menus',
    method: 'post'
  })
  return new Promise((resolve, reject) => {
    if (res.status === 200) {
      resolve(res)
    } else {
      reject(res)
    }
  })
}

export const getUserInfo = (username) => {
  return axios.request({
    url: '/user/info',
    method: 'get',
    params: {
      username
    }
  })
}

export const logout = (userId) => {
  return axios.request({
    url: '/logout',
    method: 'post',
    params: {
      userId: userId
    }
  })
}

export const getUnreadCount = (param) => {
  return axios.request({
    url: '/system/notice/countUserNotice',
    method: 'post',
    data: param
  })
}

export const getMessage = (param) => {
  return axios.request({
    url: '/system/notice/selectUserNotice',
    method: 'post',
    data: param
  })
}

export const createNotice = (paramData) => {
  return axios.request({
    url: '/system/notice/addNotice',
    method: 'post',
    data: paramData
  })
}

export const getContentByMsgId = (id) => {
  return axios.request({
    url: '/system/notice/content',
    method: 'get',
    params: {
      id
    }
  })
}

export const hasRead = param => {
  return axios.request({
    url: '/system/notice/readNotice',
    method: 'post',
    data: param
  })
}

export const removeReaded = param => {
  return axios.request({
    url: '/system/notice/deleteNotice',
    method: 'post',
    data: param
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

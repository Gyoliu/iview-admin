import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    'username': userName,
    'password': password
  }
  return axios.request({
    url: '/api/login',
    params: data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getUserOnlineData = (param) => {
  return axios.request({
    url: '/api/user/online',
    method: 'post',
    data: param
  })
}

export const getUserMenus = async () => {
  let res = await axios.request({
    url: '/api/system/menus',
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
    url: '/api/user/info',
    method: 'get',
    params: {
      username
    }
  })
}

export const logout = (userId) => {
  return axios.request({
    url: '/api/logout',
    method: 'post',
    params: {
      userId: userId
    }
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
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

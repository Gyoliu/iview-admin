import axios from 'axios'
// import store from '@/store'
import { Message } from 'iview'
import { getToken } from '@/libs/util'

// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Authorization': 'bearer ' + getToken()
      },
      withCredentials: true
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // 不建议开启，因为界面不友好
        // Spin.show()
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status, headers, request } = res
      return { data, status, headers, request }
    }, error => {
      const status = error.response ? error.response.status : 200
      if (status === 401) {
        Message.error({
          content: error.response.data.message + ' 请重新登入！',
          duration: 6
        })
      } else if (status === 403) {
        Message.error({
          content: error.response.data.message,
          duration: 6
        })
      } else if (status === 500) {
        Message.error({
          content: '服务器异常！' + error.response.data.message,
          duration: 6
        })
      } else if (status === 400) {
        Message.error({
          content: '参数错误！' + error.response.data.message,
          duration: 6
        })
      }
      this.destroy(url)
      // addErrorLog(error.response)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest

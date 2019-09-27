import { getToken } from './util'
import config from '@/config'
var Stomp = require('stompjs')

class WebSocketStomp {
  connect (success, fail) {
    const headers = {
      'Authorization': 'bearer ' + getToken()
    }
    const client = Stomp.client(config.websocketUrl)
    if (!window.stomp || !this.connected()) {
      client.connect(headers, success, fail)
      window.stomp = client
    }
    return window.stomp
  }
  subscribe (url, fun) {
    window.stomp.subscribe(url, fun)
  }
  send (url, header, message) {
    window.stomp.send(url, header, message)
  }
  connected () {
    return window.stomp.connected
  }
}

const webSocketStomp = new WebSocketStomp()
export default webSocketStomp

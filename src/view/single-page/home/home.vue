<template>
  <div>
    <Button @click="initWebSocket" @keyup.enter.native="initWebSocket" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;链接</Button>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { getToken } from '@/libs/util'
// var Stomp = require('stompjs')

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        {value: 335, name: '直接访问'},
        {value: 310, name: '邮件营销'},
        {value: 234, name: '联盟广告'},
        {value: 135, name: '视频广告'},
        {value: 1548, name: '搜索引擎'}
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      websocket: null
    }
  },
  created () {
    this.initWebSocket()
  },
  methods: {
    initWebSocket () {
      const headers = {
        'Authorization': 'bearer ' + getToken()
      }
      const client = this.$Stomp.client(this.$config.websocketUrl)
      client.connect(headers, frame => {
        client.subscribe('/topic/nf', data => {
          console.info(data)
        })
        client.subscribe('/user/queue/chat', data => {
          console.info(data)
        })
        client.subscribe('/queue/errors', data => {
          console.info(data)
        })
        // client.send("/queue/test", {priority: 9}, "Hello, STOMP");
        client.send('/app/ws/chat', {priority: 9}, 'Hello, STOMP')
        client.send('/app/ws/nf', {priority: 9}, 'Hello, STOMP,nf')
      }, frame => {
        console.log(frame)
        console.log('websocket失去连接')
      })
      // this.websocket = new WebSocket('ws://localhost:1111/socket')
      // this.websocket.onopen = this.websocketonopen
      // this.websocket.onerror = this.websocketonerror
      // this.websocket.onmessage = this.websocketonmessage
      // this.websocket.onclose = this.websocketclose
    },
    websocketonopen () {
      console.log('WebSocket连接成功')
    },
    // 错误
    websocketonerror (e) {
      console.log('WebSocket连接发生错误:' + JSON.stringify(e))
    },
    // 数据接收
    websocketonmessage (e) {
      // 注意：长连接我们是后台直接1秒推送一条数据，
      // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
      // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
      console.log(e)
    },
    // 数据发送
    websocketsend (agentData) {
      this.websocket.send(agentData)
    },
    // 关闭
    websocketclose (e) {
      console.log('connection closed (' + e.code + ')')
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>

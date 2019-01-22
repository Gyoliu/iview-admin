<template>
  <i-form :model="user" :label-width="80">
    <Form-item label="账号：">
      <div>{{user.username}}</div>
    </Form-item>
    <Form-item label="FirstName：">
      <div>{{userInfo.firstName}}</div>
    </Form-item>
    <Form-item label="LastName：">
      <div>{{userInfo.lastName}}</div>
    </Form-item>
    <Form-item label="Email：">
      <div>{{userInfo.email}}</div>
    </Form-item>
    <Form-item label="电话：">
      <div>{{userInfo.phoneNumber}}</div>
    </Form-item>
    <Form-item label="角色：">
      <div>{{sysRole.role}}</div>
    </Form-item>
  </i-form>
</template>

<script>
import { getUserInfo } from '@/api/user'

export default {
  name: 'personalCenter',
  data () {
    return {
      user: {},
      userInfo: {},
      sysRole: {}
    }
  },
  methods: {
    getUserInfoData () {
      const username = JSON.parse(sessionStorage.getItem('userInfo')).username
      getUserInfo(username).then(res => {
        this.user = res.data.data
        this.userInfo = res.data.data.userInfo
        this.sysRole = res.data.data.sysRole
      })
    }
  },
  mounted () {
    this.getUserInfoData()
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="user-avator-dropdown name-class">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="updatePassword">修改密码</DropdownItem>
        <DropdownItem name="personalCenter">个人中心</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Modal v-model="updatePasswordModel" @on-ok="updatePassword" draggable scrollable title="修改密码">
      <Form :model="formItem" :rules="ruleValidate" :label-width="120">
        <FormItem label="旧密码：" prop="password">
          <Input v-model="formItem.password" type="password" placeholder="请输入旧密码"></Input>
        </FormItem>
        <FormItem label="新密码：" prop="resetPassword1">
          <Input v-model="formItem.resetPassword1" type="password" placeholder="请输入新密码"></Input>
        </FormItem>
        <FormItem label="再次输入新密码：" prop="resetPassword">
          <Input v-model="formItem.resetPassword" type="password" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>

</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { resetPassword } from '@/api/user'
import md5 from 'js-md5'

export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      updatePasswordModel: false,
      formItem: {
        password: '',
        resetPassword1: '',
        resetPassword: '',
        username: ''
      },
      ruleValidate: {
        password: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        resetPassword1: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        resetPassword: [
          { required: true, message: '再次输入新密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      }).catch(err => {
        console.log(err)
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    personalCenterMethod () {
      this.$router.push({
        name: 'user_personal_center'
      })
    },
    showUpdatePasswordModel () {
      this.updatePasswordModel = true
    },
    updatePassword () {
      if (this.formItem.resetPassword !== this.formItem.resetPassword1) {
        this.$Message.warning('两次输入的新不一致，请重新输入')
        return
      }
      this.formItem.username = JSON.parse(sessionStorage.getItem('userInfo')).username
      this.formItem.resetPassword = md5(this.formItem.resetPassword)
      this.formItem.resetPassword1 = md5(this.formItem.resetPassword1)
      this.formItem.password = md5(this.formItem.password)
      resetPassword(this.formItem).then(res => {
        if (res.data.code === 200) {
          this.updatePasswordModel = false
          this.$Message.success('修改密码成功！')
        } else {
          this.updatePasswordModel = true
          this.$Message.warning(res.data.message)
        }
      }).catch(e => {
        this.updatePasswordModel = true
        console.error(e)
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'personalCenter': this.personalCenterMethod()
          break
        case 'updatePassword': this.showUpdatePasswordModel()
          break
      }
    }
  }
}
</script>
<style>
  .name-class .ivu-avatar {
    // width: 100px;
    text-align:center;
  }

</style>

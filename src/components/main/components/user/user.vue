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
        <DropdownItem v-if="role.indexOf('admin') > -1" name="notice">创建系统公告</DropdownItem>
        <DropdownItem name="updatePassword">修改密码</DropdownItem>
        <DropdownItem name="personalCenter">个人中心</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Modal v-model="updatePasswordModel" :footer-hide="true" draggable scrollable title="修改密码">
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
        <div style="float: right;margin-bottom: 6px;">
          <Button style="margin-right: 5px;" @click="updatePasswordModel = false">关闭</Button>
          <Button type="primary" @click="updatePassword">确定</Button>
        </div>
      </Form>
    </Modal>

    <Modal v-model="noticeModel" :footer-hide="true" draggable scrollable title="创建公告" width="1250px">
      <Form :model="noticeItems" :rules="noticeValidate" :label-width="120" style="width: 1200px;">
        <FormItem label="标题：" prop="title">
          <Input v-model="noticeItems.title" placeholder="标题"></Input>
        </FormItem>
        <FormItem label="公告类型：" prop="noticeType">
          <Select v-model="noticeItems.noticeType" placeholder="请选择" style="width:200px">
            <Option v-for="item in noticeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="内容：" prop="content">
          <div class="editor-wrapper">
            <div :id="editorId"></div>
          </div>
        </FormItem>
        <div style="float: right;margin-bottom: 6px;">
          <Button style="margin-bottom: 10px;margin-right: 5px;" @click="noticeModel = false">关闭</Button>
          <Button style="margin-bottom: 10px;" type="primary" @click="createNotice">确定</Button>
        </div>
      </Form>
    </Modal>
  </div>

</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { resetPassword, createNotice } from '@/api/user'
import md5 from 'js-md5'
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'

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
      noticeModel: false,
      role: JSON.parse(sessionStorage.getItem('userInfo')).role,
      noticeTypes: [
        { label: '发送所有用户', value: 0 },
        { label: '发送指定用户', value: 1 }
      ],
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
      },
      noticeItems: {
        title: '',
        noticeType: 0,
        content: ''
      },
      noticeValidate: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '发送类型不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      editor: null
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.noticeCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.zIndex = 100
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.noticeCache
    if (html) this.editor.txt.html(html)
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
    openCreateNoticeModel () {
      this.noticeModel = true
    },
    createNotice () {
      this.noticeItems.content = this.editor.txt.html()
      createNotice(this.noticeItems).then(res => {
        if (res.data.code === 200) {
          this.noticeModel = false
          this.$Message.success('创建公告成功！')
        } else {
          this.noticeModel = true
          this.$Message.warning(res.data.message)
        }
      }).catch(e => {
        this.noticeModel = true
        console.error(e)
      })
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
        case 'notice': this.openCreateNoticeModel()
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

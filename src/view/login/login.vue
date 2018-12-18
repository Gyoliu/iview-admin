<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">还没有账号?<a href="#">立马注册</a></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { getMenus } from '@/libs/util'

export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(async res => {
        if (res && res.headers['content-type'] === 'text/html') {
          window.location.href = res.request.responseURL
          return
        }

        const muenslist = await getMenus()
        this.$router.addRoutes(muenslist)
        console.log(this.$router)
        this.$router.options.routes = this.$router.options.routes.concat(muenslist)
        this.$store.commit('setMenusList', muenslist)
        // console.log('3333')
        this.$router.push({
          name: this.$config.homeName
        })
      })
    }
  }
}
</script>

<style>

</style>

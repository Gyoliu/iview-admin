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
        if (!sessionStorage.getItem('menusList') || sessionStorage.getItem('menusList').length <= 0) {
          sessionStorage.setItem('menusList', JSON.stringify(muenslist))
        }

        this.$store.state.app.menusList = muenslist
        this.$router.addRoutes(muenslist)

        console.log(this.$router)
        this.$router.push({
          name: this.$config.homeName
        })
        // this.getUserInfo().then(res => {
        //   this.$router.push({
        //     name: this.$config.homeName
        //   })
        // })
      })
    }
  }
}
</script>

<style>

</style>

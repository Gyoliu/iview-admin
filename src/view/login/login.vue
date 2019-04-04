<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :valid="valid" ref="loginForm"></login-form>
          <p class="login-tip">还没有账号?<router-link to="/user/register">立马注册</router-link></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { getMenus } from '@/libs/util'
import routes from '@/router/routers'

export default {
  components: {
    LoginForm
  },
  data () {
    return {
      valid: false
    }
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

        let muenslist = await getMenus()
        muenslist = routes.concat(muenslist)

        this.$router.options.routes = muenslist
        this.$router.addRoutes(muenslist)

        console.info(this.$router)
        this.$store.commit('setMenusList', muenslist)
        this.$router.push({
          name: this.$config.homeName
        })
      }).catch(err => {
        this.$nextTick(() => {
          if (this.$refs.loginForm) {
            this.$refs.loginForm.errFunction()
          }
        })
        console.error(err)
      })
    }
  }
}
</script>

<style>

</style>

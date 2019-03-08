<template>
  <div class="user-register">
    <div class="user-register-con">
      <Card icon="log-in" title='用户注册' :bordered="false">
        <div class="form-con">
          <i-form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
            <Form-item label="姓名" prop="firstName">
              <i-input v-model="formData.firstName" placeholder="请输入姓名"></i-input>
            </Form-item>
            <Form-item label="手机号码" prop="username">
              <i-input v-model="formData.username" placeholder="请输入电话"></i-input>
            </Form-item>
            <Form-item label="邮箱" prop="email">
              <i-input v-model="formData.email" placeholder="请输入邮箱"></i-input>
            </Form-item>
            <!--<Form-item label="城市" prop="city">
              <i-select v-model="formData.city" placeholder="请选择所在地">
                <i-option value="beijing">北京市</i-option>
                <i-option value="shanghai">上海市</i-option>
                <i-option value="shenzhen">深圳市</i-option>
              </i-select>
            </Form-item>
            <Form-item label="选择日期">
              <Row>
                <i-col span="11">
                  <Form-item prop="date">
                    <Date-picker type="date" confirm placeholder="选择日期" format="yyyy-MM-dd" v-model="formData.date"></Date-picker>
                  </Form-item>
                </i-col>
                <i-col span="2" style="text-align: center">-</i-col>
                <i-col span="11">
                  <Form-item prop="time">
                    <Time-picker type="time" confirm placeholder="选择时间" format="HH:mm:ss" v-model="formData.time"></Time-picker>
                  </Form-item>
                </i-col>
              </Row>
            </Form-item>
            <Form-item label="性别" prop="gender">
              <RadioGroup v-model="formData.gender">
                <Radio label="男" value="男">男</Radio>
                <Radio label="女" value="女">女</Radio>
              </RadioGroup>
            </Form-item>
            <Form-item label="爱好" prop="interest">
              <CheckboxGroup v-model="formData.interest">
                <Checkbox label="吃饭" value="吃饭">吃饭</Checkbox>
                <Checkbox label="睡觉" value="睡觉">睡觉</Checkbox>
                <Checkbox label="跑步" value="跑步">跑步</Checkbox>
                <Checkbox label="看电影" value="看电影">看电影</Checkbox>
              </CheckboxGroup>
            </Form-item>-->
            <Form-item label="介绍" prop="remarks">
              <i-input v-model="formData.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
            </Form-item>
            <Form-item>
              <i-button type="primary" @click="handleSubmit('formData')">提交</i-button>
              <i-button type="warning" @click="handleReset('formData')" style="margin-left: 8px">重置</i-button>
              <router-link to="/login">已经注册, 去登入</router-link>
            </Form-item>
          </i-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { userRegister } from '@/api/user'
import { validatePhone } from '@/libs/validate'

export default {
  name: 'userRegister',
  components: {},
  data () {
    return {
      formData: {
        username: '',
        firstName: '',
        remarks: '',
        email: '',
        phoneNumber: ''
      },
      ruleValidate: {
        firstName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { trigger: 'blur', validator: validatePhone }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
        // /* ,remarks: [
        //   { required: true, message: '请输入个人介绍', trigger: 'blur' },
        //   { type: 'string', min: 10, message: '介绍不能少于10字', trigger: 'blur' }
        // ]*/
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const info = {
            username: this.formData.username,
            userInfo: {
              firstName: this.formData.firstName,
              phoneNumber: this.formData.username,
              email: this.formData.email,
              remarks: this.formData.remarks
            }
          }
          userRegister(info).then(res => {
            this.$Message.success('注册成功!您的初始密码为:' + res.data.data.password)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="less">
  .user-register{
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con{
      //position: absolute;
      //right: 260px;
      margin: 0 auto;
      padding-top: 1200px;
      top: 50%;
      transform: translateY(-60%);
      width: 420px;
      &-header{
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }
      .form-con{
        padding: 10px 0 0;
      }
      form{
        width: 360px;
        margin: 0 auto;
        margin-top: 10px;
      }
    }
  }

</style>

<template>
  <div class="login_container">
    <el-form :v-model="user" :rules="loginRules" class="login_form" ref="login_form" :model="user">
      <div class="login_logo"></div>
      <el-form-item prop='mobile'>
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop='code'>
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop='agree'>
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议及隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="login_btn" type="primary" :loading="login_loding" @click="onLogin">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { login_res } from '@/api/user.js'
  export default {
    name: 'LoginIndex',
    components: {},
    props: {},
    data() {
      return {
        user: {
          mobile: '',
          code: '',
          agree:false
        },
        login_loding:false,
        loginRules:{
          mobile:[
            { required: true, message: '手机号不能为空', trigger: 'change' },
            {pattern:/^1[3|4|5|7|8]\d{9}$/,message: '请输入正确的手机号',trigger: 'change'}
          ],
          code:[
            { required: true, message: '验证码不能为空', trigger: 'change' },
            {pattern:/^\d{6}$/,message: '请输入正确的验证码',trigger: 'change'}
          ],
          agree:[
            {validator:(rule,value,callback) => {
              if(value){
                callback()
              }else{
                callback(new Error('请阅读并勾选'))
              }
            }, trigger: 'change'}
          ]
        }
      }
    },
    computed: {},
    watch: {},
    created (){},
    mounted (){},
    methods: {
      onLogin() {
        this.$refs['login_form'].validate(valid => {
          if(!valid){
            return
          }else{
            this.login()
          }
        })
      },
      login() {
        this.login_loding = true;
        login_res(this.user).then(res => {
          this.$message({
            message: '登录成功！',
            type: 'success',
          });
          this.login_loding = false;
          window.localStorage.setItem('user',JSON.stringify(res.data.data))
          this.$router.push('/home')
        }).catch(err => {
          this.$message.error('登录失败！');
          this.login_loding = false;
        })
      }
    }
  }
</script>

<style scoped>
  .login_container{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("./login_bg.jpg") no-repeat;
  }
  .login_form{
    min-width: 260px;
    padding: 30px;
    background-color: #fff;
    border-radius: 3px;
  }
  .login_btn{
    width: 100%;
  }
  .login_logo{
    width: 260px;
    height: 70px;
    background: url("./toutiao.png") no-repeat;
    background-size: 160px 40px;
    background-position: center;
  }
  .login_form >>> .el-form-item__content{
    line-height: 0px !important;
  }
</style>

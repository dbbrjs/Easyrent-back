<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
// 引入qs
import qs from 'qs'

export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
        // msg: ''
      }
    }
  },
  methods: {
    // 登录请求
    async handleLogin () {
    // 希望  让异步操作的代码 看起来像同步代码
    // ES7  async+await
      const res = await this.$http.post('login', qs.stringify(this.formdata))
      const {
        data,
        meta: {msg, status}
      } = res.data
      console.log(res)
      if (status == 200) {
      // 登录成功
        // 0.保存token
        localStorage.setItem('token', data.token)
        localStorage.setItem('usersname', data.username)
        // 1.跳转home
        console.log(res)
        this.$router.push({name: 'home'})
        // 2.提示成功
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    }
  }

}
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background: url(../../assets/3.gif) no-repeat center center fixed;
    /*弹性布局*/
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    opacity: 0.85;
    width: 400px;
    background-color: #ffffff;
    border-radius: 5px;
    padding: 30px;
  }

  .login-wrap .login-btn {
    width: 100%;
  }
</style>

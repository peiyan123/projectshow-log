<template>
  <div style="background-color: #083e6b;height: 100%;display: flex;align-items: center;flex-flow: column;justify-content: center;">
    <div style="font-size: 38px;color: #fff;font-weight: bold;">BLOG-日志系统用户登录</div>
    <div class="login-item">
      <el-form :model="ruleForm"
               status-icon
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户名"
                      prop="name">
          <el-input v-model.number="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="pass">
          <el-input type="password"
                    v-model="ruleForm.pass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 145px;"
                     type="primary"
                     @click="submitForm('ruleForm')">登录</el-button>
          <el-button style="width: 145px;"
                     @click="sign()">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import Service from '@/services/http'
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        name: '',
      },
      rules: {
        name: [{ validator: checkName, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
      },
    }
  },
  async created() {},
  methods: {
    sign() {
      this.$router.replace('/sign')
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        var params = {
          name: this.ruleForm.name,
          password: this.ruleForm.pass,
        }
        if (valid) {
          var resSet = await Service.getUser()
          resSet = JSON.parse(resSet.data)
          var userList = resSet.map((item) => {
            return item.name
          })
          if (userList.indexOf(params.name) !== -1) {
            if (
              params.password === resSet[userList.indexOf(params.name)].password
            ) {
              this.$router.replace('/list')
              localStorage.setItem('userName', params.name)
              return this.$message.success('登录成功')
            } else {
              return this.$message.error('用户名或密码错误')
            }
          } else {
            return this.$message.error('用户名或密码错误')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style  scoped>
.login-item {
  width: 35%;
  margin: 0 auto;
  height: 300px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 84px;
}
.el-form {
  width: 60%;
  margin: 0 auto;
}
</style>

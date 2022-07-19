<template>
  <div style="background-color: #083e6b;height: 100%;display: flex;align-items: center;flex-flow: column;justify-content: center;">
    <div style="font-size: 38px;color: #fff;font-weight: bold;">BLOG-日志系统用户注册</div>
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
        <el-form-item label="确认密码"
                      prop="checkPass">
          <el-input type="password"
                    v-model="ruleForm.checkPass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 145px;"
                     type="primary"
                     @click="submitForm('ruleForm')">提交</el-button>
          <el-button style="width: 145px;"
                     @click="login()">去登录</el-button>
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
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        name: '',
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        name: [{ validator: checkName, trigger: 'blur' }],
      },
    }
  },
  async created() {
    this.getData()
  },
  methods: {
    login() {
      this.$router.replace('/login')
    },
    async getData() {},
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
          if (userList.includes(params.name)) {
            return this.$message.error('用户名已注册')
          } else {
            resSet.push(params)
            let res = await Service.setUser({ data: JSON.stringify(resSet) })
            if (res.code === 200) {
              this.$router.replace('/login')
              return this.$message.success('注册成功')
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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

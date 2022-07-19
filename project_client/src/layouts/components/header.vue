<template>
  <div class="page-header">
    <a-row class="a-row">
      <a-col :span="5">
        <span class="name">{{$t('message.home_header_title')}}</span>
      </a-col>
      <a-col :span="15">
        <!-- <a-dropdown class="dropdown">
          <a class="ant-dropdown-link"
             @click="e => e.preventDefault()">
            {{$t('message.header_meun_title')}}
          </a>
          <a-menu class='menu_down_left'
                  slot="overlay">
            <a-sub-menu key="test"
                        class='menu_sub_title'
                        :title="$t('message.header_meun_label_1')">
              <a-menu-item :key='index'
                           v-for="(item, index) in this.solution"
                           class='menu_down_right'
                           @click="changeItem('solution', item)">
                <p class='title_p'><span :title='item.title'
                        class='textfont'>{{item.title}}</span></p>
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="com"
                        class='menu_sub_title'
                        :title="$t('message.header_meun_label_2')">
              <a-menu-item :key='index'
                           v-for="(item, index) in this.component"
                           class='menu_down_right'
                           @click="changeItem('component', item)">
                <p class='title_p'><span :title='item.title'
                        class='textfont'>{{item.title}}</span></p>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-dropdown> -->
      </a-col>
      <a-col :span="2">
        <!-- <a-dropdown split-button
                    type="primary"
                    class="language">
          <a class="ant-dropdown-link">
            <span v-if="this.$i18n.locale == 'en-us'">English</span>
            <span v-if="this.$i18n.locale == 'zh-cn'">中文</span>
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="1"
                         @click="checkLang('en-us')">
              English
            </a-menu-item>
            <a-menu-item key="2"
                         @click="checkLang('zh-cn')">
              中文
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->
      </a-col>

      <a-col v-if="!this.loginStatus"
             :span="1">
        <el-button type="text"
                   @click="sign()">注册</el-button>
      </a-col>

      <a-col v-if="!this.loginStatus"
             :span="2">
        <el-button type="text"
                   @click="add()">登录</el-button>
      </a-col>
      <a-col v-if="this.loginStatus"
             :span="1">
        <el-button type="text">{{this.loginUser}}</el-button>
      </a-col>
      <a-col v-if="this.loginStatus"
             :span="1">
        <el-button type="text"
                   @click="loginOut()">退出</el-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Service from '@/services/http'
export default {
  data() {
    return {
      component: [],
      solution: [],
      title: '',
      menu: '',
      loginStatus: false,
      loginUser: '',
    }
  },
  mounted() {
    //console.log(this.$t('title.homeHeader'))
    this.getMenu()
    if (localStorage.getItem('userName')) {
      this.loginStatus = true
      this.loginUser = localStorage.getItem('userName')
    } else {
      this.loginStatus = false
    }
  },
  methods: {
    loginOut() {
      localStorage.removeItem('userName')
      this.$router.replace('/login')
    },
    sign() {
      this.$router.replace('/sign')
      // this.$router.push({
      //   path: '/detail',
      //   query: {
      //     title: this.title,
      //     menu: this.menu,
      //   },
      // })
    },
    changeItem(item, obj) {
      if (item == 'solution') {
        this.menu = 'Solution'
      } else {
        this.menu = 'Component'
      }
      this.title = obj.title
      this.$emit('changeItem', obj)
    },
    async deleteItem(obj, title) {
      let res = await Service.getData()
      res = JSON.parse(res.data)
      if (obj == 'solution') {
        res.Solution.menu.map((item, index) => {
          if (item.title == title) {
            res.Solution.menu.splice(index, 1)
          }
        })
      }
      if (obj == 'component') {
        res.Component.menu.map((item, index) => {
          if (item.title == title) {
            res.Component.menu.splice(index, 1)
          }
        })
      }
      this.$confirm(
        this.$t('message.detail_form_model_title'),
        this.$t('message.detail_form_model_tips'),
        {
          confirmButtonText: this.$t('message.detail_form_model_determine'),
          cancelButtonText: this.$t('message.detail_form_model_cancel'),
          type: 'warning',
        }
      )
        .then(async () => {
          let resSet = await Service.setData({ data: JSON.stringify(res) })
          if (resSet.code && resSet.code == 200) {
            this.getMenu()
            this.$emit('changeNum')
            this.$message({
              type: 'success',
              message: this.$t(
                'message.detail_form_model_successfully_deleted'
              ),
            })
          } else {
            this.$message({
              type: 'error',
              message: this.$t('message.detail_form_model_deletion_failed'),
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.detail_form_model_deletion_canceled'),
          })
        })
    },
    async getMenu() {
      let res = await Service.getData()
      res = JSON.parse(res.data)
      this.solution = []
      this.component = []
      res.Solution.menu.map((item) => {
        if (localStorage.getItem('lang') == 'en-us') {
          if (item.language == 'English') {
            this.solution.push(item)
            this.title = item.title
            this.menu = 'Solution'
          }
        } else {
          if (item.language == '中文') {
            this.solution.push(item)
            this.title = item.title
            this.menu = 'Solution'
          }
        }
      })
      res.Component.menu.map((item) => {
        if (localStorage.getItem('lang') == 'en-us') {
          if (item.language == 'English') {
            this.component.push(item)
            this.title = item.title
            this.menu = 'Component'
          }
        } else {
          if (item.language == '中文') {
            this.component.push(item)
            this.title = item.title
            this.menu = 'Component'
          }
        }
      })
      console.log(this.solution)
    },
    checkLang(key) {
      this.$router.go(0)
      if (key == 'en-us') {
        localStorage.setItem('lang', 'en-us')
        this.$i18n.locale = 'en-us'
      } else {
        localStorage.setItem('lang', 'zh-cn')
        this.$i18n.locale = 'zh-cn'
      }
    },
  },
}
</script>

<style lang="less">
.page-header {
  padding: 15px 50px;
  background: #fff;
  border-bottom: 1px solid #dcd5d5;
  box-shadow: -5px 0 10px #dcd5d5;
  top: 0px;
  position: sticky;
  z-index: 100;
  .a-row {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .name {
    font-size: 26px;
    font-weight: bold;
  }
  .dropdown {
    margin-left: 20px;
    color: #000;
    font-size: 23px;
  }
  .language {
  }
}
.title_p {
  margin-top: 12px;
}
.menu_down_left {
  background-color: #fff;
  height: 300px;
  width: 260px;
  .menu_sub_title {
    height: 50px;
  }
}
.menu_sub_title .ant-dropdown-menu-submenu-title {
  line-height: 50px;
}
.ant-dropdown-menu-submenu-content {
  height: 300px;
  width: 200px;
  overflow: auto;
}
.btn {
  float: right;
  margin-top: -10px;
  color: #f00;
}
.textfont {
  max-width: 130px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
}
</style>
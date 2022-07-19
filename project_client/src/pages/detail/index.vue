<template>
  <div>
    <page-header />
    <div class="detail_contant">
      <el-form label-width='130px'
               :model="formLabelAlign">
        <!-- <el-form-item :label="$t('message.detail_form_lang')">
          <el-dropdown  @command="changeLanguage">
            <span class="el-dropdown-link">
              {{this.$i18n.locale == 'en-us' ? 'English' : '中文'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="中文">中文</el-dropdown-item>
              <el-dropdown-item command="English">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('message.detail_form_menu')">
          <el-dropdown  @command="changeMeau">
            <span class="el-dropdown-link">
              {{label == '方案中心' ? $t('message.header_meun_label_1') : $t('message.header_meun_label_2')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="方案中心">{{$t('message.header_meun_label_1')}}</el-dropdown-item>
              <el-dropdown-item command="组件中心">{{$t('message.header_meun_label_2')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item> -->
        <el-form-item :label="$t('message.detail_form_title')">
          <el-input :style="{width: '300px'}"
                    v-model="formLabelAlign.title"
                    :placeholder="$t('message.detail_form_title_placeholder')"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('message.detail_form_banner')">
          <el-upload
            class="avatar-uploader"
            :http-request="toUpload"
            ref="upload"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item :label="$t('message.detail_form_contant')">
          <mavon-editor :transition="false"
                        ref="md"
                        @imgAdd="$imgAdd"
                        v-model="uetest" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="!idUpdate"
                     type="primary"
                     @click="submitForm()">{{$t('message.detail_form_btn_submit')}}</el-button>
          <el-button v-if="idUpdate"
                     type="primary"
                     @click="updateForm()">{{$t('message.detail_form_btn_update')}}</el-button>
          <el-button @click="goBack()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>
<script>
import axios from 'axios'
//import UE from '@/ue/ue.vue';
import { mavonEditor } from 'mavon-editor'
import PageHeader from '@/layouts/components/header.vue'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'
import Service from '@/services/http'
var Minio = require('minio')
let stream = require('stream')
var minioClient = new Minio.Client({
  endPoint: '192.168.87.177',
  port: 9000,
  useSSL: false,
  accessKey: 'Admin',
  secretKey: 'bPxRfiCYEXAMPLEKEY',
})
export default {
  components: {
    PageHeader,
    mavonEditor,
    // VueUeditorWrap
  },
  data() {
    return {
      formLabelAlign: {
        title: '',
      },
      label: '方案中心',
      langue: '中文',
      imageUrl: '',
      uetest: '请在这里输入...',
      replace: false,
      idUpdate: false,
      updateTitle: '',
      updateMenu: '',
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        //serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/ueditor/',
      },
    }
  },
  async created() {
    if (this.$route.query.menu) {
      this.idUpdate = true
      let res = await Service.getData()
      res = JSON.parse(res.data)
      res.Solution.menu.map((item, index) => {
        if (item.title == this.$route.query.title) {
          this.uetest = item.uetest
          this.language = item.language
          this.label = item.menu
          this.imageUrl = item.imageUrl
        }
      })
      this.formLabelAlign.title = this.$route.query.title
      this.updateTitle = this.$route.query.title
      this.updateMenu = this.$route.query.menu
    }
  },
  watch: {
    uetest(newValue, oldValue) {
      console.log(this.$refs.md.d_render)
    },
  },
  methods: {
    goBack() {
      this.$router.push('/list')
    },
    changeLanguage(command) {
      this.langue = command
      if (command == 'English') {
        this.$i18n.locale = 'en-us'
      } else {
        this.$i18n.locale = 'zh-cn'
      }
      //window.location.replace("/#/detail")
    },
    changeMeau(command) {
      this.label = command
    },
    async setFile(obj, res) {
      let resSet = await Service.setData({ data: JSON.stringify(res) })
      if (resSet.code && resSet.code == 200) {
        if (obj == 'submit') {
          this.$message({
            message: this.$t('message.detail_form_add_success'),
            type: 'success',
          })
        } else {
          this.$message({
            message: this.$t('message.detail_form_update_success'),
            type: 'success',
          })
        }
      } else {
        if (obj == 'submit') {
          this.$message.error(this.$t('message.detail_form_add_error'))
        } else {
          this.$message.error(this.$t('message.detail_form_update_error'))
        }
      }
    },
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      let vm = this
      let file = $file
      let metadata = {
        'content-type': $file.type,
        'content-length': $file.size,
      }
      //判断储存桶是否存在
      minioClient.bucketExists('projectshow', function (err) {
        if (err) {
          if (err.code == 'NoSuchBucket')
            return console.log('bucket does not exist.')
          return console.log(err, '12121212121212121')
        }
        //存在
        console.log('Bucket exists.')
        //准备上传
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          const dataurl = e.target.result
          //base64转blob
          const blob = vm.toBlob(dataurl)
          //blob转arrayBuffer
          let reader2 = new FileReader()
          reader2.readAsArrayBuffer(blob)

          reader2.onload = function (ex) {
            var num = new Date().getTime()
            var random = num + '' + Math.round(Math.random() * 1000)
            //定义流
            let bufferStream = new stream.PassThrough()
            //将buffer写入
            bufferStream.end(new Buffer(ex.target.result))
            var fileName =
              $file.name.split('.')[0] + random + '.' + $file.name.split('.')[1]
            //上传
            minioClient.putObject(
              'projectshow',
              fileName,
              bufferStream,
              $file.size,
              metadata,
              function (err, etag) {
                if (err == null) {
                  minioClient.presignedGetObject(
                    'projectshow',
                    `${fileName}`,
                    24 * 60 * 60,
                    function (err, presignedUrl) {
                      if (err) return console.log(err)
                      console.log(presignedUrl)
                      var len = presignedUrl.indexOf('?')
                      var picUrl = presignedUrl.substring(0, len)
                      vm.$refs.md.$imglst2Url([[pos, picUrl]])
                    }
                  )
                }
                //return console.log(err, etag)
              }
            )
          }
        }
      })
    },
    async submitForm() {
      if (this.formLabelAlign.title.replace(/(^s*)|(s*$)/g, '').length == 0) {
        return this.$message.error(this.$t('message.detail_form_title_error'))
      }
      // if (this.imageUrl == '') {
      //   return this.$message.error(this.$t('message.detail_form_banner_error'))
      // }
      let res = await Service.getData()
      res = JSON.parse(res.data)
      var that = this
      return this.compareName(res).then(function () {
        if (that.replace) {
          that.$message.error(that.$t('message.detail_form_title_repeat'))
        } else {
          var showdown = require('showdown')
          var converter = new showdown.Converter()
          res.Solution.menu.push({
            language: that.langue,
            contant: that.$refs.md.d_render,
            examine:
              localStorage.getItem('userName') === 'admin' ? true : false,
            updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            title: that.formLabelAlign.title,
            creatName: localStorage.getItem('userName'),
            uetest: that.uetest,
            comment: [],
            viewsNum: 0,
          })
          that.setFile('submit', res)
        }
      })
    },
    async updateForm() {
      if (this.formLabelAlign.title.replace(/(^s*)|(s*$)/g, '').length == 0) {
        return this.$message.error(this.$t('message.detail_form_title_error'))
      }
      // if (this.imageUrl == '') {
      //   return this.$message.error(this.$t('message.detail_form_banner_error'))
      // }
      let res = await Service.getData()
      res = JSON.parse(res.data)
      res.Solution.menu.map((item, index) => {
        if (item.title == this.updateTitle) {
          res.Solution.menu.splice(index, 1)
        }
      })
      var that = this
      return this.compareName(res).then(function () {
        if (that.replace) {
          that.$message.error(that.$t('message.detail_form_title_repeat'))
        } else {
          var showdown = require('showdown')
          var converter = new showdown.Converter()
          res.Solution.menu.push({
            language: that.langue,
            contant: that.$refs.md.d_render,
            examine:
              localStorage.getItem('userName') === 'admin' ? true : false,
            updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            title: that.formLabelAlign.title,
            creatName: localStorage.getItem('userName'),
            uetest: that.uetest,
            comment: [],
            viewsNum: 0,
          })
          that.setFile('update', res)
        }
      })
    },

    compareName(res) {
      var that = this
      return new Promise(function (resolve, reject) {
        for (var j = 0; j < res.Solution.menu.length; j++) {
          if (res.Solution.menu[j].title == that.formLabelAlign.title) {
            that.replace = true
            resolve(that.$t('message.detail_form_title_repeat'))
            return
          } else {
            resolve(that.$t('message.detail_form_add_success'))
            that.replace = false
          }
        }
        if (res.Solution.menu.length == 0 && res.Solution.menu.length == 0) {
          resolve(that.$t('message.detail_form_add_success'))
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    onError(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    toUpload(params) {
      let vm = this
      let file = params.file
      let metadata = {
        'content-type': params.file.type,
        'content-length': params.file.size,
      }
      //判断储存桶是否存在
      minioClient.bucketExists('projectshow', function (err) {
        if (err) {
          if (err.code == 'NoSuchBucket')
            return console.log('bucket does not exist.')
          return console.log(err, '12121212121212121')
        }
        //存在
        console.log('Bucket exists.')
        //准备上传
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          const dataurl = e.target.result
          //base64转blob
          const blob = vm.toBlob(dataurl)
          //blob转arrayBuffer
          let reader2 = new FileReader()
          reader2.readAsArrayBuffer(blob)

          reader2.onload = function (ex) {
            //定义流
            let bufferStream = new stream.PassThrough()
            //将buffer写入
            bufferStream.end(new Buffer(ex.target.result))
            console.log(params.file.name)
            //上传
            minioClient.putObject(
              'projectshow',
              params.file.name,
              bufferStream,
              params.file.size,
              metadata,
              function (err, etag) {
                if (err == null) {
                  minioClient.presignedGetObject(
                    'projectshow',
                    `${params.file.name}`,
                    24 * 60 * 60,
                    function (err, presignedUrl) {
                      if (err) return console.log(err)
                      console.log(presignedUrl)
                      var len = presignedUrl.indexOf('?')
                      var picUrl = presignedUrl.substring(0, len)
                      vm.imageUrl = picUrl
                    }
                  )
                }
                //return console.log(err, etag)
              }
            )
          }
        }
      })
    },
    //base64转blob
    toBlob(base64Data) {
      let byteString = base64Data
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]) // base64 解码
      } else {
        byteString = unescape(base64Data.split(',')[1])
      }
      // 获取文件类型
      let mimeString = base64Data.split(';')[0].split(':')[1] // mime类型
      let uintArr = new Uint8Array(byteString.length) // 创建视图

      for (let i = 0; i < byteString.length; i++) {
        uintArr[i] = byteString.charCodeAt(i)
      }
      // 生成blob
      const blob = new Blob([uintArr], {
        type: mimeString,
      })
      // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
      return blob
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是JPG或PNG格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return isJPG && isLt2M
    },
  },
}
</script>
<style  scoped>
.btn_en >>> .el-radio-button__inner {
  width: 100px;
  border-left: 1px solid #dcdfe6;
  box-shadow: 0 0 0 0 #409eff;
  border-radius: 4px 4px 4px 4px;
}

.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader >>> .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.detail_contant {
  width: 80%;
  margin: 0 auto;
  margin-top: 50px;
}
.el-dropdown-link {
  cursor: pointer;
}
</style>
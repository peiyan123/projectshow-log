<template>
  <div>
    <page-header v-on:changeNum="changeNum"
                 @changeItem='changeItem' />
    <!-- <el-carousel class="home_contant" arrow='never' indicator-position="none">
      <el-carousel-item v-for="item in 1" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel> -->
    <div style="overflow:auto;">
      <!-- <img v-if="imageUrl" class="img_header" :src='imageUrl'> -->
    </div>
    <div class="contant_under">
      <p class="title">{{title}}</p>
      <p>
        <img width="24px"
             src="../../assets/user.png" /><span style="margin-left: 5px;">{{createUser}}</span> <span style="margin-left: 50px;">{{createtime}}</span>
      </p>
      <div>
        <content class="content"
                 v-html='html' />
      </div>
      <div v-if="examinel === 1"
           style="margin-top: 30px;margin-left: 947px;">点击量 <span style="margin-left: 30px;">{{viewsNum}}</span> </div>
      <div v-if="examinel === 1"
           style="margin-top: 100px;">
        <p style=" font-size: 18px;line-height: 1;color: #000;font-weight: bold;margin-bottom: 30px;">发表评论</p>
        <div style="display: flex">
          <img style="width: 50px;border-radius: 25px;"
               src="../../assets/comment.jpg"
               alt="">
          <div style="margin-left: 50px;width: 70%;">
            <el-input type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="commentText">
            </el-input>
          </div>
        </div>
        <el-button style="margin-left: 962px;margin-top: 20px;"
                   size="small"
                   :disabled="commentText === ''"
                   @click="addComment()"
                   type="primary">发布评论</el-button>
      </div>
      <div v-if="examinel === 1"
           style="margin-top: 20px;">
        <p style=" font-size: 18px;line-height: 1;color: #000;font-weight: bold;">评论列表</p>
        <div style="margin-bottom: 15px"
             v-for="(item, index) in commentList"
             :key="index">
          <img src="../../assets/user.png"
               width="24px" />
          <div style="display: inline-block;font-size: 18px;color: #222;font-weight: 600;margin-left: 15px;">{{item.commentUser}}</div>
          <div style="font-size: 15px;color: #222;font-weight: 500;margin-left: 40px;margin-top: 15px;">{{item.commentText}}</div>
          <div style="display: inline-block;font-size: 12px;color: #222;font-weight: 500;margin-left: 40px;margin-top: 10px;color:#9195a3">{{item.commentData}}</div>
          <div @click="reply(item)"
               style="display: inline-block;font-size: 12px;color: #222;font-weight: 500;margin-left: 850px;margin-top: 10px;color:#9195a3;cursor: pointer;">
            {{(replyStatus && replyId === item.commentId) ? '取消回复' : '回复' }}</div>

          <div style="width: 76%;margin-left: 40px;margin-top: 10px;"
               v-if="replyStatus && replyId === item.commentId">
            <el-input type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="replyText">
            </el-input>
            <el-button style="margin-left: 962px;margin-top: 20px;"
                       size="small"
                       :disabled="replyText === ''"
                       @click="addReply(item)"
                       type="primary">发表</el-button>
          </div>
          <div v-if="item.reply.length > 0">
            <div style="margin-left: 150px;margin-top: 15px"
                 v-for="(replyItem, index) in item.reply"
                 :key="index">
              <img src="../../assets/user.png"
                   width="24px" />
              <div style="display: inline-block;font-size: 18px;color: #222;font-weight: 600;margin-left: 15px;">{{replyItem.replyUser}}</div>
              <div style="font-size: 15px;color: #222;font-weight: 500;margin-left: 40px;margin-top: 15px;">{{replyItem.replyText}}</div>
              <div style="display: inline-block;font-size: 12px;color: #222;font-weight: 500;margin-left: 40px;margin-top: 10px;color:#9195a3">{{replyItem.replyData}}</div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 100px">
        <el-button size="mini"
                   @click="setExamine('1')"
                   v-if="this.currectUser === 'admin' && this.examinel === false">审核通过</el-button>
        <el-button size="mini"
                   type="danger"
                   @click="setExamine('0')"
                   v-if="this.currectUser === 'admin' &&  this.examinel === false">审核失败</el-button>

      </div>
    </div>
    <div style="position: fixed;top: 150px;right: 20px;width: 300px;border: 1px solid rgb(145, 149, 163); height: 400px;">
      <div style="padding: 15px;font-size: 18px;">今日排行</div>
      <div v-for="(item, index) in sortInfo"
           :key="index"
           style="display: flex;padding: 20px 15px;height: 100px">
        <img height="24px"
             src="../../assets/user.png"
             width="24px" />
        <div style="padding-left: 15px;">
          <div @click="goHot(item)"
               style="width: 230px;overflow: hidden;text-overflow: ellipsis; -webkit-line-clamp: 2;display: -webkit-box;-webkit-box-orient: vertical;cursor: pointer;color: blue">{{item.title}}</div>
          <div style="display: flex;margin-top: 10px;justify-content: space-between;">
            <div style="font-size: 12px">{{item.creatName}}</div>
            <div style="font-size: 12px">{{item.updateTime}}</div>
          </div>
        </div>
      </div>

    </div>
    <div class="scroll"
         :class="{show:isActive}">
      <div id="toTop"
           @click="toTop(step)">&lt;</div>
    </div>
  </div>

</template>

<script>
import Service from '@/services/http'
import PageHeader from '@/layouts/components/header.vue'
import moment from 'moment'
//import UE from '@/ue/ue.vue';
//import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  components: {
    //UE
    PageHeader,
    // VueUeditorWrap
  },
  props: {
    step: {
      //控制速度
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      html: '',
      title: '',
      createUser: '',
      createtime: '',
      examinel: null,
      currectUser: '',
      imageUrl: '',
      isActive: false,
      commentText: '', // 新增评论
      replyText: '', // 新增回复
      commentList: [], // 评论列表
      sortInfo: null, // 最热日志
      viewsNum: '', //点击量
      //detail: null,
      solution: [],
      replyStatus: false,
      replyId: '',
      component: [],
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: Service.getData(),
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/ueditor/',
      },
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.currectUser = localStorage.getItem('userName')
    // this.detail = JSON.parse(localStorage.getItem('info'))
    this.title = JSON.parse(localStorage.getItem('info')).title
    this.commentList = JSON.parse(localStorage.getItem('info')).comment
    this.examinel = JSON.parse(localStorage.getItem('info')).examine
    this.html = JSON.parse(localStorage.getItem('info')).contant
    this.createtime = JSON.parse(localStorage.getItem('info')).updateTime
    this.createUser = JSON.parse(localStorage.getItem('info')).creatName
    this.viewsNum = JSON.parse(localStorage.getItem('info')).viewsNum
    let res = await Service.getData()
    res = JSON.parse(res.data)
    res.Solution.menu.sort((a, b) => {
      return a.viewsNum > b.viewsNum ? -1 : 1
    })
    this.sortInfo = res.Solution.menu.slice(0, 3)
  },
  methods: {
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }
      )
    },
    async goHot(data) {
      let res = await Service.getData()
      res = JSON.parse(res.data)
      let info
      res.Solution.menu.map((item) => {
        if (item.title === data.title) {
          info = item
          if (item.examine === 1) {
            item.viewsNum = item.viewsNum + 1
          }
        }
      })
      setTimeout(async () => {
        let resSet = await Service.setData({ data: JSON.stringify(res) })
        localStorage.setItem('info', JSON.stringify(info))
        this.$router.go(0)
      }, 500)
    },
    reply(item) {
      this.replyId = item.commentId
      this.replyStatus = !this.replyStatus
    },
    async addReply(data) {
      let res = await Service.getData()
      res = JSON.parse(res.data)
      res.Solution.menu.forEach((element) => {
        if (this.title === element.title) {
          element.comment.forEach((item) => {
            if (item.commentId === data.commentId) {
              item.reply.push({
                replyText: this.replyText,
                replyData: moment().format('YYYY-MM-DD HH:mm:ss'),
                replyUser: localStorage.getItem('userName'),
              })
            }
          })
        }
      })
      setTimeout(async () => {
        let resSet = await Service.setData({ data: JSON.stringify(res) })
        if (resSet.code && resSet.code == 200) {
          this.$message.success('回复成功')
          this.replyText = ''
          this.replyStatus = false
          this.echoData()
        }
      }, 500)
    },
    async addComment() {
      if (this.commentText !== '') {
        let res = await Service.getData()
        res = JSON.parse(res.data)
        res.Solution.menu.forEach((element) => {
          if (this.title === element.title) {
            element.comment.push({
              commentId: this.guid(),
              commentUser: localStorage.getItem('userName'),
              commentData: moment().format('YYYY-MM-DD HH:mm:ss'),
              commentText: this.commentText,
              reply: [],
            })
            return
          }
        })
        setTimeout(async () => {
          let resSet = await Service.setData({ data: JSON.stringify(res) })
          if (resSet.code && resSet.code == 200) {
            this.$message.success('评论发表成功')
            this.commentText = ''
            this.echoData()
          }
        }, 500)
      } else {
        this.$message.error('评论不可为空')
      }
    },
    async echoData() {
      let res = await Service.getData()
      res = JSON.parse(res.data)
      res.Solution.menu.forEach((element) => {
        if (this.title === element.title) {
          localStorage.setItem('info', JSON.stringify(element))
          this.commentList = element.comment
          return
        }
      })
    },
    async setExamine(type) {
      let res = await Service.getData()
      res = JSON.parse(res.data)
      if (type === '0') {
        res.Solution.menu.forEach((item) => {
          if (item.title === this.title) {
            item.examine = 0
          }
        })
      } else {
        res.Solution.menu.forEach((item) => {
          if (item.title === this.title) {
            item.examine = 1
          }
        })
      }
      let setRes = await Service.setData({ data: JSON.stringify(res) })
      if (setRes.code === 200) {
        this.$router.push('/list')
        this.$message.success('操作成功')
      }
    },
    changeItem(item) {
      this.html = item.contant
      this.imageUrl = item.imageUrl
    },
    handleScroll(e) {
      if (document.documentElement.scrollTop > 50) {
        this.isActive = true
      } else {
        this.isActive = false
      }
    },
    toTop(step) {
      //参数step表示时间间隔的幅度大小，以此来控制速度
      //当回到页面顶部的时候需要将定时器清除
      document.documentElement.scrollTop -= step
      if (document.documentElement.scrollTop > 0) {
        var time = setTimeout(() => this.toTop(step), 15)
      } else {
        clearTimeout(time)
      }
    },
    async changeNum() {
      let res = await Service.getData()
      res = JSON.parse(res.data)
      this.html = res.Solution.menu[0].contant
    },
  },
}
</script>
<style scoped>
.img_header {
  width: 100%;
  overflow: hidden;
  height: 500px;
  margin-bottom: 50px;
  padding: 0 20px;
  margin-top: 14px;
}
.title {
  font-size: 25px;
  font-weight: bold;
}
.contant_under {
  width: 70%;
  margin: 0 auto;
}
.content >>> p {
  word-break: break-all;
  width: 100%;
}
.content >>> h1 {
  word-break: break-all;
  width: 100%;
  font-weight: bold;
}
.content >>> h2 {
  word-break: break-all;
  width: 100%;
  font-weight: bold;
}
.content >>> h3 {
  word-break: break-all;
  width: 100%;
  font-weight: bold;
}
.content >>> h4 {
  word-break: break-all;
  width: 100%;
  font-weight: bold;
}
.content >>> h5 {
  word-break: break-all;
  width: 100%;
  font-weight: bold;
}
.content >>> h6 {
  word-break: break-all;
  width: 100%;
  font-weight: bold;
}
.content >>> img {
  width: 100%;
}
.content >>> .hljs-center {
  text-align: center;
}
.content >>> .hljs-right {
  text-align: right;
}
.scroll {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 45px;
  height: 90px;
  cursor: pointer;
}
.scroll > div {
  width: 45px;
  height: 45px;
  transform: rotate(90deg);
  line-height: 45px;
  text-align: center;
  font-size: 35px;
  font-family: '黑体';
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
}
.scroll > div:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
.show {
  display: block;
}
</style>

<template>
  <div>
    <page-header />
    <div class="header">
      <el-button size="mini"
                 type="primary"
                 style="float: right;"
                 @click="handleAdd()">{{$t('message.add_btn')}}</el-button>
    </div>
    <el-table :data="tableData"
              class="table"
              style="width: 80%">
      <el-table-column label="头像"
                       align="left"
                       width="100">
        <template>
          <img width="40px"
               src="../../assets/user.png" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.detail_table_title')"
                       align="left"
                       width="680">
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #2339ec;"
                @click="openDetail(scope.row)"> <span v-if="scope.$index < 3"
                  class="hot">热</span> {{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态"
                       align="left"
                       width="100">
        <template slot-scope="scope">
          <span style="cursor: pointer"
                :class="{'status_bule': scope.row.examine === 1, 'status_red':  scope.row.examine !== 1}">{{ scope.row.examine === false ? '未审核' :  scope.row.examine === 1 ? "审核通过" : "审核未通过"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者"
                       width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.creatName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关注度"
                       width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.viewsNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间"
                       width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.detail_table_opt')">
        <template slot-scope="scope">
          <el-button size="mini"
                     v-if="currectUser === scope.row.creatName && scope.row.examine !== 1"
                     @click="handleEdit(scope.$index, scope.row)">{{$t('message.edit_btn')}}</el-button>
          <el-button size="mini"
                     type="danger"
                     v-if="(currectUser === scope.row.creatName && scope.row.examine !== 1) || currectUser === 'admin'"
                     @click="deleteItem('solution', scope.row.title)">{{$t('message.del_btn')}}</el-button>
          <el-button size="mini"
                     type="danger"
                     v-if="currectUser === 'admin' && scope.row.examine === false"
                     @click="openDetail(scope.row)">审核</el-button>
          <!-- <el-button size="mini"
                     type="text"
                     v-if="currectUser !== 'admin' && scope.row.examine === 1">审核通过</el-button>
          <el-button size="mini"
                     type="text"
                     style="color: red"
                     v-if="currectUser !== 'admin' && scope.row.examine === 0">审核失败</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Service from '@/services/http'
import PageHeader from '@/layouts/components/header.vue'
export default {
  components: {
    PageHeader,
  },
  data() {
    return {
      tableData: [],
      currectUser: '',
    }
  },
  async created() {
    this.currectUser = localStorage.getItem('userName')
    this.getData()
  },
  methods: {
    async openDetail(data) {
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
        this.$router.push({
          path: '/info',
          query: {
            info: info,
          },
        })
      }, 500)
    },
    async getData() {
      this.tableData = []
      let res = await Service.getData()
      res = JSON.parse(res.data)
      res.Solution.menu.map((item) => {
        if (this.currectUser === 'admin') {
          this.tableData.push(item)
          this.tableData.sort((a, b) => {
            return a.viewsNum > b.viewsNum ? -1 : 1
          })
        } else {
          if (
            (item.examine === 1 && this.currectUser !== item.creatName) ||
            this.currectUser === item.creatName
          ) {
            this.tableData.push(item)
            this.tableData.sort((a, b) => {
              return a.viewsNum > b.viewsNum ? -1 : 1
            })
          }
        }
      })
    },
    handleEdit(index, scope) {
      //this.$router.replace('/detail')
      this.$router.push({
        path: '/detail',
        query: {
          title: scope.title,
          menu: scope.menu == '组件中心' ? 'Component' : 'Solution',
        },
      })
    },
    handleAdd() {
      this.$router.replace('/detail')
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
            this.$emit('changeNum')
            this.$message({
              type: 'success',
              message: this.$t(
                'message.detail_form_model_successfully_deleted'
              ),
            })
            this.getData()
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
  },
}
</script>
<style scoped>
.table {
  margin: 0 auto;
  margin-top: 50px;
  min-width: 1420px;
}
.header {
  padding: 15px 50px;
  background: #fff;
  border-bottom: 0px solid #dcd5d5;
  top: 0;
  height: 60px;
  position: sticky;
}
.status_bule {
  color: blue;
}
.status_red {
  color: red;
}
.hot {
  display: inline-block;
  padding: 0 2px;
  text-align: center;
  vertical-align: middle;
  font-style: normal;
  color: #fff;
  overflow: hidden;
  line-height: 16px;
  height: 16px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 200;
  background-color: #f60;
}
</style>

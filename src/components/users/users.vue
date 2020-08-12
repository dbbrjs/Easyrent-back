<template>
  <el-card class="box-card">
    <!--    1.面包屑-->
    <!--    首页/用户管理/用户列表-->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!--    2.搜索-->
    <el-row class="searchRow">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="loadUserList"
        >
          <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--    3.表格-->
    <el-table :data="userlist" style="width: 100%">
      <!--      type='index'就是显示索引值-->
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="account" label="用户ID"></el-table-column>
      <el-table-column prop="nick" label="用户昵称"></el-table-column>
      <el-table-column prop="cellphone" label="电话"></el-table-column>
      <el-table-column prop="idnumber" label="身份证号" width="200"></el-table-column>

      <el-table-column label="创建日期">
        <!--  如果单元格内显示的内容不是字符串（文本），
        需要给别显示的内容外层包裹一个template-->

        <!--
            template内部要用数据 设置slot-scope属性
            该属性的值是要用数据create_time的数据源userlist
        -->

        <!--
            slot-scope的值scope其实就是el-table绑定的数据userlist，
            scope.row->数组的每个对象
        -->

        <!--  slot-scope会自动去上一级找数据源-->
        <template slot-scope="scope">{{scope.row.createtime|fmtdata}}</template>
      </el-table-column>

      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <!--          用户状态开关-->
          <el-switch
            @change="changeMgState(scope.row)"
            v-model="scope.row.juisdiction"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.account)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    4.分页-->

    <el-pagination
      style="margin-top:20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--     对话框-->
    <!--    添加用户的对话框-->
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      // 表格绑定数据
      userlist: [],
      // 分页相关数据
      total: 1,
      pagenum: 1,
      pagesize: 2
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表的请求
    async getUserList () {
      // 需要授权的API，必须在请求头中使用 Authorization 字段提供 token 令牌(在http.js中axios里面统一设置了)
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      console.log(res)
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status == 200) {
        // console.log(data)
        // 1.给表格数据赋值

        this.userlist = data.data

        this.userlist.forEach((item, index, array) => {
          if (item.juisdiction == 0) {
            array[index].juisdiction = true
          } else {
            array[index].juisdiction = false
          }
          console.log(array[index].juisdiction)
        })
        // this.userstate = this.userlist[0].juisdiction
        // console.log(this.userlist[0].juisdiction)
        console.log(this.userlist)
        // 2.给total赋值
        this.total = data.total
        // 3.提示
         this.$message({
              type: 'success',
              message: msg,
              duration: 1000
            })
      } else {
        // 3.提示
        this.$message.warning(msg)
      }
    },
    // 分页相关方法
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    // 搜索用户
    searchUser () {
      // 按照inout绑定的query参数 发请求
      this.pagenum = 1
      this.getUserList()
    },
    // 清空数据框 重新获取数据
    loadUserList () {
      this.getUserList()
    },

    // 删除用户 打开消息框
    showDeleUserMsgBox (userId) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`)

          console.log(res)
          if (res.data.meta.status == 204) {
            this.pagenum = 1
            // 更新视图
            this.getUserList()
            // 提示
            this.$message({
              type: 'success',
              message: res.data.meta.msg,
              duration: 1000
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          })
        })
    },

    // 修改状态
    async changeMgState (user) {
      const res = await this.$http.put(
        `users/${user.account}/state/${user.juisdiction}`
      )
      console.log(res)
    }
  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
}

.inputSearch {
  width: 300px;
}

.searchRow {
  margin-top: 25px;
}
</style>

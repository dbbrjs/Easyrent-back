<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航区 -->
      <my-bread level1="房源管理" level2="待审核房源"></my-bread>
      <el-row :gutter="20" style="margin-top:25px">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="gethouseList">
            <el-button slot="append" icon="el-icon-search" @click="gethouseList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->

      <el-table :data="houseList" style="width: 100%;margin-top:20px" border stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="房间编号：">
                <span>{{ props.row.houseid }}</span>
              </el-form-item>
              <el-form-item label="房间名称：">
                <span>{{ props.row.housename }}</span>
              </el-form-item>
              <el-form-item label="房东姓名：">
                <span>{{ props.row.ownername }}</span>
              </el-form-item>
              <el-form-item label="房东账号：">
                <span>{{ props.row.account }}</span>
              </el-form-item>
              <el-form-item label="房东电话：">
                <span>{{ props.row.landlord_phone }}</span>
              </el-form-item>
              <el-form-item label="出租类型：">
                <span>{{ props.row.housetype }}</span>
              </el-form-item>
              <el-form-item label="房间地址：">
                <span>{{ props.row.houseaddress }}</span>
              </el-form-item>
              <el-form-item label="房间状态：">
                <span>{{ props.row.housestate|fmtstate }}</span>
              </el-form-item>
              <el-form-item label="最近申请时间：">
                <span>{{ props.row.housecreate|fmtdata}}</span>
              </el-form-item>
              <el-form-item label="房间价格：">
                <span>{{ props.row.houserent }}元/月</span>
              </el-form-item>
              <el-form-item label="房间面积：">
                <span>{{ props.row.housearea }}m²</span>
              </el-form-item>
              <el-form-item label="房间类型：">
                <span>{{ props.row.houseroom }}</span>
              </el-form-item>
              <el-form-item label="房间图片：">
                <img :src="props.row.housemainpic" alt width="50px" />
                <img :src="props.row.housemainpic" alt width="50px" />
                <img :src="props.row.housemainpic" alt width="50px" />
                <img :src="props.row.housemainpic" alt width="50px" />
                <img :src="props.row.housemainpic" alt width="50px" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="房间编号" prop="houseid" width="120px"></el-table-column>
        <el-table-column label="房间名称" prop="housename"></el-table-column>
        <el-table-column label="房间图片" prop="housemainpic">
          <template slot-scope="scope">
            <el-image
              style="width: 200px;height:100px"
              :src="scope.row.housemainpic"
              :preview-src-list="scope.row.kkkk"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="房间状态" prop="housestate">
          <template slot-scope="scope">{{scope.row.housestate|fmtstate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="agreement(scope.row.houseid)"
            >同意</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="refuse(scope.row.houseid)"
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      style="margin-top:20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 房间列表
      houseList: [],
      // 房间总数
      total: 0
    }
  },
  created () {
    this.gethouseList()
  },
  // 过滤器
  filters: {
    fmtstate: function (value) {
      let stateArr = ['待审核', '同意审核', ' ', ' ', '拒绝审核']
      return stateArr[value]
    }
  },
  methods: {
    // 同意
    async agreement (ev) {
      const { data: res } = await this.$http.put(`house/agreement/${ev}`)
      if (res.meta.status == 201) {
        this.$message.success('操作成功！')
        this.gethouseList()
      }
    },
    async refuse (ev) {
      const { data: res } = await this.$http.put(`house/refuse/${ev}`)
      if (res.meta.status == 201) {
        this.$message.success('操作成功！')
        this.gethouseList()
      }
    },
    // 根据分页获取对应的房间列表
    async gethouseList () {
      const { data: res } = await this.$http.get('house/housechecklist', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取房间列表失败！')
      }
      // 拼装大图显示的数组属性
      for (let i = 0; i < res.data.size; i++) {
        let allpic = [];
        ['pic1', 'pic2', 'pic3'].map(function (item) {
          allpic.push(res.data.data[i][item])
        })
        res.data.data[i]['kkkk'] = allpic
      }
      this.houseList = res.data.data
      console.log(this.houseList)
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.gethouseList()
    },
    handleCurrentChange (newSize) {
      this.queryInfo.pagenum = newSize
      this.gethouseList()
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

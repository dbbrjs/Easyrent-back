<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航区 -->
      <my-bread level1="房间管理" level2="房间审核列表"></my-bread>
      <el-row :gutter="20" style="margin-top:25px">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getorderList">
            <el-button slot="append" icon="el-icon-search" @click="getorderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="houseList" style="width: 100%;margin-top:25px" border stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="订单号">
                <span>{{ props.row.orderid }}</span>
              </el-form-item>
              <el-form-item label="房间编号">
                <span>{{ props.row.houseid }}</span>
              </el-form-item>
              <el-form-item label="房间名称">
                <span>{{ props.row.housename }}</span>
              </el-form-item>
              <el-form-item label="入住人姓名">
                <span>{{ props.row.occupants }}</span>
              </el-form-item>
              <el-form-item label="入住人电话">
                <span>{{ props.row.phonenum}}</span>
              </el-form-item>
              <el-form-item label="入住时间">
                <span>{{ props.row.checkintime|fmtdata }}</span>
              </el-form-item>
              <el-form-item label="入住天数">
                <span>{{ props.row.days }}</span>
              </el-form-item>
              <el-form-item label="房间价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <span>{{ props.row.conditional|fmtstate }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderid"></el-table-column>
        <el-table-column label="房间名称" prop="housename" width="300px"></el-table-column>
        <el-table-column label="入住人" prop="occupants"></el-table-column>
        <el-table-column label="入住时间" prop="checkintime">
          <template slot-scope="scope">
          {{scope.row.checkintime|fmtdata}}
        </template>
        </el-table-column>
        <el-table-column label="天数" prop="days"></el-table-column>
        <el-table-column label="订单状态" prop="conditional">
           <template slot-scope="scope">
          {{scope.row.conditional|fmtstate}}
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
    this.getorderList()
  },
  // 过滤器
  filters: {
    fmtstate: function (value) {
      let stateArr = ['等待确认', '已确认', '申请取消', '已取消', '已完成', '已删除']
      return stateArr[value]
    }
  },
  methods: {
    // 根据分页获取对应的房间列表
    async getorderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status != 200) {
        return this.$message.error('获取订单列表失败！')
      }
      this.houseList = res.data.data
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getorderList()
    },
    handleCurrentChange (newSize) {
      this.queryInfo.pagenum = newSize
      this.getorderList()
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

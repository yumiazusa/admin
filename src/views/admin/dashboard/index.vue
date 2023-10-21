<!--
 * @Author: yumiazusa yumiazusa@hotmail.com
 * @Date: 2023-04-18 12:28:51
 * @LastEditors: yumiazusa yumiazusa@hotmail.com
 * @LastEditTime: 2023-10-21 10:29:48
 * @FilePath: /datamaker/Users/ligen/Desktop/www/admin/src/views/admin/dashboard/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
      <panel-group :info="info" @handleSetLineChartData="handleSetLineChartData" />
      <div class="chart-container">
        <log-charts></log-charts>
      </div>
      <el-row>
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" style="padding-right:8px;margin-bottom:30px;">
          <el-table :data="list" style="width: 100%;padding: 15px;">
            <el-table-column label="当前服务器信息" min-width="200" prop="name"></el-table-column>
            <el-table-column label="" min-width="200" prop="value"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div style=" margin-bottom: 30px;">
                   <p>备案号：<a style="color:#666" target="_blank" rel="noopener" href="http://beian.miit.gov.cn/">滇ICP备2021003909号-3;</a>
                </p>
                </div>
  </div>
</template>

<script>
import { dashboardIndex } from '@/api/admin/auth'
import PanelGroup from './components/PanelGroup'
import LogCharts from './components/LogCharts'
export default {
  name: 'DashboardIndex',
  components: {
    PanelGroup,
    LogCharts   
  },
  data() {
    return {
      info: {},
      list:[]
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    // 获取表格列表
    async getList() {
      dashboardIndex().then(response => {
        if(response.status === 20000){
            this.info = response.data.info
            this.list = response.data.list
        }
      })
    },
    handleSetLineChartData(e){
      // console.log(e)
    }
  }
}
</script>
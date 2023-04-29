<template>
  <div class="app-container">
    <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add('college')">
          添加学院
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add('grade')">
          添加年级
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add('department')">
          添加系部
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add('level')">
          添加层次
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add()">
          添加模块
        </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" row-key="id"
    :tree-props="{children: 'children'}">
      <el-table-column min-width="2" label="项目">
        <template slot-scope="{row}">
          <span>
            <span v-if="row.icon">
              <i :class="'e-icon ' + row.icon"></i>
            </span>
            {{ row.title }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="100px" align="center" label="路由文件">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="排序" align="center" prop="sort" width="100px" sortable>
        <template slot-scope="{row}">
          <el-input v-model="row.sort" @blur="setSorts(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="100px">
        <template slot-scope="{row}">
          <el-tooltip
            effect="dark"
            :content="row.status===1 ? '显示' : '隐藏'"
            placement="top"
            :enterable="false">
            <el-switch
              v-model="row.status"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              @change="setStatus(row)"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="固定面板" prop="affix" width="100px">
        <template slot-scope="{row}">
          <el-tooltip
            effect="dark"
            :content="row.affix===1 ? '是' : '否'"
            placement="top"
            :enterable="false">
            <el-switch
              v-model="row.affix"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              @change="setAffix(row)"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="5">
        <template slot-scope="{row}">
          <el-button v-waves type="success" size="mini" @click="collegePidArr(row.id)">
            添加下级
          </el-button>
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            编辑
          </el-button>
          <el-button v-waves size="mini" type="danger" @click="collegeDestroy(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <!-- 添加编辑对话框 -->
    <el-dialog   :title="'添加'+ title " :visible.sync="dialogVisible" width="60%" @close="dialogClose">
      <el-form label-width="100px" :model="form" :rules="rules" ref="ref">  
        <el-form-item  v-if="true" prop="type">
        <el-input v-model="type"></el-input>
        </el-form-item>
        <el-form-item :label="title" prop="title">
          <el-input :placeholder="'请输入'+ title + '名称'" maxlength="100" clearable show-word-limit v-model="form.title"
          ></el-input>
        </el-form-item>    
        <el-form-item label="排序" prop="sort">
          <el-input type="number" placeholder="请输入排序" maxlength="10" clearable show-word-limit v-model="form.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="primary(type)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { ruleIndex,ruleStatus,ruleOpen,ruleAffix,ruleUpdate,ruleStore,ruleEdit,ruleDestroy,ruleSorts,rulePidArr } from '@/api/admin/rule.js'
import { collegeIndex,collegeUpdate,collegeStatus,collegeOpen,collegeAffix } from '@/api/students/college.js'
export default {
  name: 'CollegeIndex',
  data() {
    var checkSort = (rule, value, callback) => {
      // 定义正则表达式
      const regSort = /^[1-9]{1}[0-9]{0,10}$/;
      if (regSort.test(value)) {
        return callback();
      }
      callback(new Error("请输入排序(大于0的数字)!"));
    };
    return {
      list: [],
      title:'',
      type:'',
      listLoading: true,
      dialogVisible:false,
      typeList:{
        college:"学院",
        grade:"年级",
        department:'系部',
        level:'层次',
        class:'班级'
      },
      form: {
        type:'',
        title:'',
        sort:1,
      },
      rules: {
        title: [
          { required: true, message: "请输入必要信息", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入排序！", trigger: "blur" },
          { validator: checkSort, trigger: "blur" }
        ]
      }
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    // 获取表格列表
    async getList() {
      this.listLoading = true
      collegeIndex().then(response => {
        if(response.status === 20000){
          this.list = response.data[4]
          this.collegeList = response.data[0]
        }
        this.listLoading = false
      })
    },
    // 监听添加编辑对话框的关闭事件
    dialogClose() {
      this.form = {
        type:'',
        title:'',
        sort:1,
      }
    },
    // 添加编辑获取选择器值
    handleChange() {
      if (this.value.length > 0) {
        this.form.pid = this.value[this.value.length - 1];
        this.form.level = this.value.length + 1;
      } else {
        this.form.pid = 0;
        this.form.level = 1;
      }
    },
    add(type){
      switch (type) { //想要判断的变量
        case 'college': //状态一
        this.title = '学院'
        this.type = type
          break
        case 'grade': //状态二
        this.title = '年级'
        this.type = type
          break
        case 'department'://状态三
        this.title = '系部'
        this.type = type
          break
          case 'level'://状态四
        this.title = '层次'
        this.type = type
          break
      }
      this.dialogVisible = true
    },
    // 添加编辑按钮
    primary(type) {
      console.log(this.form)
      this.$refs.ref.validate(valid => {
        if (valid) {
          if(type){
            collegeUpdate(this.form).then(response => {
              console.log(response)
              // if(response.status === 20000){
              //   this.$base.message({ message: response.message })
              //   this.dialogVisible = false
              //   this.getList()
              // }
            })
          }else{
            collegeStore(this.form).then(response => {
              if(response.status === 20000){
                this.$base.message({ message: response.message })
                this.dialogVisible = false
                this.getList()
              }
            })
          }
        }
      })
    },
    // 打开编辑按钮对话框
    edit(id) {
      collegeEdit({id:id}).then(response => {
        if(response.status === 20000){
          this.title = '编辑'
          this.dialogVisible = true
          this.form = response.data
          this.value = response.data.value
        }
      })
    },
    // 状态调整
    setStatus(info) {
      collegeStatus({id:info.id,status:info.status}).then(response => {
        if(response.status === 20000){
          this.$base.message({message:response.message})
        }else{
          info.status = info.status?0:1
        }
      })
    },
    // 是否验证权限
    setAuthOpen(info) {
      collegeOpen({id:info.id,auth_open:info.auth_open}).then(response => {
        if(response.status === 20000){
          this.$base.message({message:response.message})
        }else{
          info.auth_open = info.auth_open?0:1
        }
      })
    },
    // 是否固定面板
    setAffix(info) {
      collegeAffix({id:info.id,affix:info.affix}).then(response => {
        if(response.status === 20000){
          this.$base.message({message:response.message})
        }else{
          info.affix = info.affix?0:1
        }
      })
    },
    // 删除
    collegeDestroy(id) {
      this.$base.confirm(
        { content: "确定要删除该项菜单吗（会同时删除子菜单）！" },
        () => {
          collegeDestroy({id:id}).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })
              this.getList()
            }
          })
        }
      )
    },
    setSorts(info){
      collegeSorts({id:info.id,sort:info.sort}).then(response => {
        if(response.status === 20000){
          this.$base.message({message:response.message})
        }else{
          this.getList()
        }
      })
    },
    collegePidArr(pid){
      collegePidArr({pid:pid}).then(response => {
        if(response.status === 20000){
          this.value = response.data
          this.form.pid = pid
          this.dialogVisible = true
          this.title = '添加'
        }
      })
    }
  }
}
</script>
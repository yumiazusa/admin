<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in statusList" :label="item" :key="index" value="index"></el-option>
      </el-select>
      <el-select v-model="listQuery.sex" placeholder="请选择性别" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in sexList" :key="index" :label="item" :value="index"></el-option>
      </el-select>
      <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>
      <div>
        <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="addDialogVisible = true">
          添加
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="60px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="学号">
        <template slot-scope="{row}">
          <span>{{ row.stdid }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="性别">
        <template slot-scope="{row}">
          <span>{{ sexList[row.sex] }}</span>
        </template>
      </el-table-column>
      <el-table-column width="130px" align="center" label="手机号">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邮箱">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="年级">
        <template slot-scope="{row}">
          <span>{{ row.grade_id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="班级">
        <template slot-scope="{row}">
          <span>{{ row.class_id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="80">
        <template slot-scope="{row}">
          <el-tooltip
            effect="dark"
            :content="statusList[row.status]"
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
      <el-table-column label="操作" align="center" min-width="1" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            编辑
          </el-button>
          <el-button v-waves size="mini" type="warning" @click="editPwd(row.id,row.name)">
            修改密码
          </el-button>
          <el-button v-waves size="mini" type="success" @click="studentsUpdatePwd(row.id)">
            初始化密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加对话框 -->
    <el-dialog   title="添加" :visible.sync="addDialogVisible" width="80%" @close="addDialogClose">
      <!-- 主体区 -->
      <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addRef">
        <el-form-item label="学号" prop="stdid">
          <el-input placeholder="请输入学号" maxlength="20" clearable show-word-limit v-model="addForm.stdid"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入姓名" maxlength="20" clearable show-word-limit v-model="addForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生年月日" prop="birth">
            <el-date-picker
                v-model="addForm.birth"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择出生年月日" style="width:100%">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input placeholder="请输入手机号" maxlength="11" clearable show-word-limit v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" maxlength="50" clearable show-word-limit v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade_id">
          <el-input placeholder="请选择年级" maxlength="11" clearable show-word-limit v-model="addForm.grade_id"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class_id">
          <el-input placeholder="请选择班级" maxlength="11" clearable show-word-limit v-model="addForm.class_id"></el-input>
        </el-form-item>
        <el-form-item label="项目分类" prop="project_id">
          <el-input placeholder="请选择项目分类" maxlength="11" clearable show-word-limit v-model="addForm.project_id"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" maxlength="14" clearable show-word-limit v-model="addForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input type="password" placeholder="请输入确认密码" maxlength="14" clearable show-word-limit v-model="addForm.password_confirmation"
          ></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="状态">
              <el-radio-group v-model="addForm.status" size="medium">
                <el-radio v-for="(item,index) in statusList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别">
              <el-radio-group v-model="addForm.sex" size="medium">
                <el-radio v-for="(item,index) in sexList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="addDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>  
    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="80%" @close="editDialogClose">
      <!-- 主体区 -->
      <el-form label-width="100px" :model="editForm" :rules="editRules" ref="editRef">
        <el-form-item label="学号" prop="stdid">
          <el-input placeholder="请输入学号" maxlength="20" clearable show-word-limit v-model="editForm.stdid"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入姓名" maxlength="20" clearable show-word-limit v-model="editForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生年月日" prop="birth">
            <el-date-picker
                v-model="editForm.birth"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择出生年月日" style="width:100%">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input placeholder="请输入手机号" maxlength="11" clearable show-word-limit v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" maxlength="50" clearable show-word-limit v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade_id">
          <el-input placeholder="请选择年级" maxlength="11" clearable show-word-limit v-model="editForm.grade_id"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class_id">
          <el-input placeholder="请选择班级" maxlength="11" clearable show-word-limit v-model="editForm.class_id"></el-input>
        </el-form-item>
        <el-form-item label="项目分类" prop="project_id">
          <el-input placeholder="请选择项目分类" maxlength="11" clearable show-word-limit v-model="editForm.project_id"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="状态">
              <el-radio-group v-model="editForm.status" size="medium">
                <el-radio v-for="(item,index) in statusList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别">
              <el-radio-group v-model="editForm.sex" size="medium">
                <el-radio v-for="(item,index) in sexList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="update()" >确 定</el-button>
      </span>
    </el-dialog>  
    <!--修改密码对话框  -->
     <el-dialog title="修改密码" :visible.sync="editPwdDialogVisible" width="30%" @close="editPwdDialogClose" ref="editStdPwdRef">
      <!-- 主体区 -->
      <el-form label-width="100px" :model="editPwdForm" :rules="editPwdRules" ref="editPwdRef">
        <el-form-item label="账号">
          <el-input disabled v-model="editPwdForm.name"></el-input> 
        </el-form-item>
        <el-form-item label="原密码" prop="y_password">
          <el-input type="password" placeholder="请输入原密码" maxlength="14" clearable show-word-limit v-model="editPwdForm.y_password"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" maxlength="14" clearable show-word-limit v-model="editPwdForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input type="password" placeholder="请输入确认密码" maxlength="14" clearable show-word-limit v-model="editPwdForm.password_confirmation"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editPwdDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="updatePwd()" >确 定</el-button>
      </span>
    </el-dialog>  
  </div>
</template>

<script>
import { studentsIndex,studentsStatus,studentsStore,studentsEdit,studentsUpdate,studentsUpdatePwd,studentsChangePwd} from '@/api/students/students'
export default {
  name: 'StudentsIndex',
  data() {
    var checkPhone = (rule, value, callback) => {
      // 定义正则表达式
      const regPhone = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号!"));
    };
    var checkStdid = (rule, value, callback) => {
      // 定义正则表达式
      const regStdid = /^[0-9]{8,10}$/;
      if (regStdid.test(value)) {
        return callback();
      }
      callback(new Error("请输入8-10位的学号!"));
    };
    var checkEmail = (rule, value, callback) => {
      // 定义正则表达式
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的邮箱!"));
    };
    var checkPassword = (rule, value, callback) => {
      // 定义正则表达式
      const regPassword = /^[a-zA-Z0-9]{4,14}$/;
      if (regPassword.test(value)) {
        return callback();
      }
      callback(new Error("密码必须4到14位的数字或字母!"));
    };
    var checkPasswordConfirmation = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        return callback();
      }
    };
    var changePasswordConfirmation = (rule, value, callback) => {
      if (value !== this.editPwdForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        return callback();
      }
    };
    var checkYpassword = (rule, value, callback) => {
      // 定义正则表达式
      const regYpassword = /^[a-zA-Z0-9]{4,14}$/;
      if (regYpassword.test(value)) {
        return callback();
      }
      callback(new Error("原密码必须4到14位的数字或字母!"));
    };
    return {
      statusList:['拉黑','正常'],  
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status:null,
        created_at:[],
        updated_at:[]
      },
      addDialogVisible:false,
      editDialogVisible:false,
      downloadLoading: false,
      editPwdDialogVisible:false,
      addForm: {
        name: "",
        phone:"",
        email:"",
        stdid:"",
        class_id:"",
        grade_id:"",
        project_id:"",
        password: "",
        password_confirmation: "",
        status: 1,
        sex: 1,
        birth: ""
      },
      editForm: {
        id: "",
        name: "",
        phone:"",
        email:"",
        stdid:"",
        class_id:"",
        grade_id:"",
        project_id:"",
        status: 1,
        sex: 1,
        birth: ""
      },
      editPwdForm:{
         // 修改密码数据
        name:"",
        y_password: "",
        password: "",
        password_confirmation: "",
      },
      addRules: {
        birth: [
          { required: true, message: "请选择出生年月日！", trigger: "change" }
        ],  
        name: [
          { required: true, message: "请输入姓名！", trigger: "blur" },
          { min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur" }
        ],
        stdid: [
          { required: true, message: "请输入学号！", trigger: "blur" },
          { validator: checkStdid, trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号！", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱！", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码！", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" }
        ],
        password_confirmation: [
          { required: true, message: "请输入确认密码！", trigger: "blur" },
          { validator: checkPasswordConfirmation, trigger: "blur" }
        ]
      },
      editRules: {
        birth: [
          { required: true, message: "请选择出生年月日！", trigger: "change" }
        ],  
        stdid: [
          { required: true, message: "请输入学号！", trigger: "blur" },
          { validator: checkStdid, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱！", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名！", trigger: "blur" },
          { min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号！", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
      },
      editPwdRules:{
        y_password: [
          { required: true, message: "请输入原密码！", trigger: "blur" },
          { validator: checkYpassword, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码！", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" }
        ],
        password_confirmation: [
          { required: true, message: "请输入确认密码！", trigger: "blur" },
          { validator: changePasswordConfirmation, trigger: "blur" }
        ]
      },
      searchValue:[],
      addValue:[],
      sexList:['未知','男','女']
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    eventStartTime(val){
      this.listQuery.created_at = val
      this.handleFilter()
    },
    // 获取表格列表
    async getList() {
      this.listLoading = true
      studentsIndex(this.listQuery).then(response => {
        if(response.status === 20000){
          this.list = response.data.list
          this.total = response.data.total
        }
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置
    refresh(){
        this.listQuery = {
            page: 1,
            limit: 10,
            sex:null,   
            status:null,
            created_at:[],
            updated_at:[]
        }
        this.getList()
    },
    // 监听添加对话框的关闭事件
    addDialogClose() {
      this.addForm = {
            name: "",
            phone:"",
            eamil:"",
            stdid:"",
            class_id:"",
            grade_id:"",
            project_id:"",
            password: "",
            password_confirmation: "",
            status: 1,
            sex: 1,
            birth: ""
      }
      this.addValue = []
      this.$refs.addRef.resetFields()
    },
    // 添加按钮
    add() {
      this.$refs.addRef.validate(valid => {
        if (valid) {
          studentsStore(this.addForm).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })
              this.addDialogVisible = false
              this.getList()
            }
          })
        }
      })
    },
    // 状态调整
    setStatus(info) {
      studentsStatus({id:info.id,status:info.status}).then(response => {
        if(response.status === 20000){
          this.$base.message({message:response.message})
        }else{
          info.status = info.status?0:1
        }
      })
    },
    // 打开编辑按钮对话框
    edit(id) {
          this.editDialogVisible = true
      studentsEdit({id:id}).then(response => {
        if(response.status === 20000){
          this.editDialogVisible = true
          this.editForm = response.data
        }
      })
    },
    // 提交编辑数据
    update() {
      this.$refs.editRef.validate(valid => {
        if (valid) {
          studentsUpdate(this.editForm).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })
              this.editDialogVisible = false
              this.getList()
            }
          })
        }
      })
    },
    // 监听编辑对话框的关闭事件
    editDialogClose() {
        this.editForm = {
            id: "",
            name: "",
            phone:"",
            eamil:"",
            stdid:"",
            class_id:"",
            grade_id:"",
            project_id:"",
            password: "",
            password_confirmation: "",
            status: 1,
            sex: 1,
            birth: ""
      }
      this.$refs.editRef.resetFields()
    },
    editPwd(id,name) {
         this.editPwdDialogVisible = true
         this.editPwdForm.name = name
    },
     // 监听编辑对话框的关闭事件
     editPwdDialogClose() {
      this.editPwdForm={
        name:"",
        y_password:"",
        password:"",
        password_confirmation:""
      }
      this.$refs.editPwdRef.resetFields()
    },
    //修改密码
    updatePwd() {
      this.$base.confirm(
        { content: "确定要修改密码吗？" },
        () => {
          this.$refs.editPwdRef.validate(valid => {
        if (valid) {
          studentsChangePwd(this.editPwdForm).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })
              this.editPwdDialogVisible = false
              this.getList()
            }
          })
        }
      })
        }
      )
    },
    // 初始化密码
    studentsUpdatePwd(id) {
      this.$base.confirm(
        { content: "确定要初始化该管理员的密码为（123456）吗！" },
        () => {
          studentsUpdatePwd({id:id}).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })
            }
          })
        }
      )
    },
    // 导出数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '姓名','昵称','手机号','邮箱','地址','创建时间','状态','性别','出生年月日']
        const filterVal = ['id', 'name','nickname','phone','email','addess','created_at','status','sex','birth']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.name
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'addess') {
          return (v.province_to.name?v.province_to.name:'')+(v.city_to.name?v.city_to.name:'')+(v.county_to.name?v.county_to.name:'')
        }else if(j === 'sex'){
            return this.sexList[v[j]]
        }else if(j === 'status'){
            return this.statusList[v[j]]
        } else {
          return v[j]
        }
      }))
    }  
  }
}
</script>
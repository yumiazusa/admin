<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="success"
        icon="el-icon-refresh"
        @click="refresh()"
      >
        刷新列表
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="add('college')"
      >
        添加学院
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="add('grade')"
      >
        添加年级
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="add('department')"
      >
        添加系部
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="add('level')"
      >
        添加层次
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="addClass()"
      >
        添加班级
      </el-button>
      <el-button
        v-show="del"
        v-waves
        class="filter-item"
        type="info"
        icon="el-icon-delete"
        @click="delList()"
      >
        回收站
      </el-button>
      <el-button
        v-show="back"
        v-waves
        class="filter-item"
        type="info"
        icon="el-icon-back"
        @click="getList()"
      >
        返回
      </el-button>
    </div>
    <!-- 学院年级系部层次班级列表 -->
    <el-table
      v-show="mainList"
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children' }"
      empty-text="暂无数据"
    >
      <el-table-column min-width="2" label="项目">
        <template slot-scope="{ row }">
          <span>
            {{ row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        align="center"
        prop="sort"
        width="100px"
        sortable
      >
        <template slot-scope="{ row }">
          <el-input v-model="row.sort" @blur="setSorts(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="100px">
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.status === 1 ? '显示' : '隐藏'"
            placement="top"
            :enterable="false"
          >
            <el-switch
              v-if="row.type === 'class'"
              v-model="row.status"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              @change="setStatus(row)"
            ></el-switch>
            <el-switch
              v-else
              v-model="row.status"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              disabled
              @change="setStatus(row)"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="固定面板"
        prop="affix"
        width="100px"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.affix === 1 ? '是' : '否'"
            placement="top"
            :enterable="false"
          >
            <el-switch
              v-if="row.type === 'class'"
              v-model="row.affix"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              @change="setAffix(row)"
            ></el-switch>
            <el-switch
              v-else
              v-model="row.affix"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              disabled
              @change="setAffix(row)"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        min-width="5"
      >
        <template slot-scope="{ row }">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-s-custom"
            v-if="row.type === 'class'"
            @click="studentsForm(row.class_id)"
          >
            学生列表
          </el-button>
          <el-button
            v-if="row.type === 'class'"
            v-waves
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="edit(row.type, row.class_id)"
          >
            编辑
          </el-button>
          <el-button
            v-else
            v-waves
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="edit(row.type, row.type_id)"
          >
            编辑
          </el-button>
          <el-button
            v-waves
            size="mini"
            type="danger"
            icon="el-icon-delete"
            v-if="row.type === 'class'"
            @click="collegeDestroy(row.class_id)"
          >
            删除
          </el-button>
          <!-- <el-upload
            v-if="row.type === 'class'"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            style="display: inline-block; margin-left: 10px;"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 回收站列表 -->
    <el-table
      v-show="deleList"
      v-loading="loading"
      :data="deleteList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      empty-text="回收站无数据"
    >
      <el-table-column min-width="1" align="center" label="班级">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        align="center"
        prop="sort"
        width="100px"
        sortable
      >
        <template slot-scope="{ row }">
          <el-input disabled v-model="row.sort"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="100px">
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.status === 1 ? '显示' : '隐藏'"
            placement="top"
            :enterable="false"
          >
            <el-switch
              v-model="row.status"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="固定面板"
        prop="affix"
        width="100px"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.affix === 1 ? '是' : '否'"
            placement="top"
            :enterable="false"
          >
            <el-switch
              v-model="row.affix"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        min-width="2"
      >
        <template slot-scope="{ row }">
          <el-button
            v-waves
            type="primary"
            size="mini"
            icon="el-icon-refresh-left"
            @click="recycle(row.id)"
          >
            回收
          </el-button>
          <el-button
            v-waves
            size="mini"
            type="danger"
            icon="el-icon-delete-solid"
            @click="realDestroy(row.id)"
          >
            彻底删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加学院年级系部层次对话框 -->
    <el-dialog
      :title="'添加' + title"
      :visible.sync="dialogVisible"
      width="60%"
      @close="dialogClose"
    >
      <el-form label-width="100px" :model="form" :rules="rules" ref="ref">
        <el-form-item :label="title" prop="title">
          <el-input
            :placeholder="'请输入' + title + '名称'"
            maxlength="100"
            clearable
            show-word-limit
            v-model="form.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            placeholder="请输入排序"
            maxlength="10"
            clearable
            show-word-limit
            v-model="form.sort"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="primary(type)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑学院年级系部层次对话框 -->
    <el-dialog
      :title="'编辑' + typename + '信息'"
      :visible.sync="editCollegeVisible"
      width="60%"
      @close="editCollegeClose"
    >
      <el-form
        label-width="100px"
        :model="editCollegeForm"
        :rules="rules"
        ref="ref"
      >
        <el-form-item :label="typename + '信息'" prop="title">
          <el-input
            :placeholder="'请输入' + typename + '名称'"
            maxlength="100"
            clearable
            show-word-limit
            v-model="editCollegeForm.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            placeholder="请输入排序"
            maxlength="10"
            clearable
            show-word-limit
            v-model="editCollegeForm.sort"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editCollegeVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="updateCollege()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加班级对话框 -->
    <el-dialog
      title="添加班级"
      :visible.sync="dialogClassVisible"
      width="60%"
      @close="dialogClassClose"
    >
      <el-form label-width="100px" :model="classForm" :rules="rules" ref="ref">
        <el-form-item label="班级名称" prop="name">
          <el-input
            v-model="classForm.name"
            maxlength="30"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="所属学院" prop="college_id">
              <el-select
                v-model="classForm.college_id"
                placeholder="请选择学院"
                filterable
              >
                <el-option
                  v-for="item in attrList[0]"
                  :label="item.college"
                  :value="item.college_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属年级" prop="grade_id">
              <el-select
                v-model="classForm.grade_id"
                placeholder="请选择年级"
                filterable
              >
                <el-option
                  v-for="item in attrList[1]"
                  :label="item.grade"
                  :value="item.grade_id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="所属系部" prop="department_id">
              <el-select
                v-model="classForm.department_id"
                placeholder="请选择系部"
                filterable
              >
                <el-option
                  v-for="item in attrList[2]"
                  :label="item.department"
                  :value="item.department_id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="所属层次" prop="level_id">
              <el-select
                v-model="classForm.level_id"
                placeholder="请选择层次"
                filterable
              >
                <el-option
                  v-for="item in attrList[3]"
                  :label="item.level"
                  :value="item.level_id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            placeholder="请输入排序"
            maxlength="10"
            clearable
            show-word-limit
            v-model="classForm.sort"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassVisible = false">取 消</el-button>
        <el-button type="primary" @click="primaryClass()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑班级对话框 -->
    <el-dialog
      title="编辑班级信息"
      :visible.sync="editClassVisible"
      width="60%"
      @close="editClassClose"
    >
      <el-form
        v-loading="loading"
        label-width="100px"
        :model="editClassForm"
        :rules="rules"
        ref="ref"
      >
        <el-form-item label="班级名称" prop="name">
          <el-input
            v-model="editClassForm.name"
            maxlength="30"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="所属学院" prop="college_id">
              <el-select
                v-model="editClassForm.college_id"
                placeholder="请选择学院"
                filterable
              >
                <el-option
                  v-for="item in attrList[0]"
                  :label="item.college"
                  :value="item.college_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属年级" prop="grade_id">
              <el-select
                v-model="editClassForm.grade_id"
                placeholder="请选择年级"
                filterable
              >
                <el-option
                  v-for="item in attrList[1]"
                  :label="item.grade"
                  :value="item.grade_id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="所属系部" prop="department_id">
              <el-select
                v-model="editClassForm.department_id"
                placeholder="请选择系部"
                filterable
              >
                <el-option
                  v-for="item in attrList[2]"
                  :label="item.department"
                  :value="item.department_id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="所属层次" prop="level_id">
              <el-select
                v-model="editClassForm.level_id"
                placeholder="请选择层次"
                filterable
              >
                <el-option
                  v-for="item in attrList[3]"
                  :label="item.level"
                  :value="item.level_id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            placeholder="请输入排序"
            maxlength="10"
            clearable
            show-word-limit
            v-model="editClassForm.sort"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClassVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateClass()" :loading="submiting"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 班级学生列表对话框 -->
    <el-dialog width="90%" top="20px" :visible.sync="studentsFormVisible"  @close="studentsFormClose">
      <students :classid="classid" :isProps="false"></students>
    </el-dialog>
  </div>
</template>

<script>
import {
  collegeIndex,
  deleteList,
  collegeStore,
  getAttrList,
  classStore,
  classEdit,
  collegeUpdate,
  classUpdate,
  collegeStatus,
  collegeSorts,
  collegeAffix,
  collegeDestroy,
  collegeRecycle,
  realDestroy,
} from "@/api/students/college.js";
import Students from "@/views/students/students/studentsList/index.vue";
export default {
  name: "CollegeIndex",
  components: { Students },
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
      deleteList: [],
      title: "",
      type: "",
      id: "",
      typename: "",
      collegeList: [],
      collegeData: [],
      classid:'',
      submiting: false,
      loading: false,
      dialogVisible: false,
      dialogClassVisible: false,
      editClassVisible: false,
      editCollegeVisible: false,
      studentsFormVisible: false,
      deleList: false,
      mainList: true,
      typeList: {
        college: "学院",
        grade: "年级",
        department: "系部",
        level: "层次",
        class: "班级",
      },
      form: {
        type: "",
        title: "",
        sort: 1,
      },
      classForm: {
        name: "",
        college_id: "",
        sort: 1,
      },
      editClassForm: {
        name: "",
        college_id: "",
        grade_id: "",
        department_id: "",
        level_id: "",
        sort: "",
      },
      editCollegeForm: {
        sort: 1,
      },
      rules: {
        title: [{ required: true, message: "请输入必要信息", trigger: "blur" }],
        name: [{ required: true, message: "请输入必要信息", trigger: "blur" }],
        college_id: [
          { required: true, message: "请选择学院", trigger: "change" },
        ],
        grade_id: [
          { required: true, message: "请选择年级", trigger: "change" },
        ],
        department_id: [
          { required: true, message: "请选择系部", trigger: "change" },
        ],
        level_id: [
          { required: true, message: "请选择层次", trigger: "change" },
        ],
        sort: [
          { required: true, message: "请输入排序！", trigger: "blur" },
          { validator: checkSort, trigger: "blur" },
        ],
      },
      attrList: [],
      value1: [],
      options: [],
      college: [],
      grade: [],
      department: [],
      level: [],
      sorts: [],
      del: true,
      back: false,
    };
  },
  async created() {
    await this.getList();
  },
  methods: {
    // 获取表格列表
    async getList() {
      this.loading = true;
      collegeIndex().then((response) => {
        if (response.status === 20000) {
          this.list = response.data[4];
          this.collegeList = response.data[0];
          this.deleteList = [];
        }
        this.mainList = true;
        this.deleList = false;
        this.del = true;
        this.back = false;
        this.loading = false;
      });
    },
    //回收站列表
    delList() {
      this.loading = true;
      deleteList().then((response) => {
        if (response.status === 20000) {
          this.deleteList = response.data[4];
          this.list = [];
        }
        this.deleList = true;
        this.mainList = false;
        this.del = false;
        this.back = true;
        this.loading = false;
      });
    },
    //刷新主列表
    refresh() {
      this.getList();
      this.deleteList = [];
    },
    // 监听添加学院年级系部层次对话框的关闭事件
    dialogClose() {
      this.form = {
        type: "",
        title: "",
        sort: 1,
      };
    },
    // 监听添加班级对话框的关闭事件
    dialogClassClose() {
      this.classForm = {
        name: "",
        college_id: "",
        grade_id: "",
        department_id: "",
        level_id: "",
        sort: 1,
      };
    },
    // 监听编辑班级对话框的关闭事件
    editClassClose() {
      this.editClassForm = {
        name: "",
        college_id: "",
        grade_id: "",
        department_id: "",
        level_id: "",
        sort: 1,
      };
    },
    // 监听编辑学院年级系部层次对话框的关闭事件
    editCollegeClose() {
      this.editCollegeForm = {
        title: "",
        type: "",
        sort: 1,
      };
    },
    //添加学院年级系部层次对话框
    add(type) {
      switch (
        type //想要判断的变量
      ) {
        case "college": //状态一
          this.title = "学院";
          this.type = type;
          break;
        case "grade": //状态二
          this.title = "年级";
          this.type = type;
          break;
        case "department": //状态三
          this.title = "系部";
          this.type = type;
          break;
        case "level": //状态四
          this.title = "层次";
          this.type = type;
          break;
      }
      this.dialogVisible = true;
    },
    //添加班级对话框
    async addClass() {
      console.log(this.list);
      this.dialogClassVisible = true;
      await this.getAttrList();
    },
    //提交添加班级
    primaryClass() {
      this.$refs.ref.validate((valid) => {
        if (valid) {
          classStore(this.classForm).then((response) => {
            if (response.status === 20000) {
              this.$base.message({ message: response.message });
              this.getList();
              this.dialogClassVisible = false;
            }
          });
        }
      });
    },
    // 提交添加学院年级系部层次编辑按钮
    primary(type) {
      this.form.type = type;
      this.$refs.ref.validate((valid) => {
        if (valid) {
          if (type) {
            collegeStore(this.form).then((response) => {
              if (response.status === 20000) {
                this.$base.message({ message: response.message });
                this.dialogVisible = false;
              }
            });
          }
        }
      });
    },
    // 打开编辑（学院年级系部层次及班级）对话框
    async edit(type, id) {
      this.collegeData["type"] = type;
      this.collegeData["id"] = id;
      this.loading = true;
      if (type == "class") {
        classEdit(id, type).then((classresponse) => {
          if (classresponse.status === 20000) {
            this.editClassVisible = true;
            this.editClassForm = classresponse.data[0];
            this.getAttrList();
            this.loading = false;
          }
        });
      } else {
        classEdit(id, type).then((response) => {
          if (response.status === 20000) {
            this.editCollegeVisible = true;
            this.editCollegeForm = response.data[0];
            switch (
              this.editCollegeForm.type //想要判断的变量
            ) {
              case "college": //状态一
                this.typename = "学院";
                break;
              case "grade": //状态二
                this.typename = "年级";
                break;
              case "department": //状态三
                this.typename = "系部";
                this.type = type;
                break;
              case "level": //状态四
                this.typename = "层次";
                break;
            }
            this.loading = false;
          }
        });
      }
    },
    //提交学院年级系部层次编辑
    updateCollege() {
      this.$refs.ref.validate((valid) => {
        if (valid) {
          collegeUpdate(this.editCollegeForm).then((response) => {
            console.log(response);
            if (response.status === 20000) {
              this.$base.message({ message: response.message });
              this.getList();
              this.editCollegeVisible = false;
            }
          });
        }
      });
    },
    //提交班级编辑
    updateClass() {
      console.log(this.editClassForm);
      this.$refs.ref.validate((valid) => {
        if (valid) {
          classUpdate(this.editClassForm).then((response) => {
            if (response.status === 20000) {
              this.$base.message({ message: response.message });
              this.getList();
              this.editClassVisible = false;
            }
          });
        }
      });
    },
    // 状态调整
    setStatus(info) {
      collegeStatus({ id: info.class_id, status: info.status }).then(
        (response) => {
          if (response.status === 20000) {
            this.$base.message({ message: response.message });
          } else {
            info.status = info.status ? 0 : 1;
          }
        }
      );
    },
    // 是否固定面板
    setAffix(info) {
      collegeAffix({ id: info.class_id, affix: info.affix }).then(
        (response) => {
          if (response.status === 20000) {
            this.$base.message({ message: response.message });
          } else {
            info.affix = info.affix ? 0 : 1;
          }
        }
      );
    },
    //班级放入回收站
    collegeDestroy(id) {
      this.$base.confirm(
        { content: "确定要将该班级吗和属于这个班级的学生放入回收站？" },
        () => {
          collegeDestroy({ id: id }).then((response) => {
            if (response.status === 20000) {
              this.$base.message({ message: response.message });
              this.getList();
            }
          });
        }
      );
    },
    //回收班级
    recycle(id) {
      this.$base.confirm({ content: "确定恢复这个班级及班级学生吗？" }, () => {
        collegeRecycle({ id: id }).then((response) => {
          if (response.status === 20000) {
            this.$base.message({ message: response.message });
            this.delList();
          }
        });
      });
    },
    //真删除班级
    realDestroy(id) {
      this.$base.confirm(
        { content: "确定删除此班级及班级下的学生吗？" },
        () => {
          realDestroy({ id: id }).then((response) => {
            if (response.status === 20000) {
              this.$base.message({ message: response.message });
              this.delList();
            }
          });
        }
      );
    },
    //设置排序
    setSorts(info) {
      if (info.type == "class") {
        this.sorts["id"] = info.class_id;
        this.sorts["type"] = info.type;
        this.sorts["sort"] = info.sort;
      } else {
        this.sorts["id"] = info.type_id;
        this.sorts["type"] = info.type;
        this.sorts["sort"] = info.sort;
      }
      collegeSorts({
        id: this.sorts.id,
        sort: this.sorts.sort,
        type: this.sorts.type,
      }).then((response) => {
        if (response.status === 20000) {
          this.$base.message({ message: response.message });
          this.getList();
        } else {
          this.getList();
        }
      });
    },
    //获取学院年级系部层次信息列表
    async getAttrList() {
      getAttrList().then((response) => {
        if (response.status === 20000) {
          this.attrList = response.data;
        }
      });
    },
    studentsForm(id){
      this.studentsFormVisible = true
      this.classid = id
    },
    studentsFormClose(){
      this.studentsFormVisible = false
      this.classid= null
      console.log(this.classid)
    }
  },
};
</script>

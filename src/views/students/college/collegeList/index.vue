<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="add('college')"
      >
        添加学院
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="add('grade')"
      >
        添加年级
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="add('department')"
      >
        添加系部
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="add('level')"
      >
        添加层次
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="addClass()"
      >
        添加班级
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children' }"
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
            type="success"
            size="mini"
            v-if="row.type === 'level'"
            @click="collegePidArr(row.id)"
          >
            添加班级
          </el-button>
          <el-button
            v-if="row.type === 'class'"
            v-waves
            type="primary"
            size="mini"
            @click="edit(row.type, row.class_id)"
          >
            编辑
          </el-button>
          <el-button
            v-else
            v-waves
            type="primary"
            size="mini"
            @click="edit(row.type, row.type_id)"
          >
            编辑2
          </el-button>
          <el-button
            v-waves
            size="mini"
            type="danger"
            v-if="row.type === 'class'"
            @click="collegeDestroy(row.id)"
          >
            删除
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
        <el-button v-waves type="primary" @click="primary(type)"
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
        <el-button type="primary" @click="primaryClass()" :loading="submiting"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  collegeIndex,
  collegeStore,
  getAttrList,
  classStore,
  classEdit,
  collegeUpdate,
  collegeEdit,
  collegeStatus,
  collegeOpen,
  collegeAffix,
} from "@/api/students/college.js";
export default {
  name: "CollegeIndex",
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
      title: "",
      type: "",
      id: "",
      typename: "",
      collegeList: [],
      collegeData: [],
      submiting: false,
      loading: false,
      dialogVisible: false,
      dialogClassVisible: false,
      editClassVisible: false,
      editCollegeVisible: false,
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
        }
        this.loading = false;
      });
    },
    // 监听添加编辑对话框的关闭事件
    dialogClose() {
      this.form = {
        type: "",
        title: "",
        sort: 1,
      };
    },
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
    editCollegeClose() {
      this.editCollegeForm = {
        title: "",
        type:"",
        sort: 1,
      };
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
    //添加学院年级系部层次
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
    //添加班级
    async addClass() {
      this.dialogClassVisible = true;
      await this.getAttrList();
    },
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
    // 添加编辑按钮
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
    // 打开编辑按钮对话框
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
    // 状态调整
    setStatus(info) {
      collegeStatus({ id: info.id, status: info.status }).then((response) => {
        if (response.status === 20000) {
          this.$base.message({ message: response.message });
        } else {
          info.status = info.status ? 0 : 1;
        }
      });
    },
    // 是否验证权限
    setAuthOpen(info) {
      collegeOpen({ id: info.id, auth_open: info.auth_open }).then(
        (response) => {
          if (response.status === 20000) {
            this.$base.message({ message: response.message });
          } else {
            info.auth_open = info.auth_open ? 0 : 1;
          }
        }
      );
    },
    // 是否固定面板
    setAffix(info) {
      collegeAffix({ id: info.id, affix: info.affix }).then((response) => {
        if (response.status === 20000) {
          this.$base.message({ message: response.message });
        } else {
          info.affix = info.affix ? 0 : 1;
        }
      });
    },
    // 删除
    collegeDestroy(id) {
      this.$base.confirm(
        { content: "确定要删除该项菜单吗（会同时删除子菜单）！" },
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
    setSorts(info) {
      collegeSorts({ id: info.id, sort: info.sort }).then((response) => {
        if (response.status === 20000) {
          this.$base.message({ message: response.message });
        } else {
          this.getList();
        }
      });
    },
    collegePidArr(pid) {
      collegePidArr({ pid: pid }).then((response) => {
        if (response.status === 20000) {
          this.value = response.data;
          this.form.pid = pid;
          this.dialogVisible = true;
          this.title = "添加";
        }
      });
    },
    async getAttrList() {
      getAttrList().then((response) => {
        if (response.status === 20000) {
          this.attrList = response.data;
        }
      });
    },
  },
};
</script>

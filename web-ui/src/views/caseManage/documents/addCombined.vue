<template>
  <div>
    <Dialog
      :title="title"
      :show.sync="dialogVisible"
      :height="500"
      width="60%"
      @openDialog="openDialog"
    >
      <template v-slot:default>
        <div class="add-template">
          <p>基本信息</p>
        </div>
        <el-form
          ref="form"
          class="custom-display"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="字段名称：" prop="fieldName">
            <el-input
              :disabled="title == '编辑组合字段'"
              v-model="form.fieldName"
              placeholder="请输入字段名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="字段英文名：" prop="englishName">
            <el-input
              :disabled="title == '编辑组合字段'"
              v-model="form.englishName"
              placeholder="请输入字段英文名"
            ></el-input>
          </el-form-item>
          <el-form-item label="格式类型：" prop="formatType">
            <el-select
              @change="handleChange"
              v-model="form.formatType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in combinationType"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段内容：" prop="fieldContent">
            <span style="color: #72b9e0; font-size: 12px"
              >请在框内编辑循环语句内容，用${字段英文名}表示需要映射的字段，可点击“查看字段表”查看字段，支持换行。</span
            >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.fieldContent"
            />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog/index";
import templateApi from "@/api/case/document/templateIndex";

export default {
  name: "addTemplate",
  components: { Dialog },
  data() {
    return {
      form: {
        fieldName: "",
        englishName: "",
        formatType: "",
        fieldContent: "",
      },
      rules: {
        fieldName: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
        ],
        englishName: [
          { required: true, message: "请输入字段英文名", trigger: "blur" },
        ],
        formatType: [
          { required: true, message: "请选择格式类型", trigger: "blur" },
        ],
        fieldContent: [
          { required: true, message: "请输入字段内容", trigger: "blur" },
        ],
      },
      combinationType: [], //格式类型
      sigForm: {
        chooseSignature: [],
      },
    };
  },
  props: {
    // 传参控制弹窗显示隐藏
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    id: {
      type: String,
    },
    getList: {
      type: Function,
      default: null,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.openDialog();
    },
    openDialog() {
      //initObj(this.form);
      this.form = {
        fieldName: "",
        englishName: "",
        formatType: "",
        fieldContent: "",
      };
      this.fileList = [];
      this.resetAddForm();
      //编辑查详情
      if (this.id) {
        this.form.id = this.id;
        templateApi.getField(this.id).then((response) => {
          this.form = response.data;
        });
      }
      //格式类型
      this.getDicts("combination_type").then((response) => {
        this.combinationType = response.data;
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            templateApi.combinateRecord(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            templateApi.combinateadd(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.dialogVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    //重置表单清除验证
    resetAddForm() {
      try {
        this.$refs["form"].resetFields();
      } catch (e) {}
    },
    //转变格式类型
    handleChange(value) {
      //console.log(value)
      this.sigForm.chooseSignature = [];
      if (value == 0) {
        this.sigForm.chooseSignature.push(this.signatureList[0]);
        this.sigForm.chooseSignature[0].pid = this.signatureList[0].id;
      }
    },
  },
};
</script>

<style scoped>
.el-dialog__body {
  height: 20px;
}
</style>
<style lang="scss">
.add-template {
  .sig-style {
    width: 100%;
  }
  .custom-display {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      width: 48%;
      /*.el-form-item__label{*/
      /*text-align: left;*/
      /*}*/
    }
  }
  .more_little {
    position: absolute;
    right: 36%;
    bottom: 30px;
    font-size: 30px;
    color: #409eff;
  }
  .font-big i {
    font-size: 30px;
    margin-right: 20px;
    color: #409eff;
  }
}

.add-template {
  > p {
    padding: 0px 0 10px 16px;
    color: #409eff;
    font-size: 16px;
    position: relative;
    font-weight: bold;
  }
  > p::before {
    position: absolute;
    top: 4px;
    left: 0;
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: #409eff;
  }
  .el-upload__tip {
    line-height: 16px;
  }
}
.move-left {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.border-style-custom {
  border: 1px solid #e6ebf5;
  padding: 10px;
  min-height: 190px;
  border-top: none;
  border-radius: 4px;

  .el-tree-node.is-current > .el-tree-node__content {
    color: #409eff;
    background-color: transparent;
    border-radius: 4px;
  }

  .el-tree-node > .el-tree-node__content:hover {
    background-color: transparent;
  }

  .el-tree-node.is-current > .el-tree-node__content:after {
    content: "\e6da";
    font-family: element-icons !important;
    padding-left: 10px;
    font-weight: bolder;
  }

  .el-tree-node > .el-tree-node__children {
    overflow: unset;
  }
}
.book-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #409eff;
}
.drag-box {
  border: 1px solid #e6ebf5;
  margin: 10px 0;
  padding: 10px;
  min-height: 50px;
  li {
    list-style: none;
    height: 30px;
    border-bottom: 1px solid #f3eeee;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p:first-of-type {
      width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  li:last-of-type {
    border-bottom: none;
  }
}
/*.file-header{*/
/*display: flex;*/
/*justify-content: space-between;*/
/*>p{*/
/*display: flex;*/
/*align-items: center;*/
/*}*/
/*.el-button{*/
/*margin-right: 10px;*/
/*}*/
/*}*/
.font-number {
  position: absolute;
  bottom: -20px;
  right: 2px;
  color: #999999;
}
</style>

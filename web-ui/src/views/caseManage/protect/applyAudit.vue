<template>
  <Dialog
    :title="title"
    :height="600"
    :show.sync="dialogVisible"
    width="60%"
    @openDialog="openDialog"
  >
    <template v-slot:default>
      <el-form
        class="formcustom-display"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="姓名：">
          <el-input
            disabled
            style="width: 200px"
            v-model="form.respondentName"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批结果：" prop="choice">
          <el-radio-group v-model="project_operate">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="0">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="审批意见："
          v-if="project_operate == 0"
          prop="options"
        >
          <el-input
            v-model="form.options"
            :rows="8"
            type="textarea"
            placeholder="请输入审批意见"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="财保案号："
          v-if="project_operate == 1"
          prop="propertyProNo"
        >
          <el-input
            style="width: 200px"
            v-model="form.propertyProNo"
            placeholder="请输入财保案号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label-width="121px"
          label="冻结开始时间："
          v-if="project_operate == 1"
          prop="frozenStartTime"
        >
          <el-date-picker
            v-model="form.frozenStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label-width="121px"
          label="首次冻结金额："
          v-if="project_operate== 1"
          prop="frozenAmount"
        >
          <el-input
            style="width: 200px"
            v-model="form.frozenAmount"
            placeholder="请输入首次冻结金额"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="车辆情况："
          v-if="project_operate == 1"
        >
          <el-input
            style="width: 200px"
            v-model="form.vehicle"
            placeholder="请输入车辆情况"
          ></el-input>
          <!-- <el-select v-model="formvehicle" placeholder="请选择">
            <el-option
              v-for="item in vehicle"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="房屋情况：" v-if="project_operate == 1">
          <el-select v-model="formhouse" placeholder="请选择">
            <el-option
              v-for="item in house"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "@/components/Dialog/index";
import { initObj } from "@/utils/common";
import divisionApi from "@/api/case/division/index";
export default {
  //多元调解成功
  name: "applyAudit",
  components: { Dialog },
  data() {
    return {
      form: {
        id: "",
        choice: "",
        propertyProNo: "",
        frozenStartTime: "",
        frozenAmount: "",
        respondentName: "",
        options: "",
        house: '',
        vehicle: null,
      },
      // formvehicle:'0',
      formhouse:'',
      project_operate: "",
      house: [],
      rules: {
        choice: [
          { required: true, message: "请选择审批结果", trigger: "change" },
        ],
        propertyProNo: [
          { required: true, message: "请输入财保案号", trigger: "blur" },
        ],
        frozenStartTime: [
          {
            required: true,
            message: "请选择财保案号冻结开始时间",
            trigger: "change",
          },
        ],
        frozenAmount: [
          { required: true, message: "请输入首次冻结金额", trigger: "blur" },
        ],
        options: [
          { required: true, message: "请输入审批意见", trigger: "blur" },
        ],
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
      type: Number,
      default: -999,
    },
    cid: {
      type: String,
      default: '',
    },
    item: {
      type: String,
      default: "",
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
  watch: {
    project_operate(val) {
      this.form.choice = val;
    },
  },
  created() {
    //房类型
    this.getDicts("yes_no").then((response) => {
      this.house = response.data;
    });
  },
  methods: {
    openDialog() {
      initObj(this.form);
      this.resetAddForm();
      this.form = JSON.parse(this.item);
      this.form.id = this.id;
      this.formhouse= '0';
      this.project_operate = 1;
    },
    //重置表单清除验证
    resetAddForm() {
      try {
        this.$refs["form"].resetFields();
      } catch (e) {}
    },
    submit() {
      this.form.choice = this.project_operate;
      console.log(this.form.choice);
      if (this.form.choice == 0) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let param = {
              options: this.form.options,
              choice: this.form.choice,
              cid: this.cid,
              id: this.id,
            };
            divisionApi.reviewProperty(param).then((res) => {
              if (res.code === 200) {
                this.msgSuccess("操作成功");
                this.$emit("refresh");
                this.dialogVisible = false;
              }
            });
          }
        });
      }
      if (this.form.choice == 1) {
        this.form.house = this.formhouse;
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let param = {
              cid: this.cid,
              id: this.id,
              choice: this.form.choice,
              propertyProNo: this.form.propertyProNo,
              frozenStartTime: this.form.frozenStartTime,
              frozenAmount: this.form.frozenAmount,
              respondentName: this.form.respondentName,
              house: this.form.house,
              vehicle: this.form.vehicle,
            };
            divisionApi.reviewProperty(param).then((res) => {
              if (res.code === 200) {
                this.msgSuccess("操作成功");
                this.$emit("refresh");
                this.dialogVisible = false;
              }
            });
          }
        });
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
.formcustom-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-form-item {
    width: 60%;
  }
}
</style>

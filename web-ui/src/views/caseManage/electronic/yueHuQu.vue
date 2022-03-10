<template>
  <div class="app-container">
        <div class="box">
          <p class="box-title">印章基本信息</p>
          <el-descriptions style="height: auto;margin-top:20px;" :column="2" border>
            <el-descriptions-item>
              <template slot="label">
                印章别名
              </template>
              {{eleSignature.name}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                印章id
              </template>
              {{eleSignature.signId}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                授权企业主体名称
              </template>
              {{eleSignature.entName}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">

              </template>

            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                授权企业证件类型
              </template>
              {{eleSignature.entIdeType}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                授权企业证件号
              </template>
              {{eleSignature.entIdeNum}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                授权生效时间
              </template>
              {{eleSignature.startTime}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                授权失效时间
              </template>
              {{eleSignature.finishTime}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                印章业务类型
              </template>
              {{eleSignature.signType}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">

              </template>

            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="box">
          <p class="box-title">印章样式</p>
          <div class="demo-image">
            <el-image :src="src"></el-image>
          </div>
        </div>
        <div class="box">
          <p class="box-title">电子签章审核</p>
          <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="审核类型：" prop="checkType">
              <el-select style="width:300px" filterable v-model="form.checkType" placeholder="请选择审核类型">
                <el-option v-for="item in checkTypeData" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核人员：" v-if="form.checkType == 1" prop="checkMan">
              <el-select style="width:300px" filterable v-model="form.checkMan" multiple placeholder="请选择审核人员">
                <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="box">
          <p class="box-title">电子签章状态设置</p>
          <el-form ref="form" :model="form" label-width="100px">
            <span
              style="color:red;font-size:14px;margin-left:20px;">提示：电子签章失效或状态为停用后，系统不再加盖该电子签章，新的模版设置不再提供该签章进行选择直至重新启用</span>
            <el-form-item label="模版状态：">
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </div> -->
  </div>
</template>

<script>
  import electronicApi from "@/api/case/electronic/index";
  import {
    treeselect
  } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";

  export default {
    name: "signatureAudit",
    components: {},
    data() {
      return {
        src: '',
        value: true,
        form: {
          checkType: '',
          checkMan: [],
        },
        userList: [],
        checkTypeData: [],
        eleSignature: {},
        rules: {
          checkType: [{
            required: true,
            message: '请选择审核类型',
            trigger: 'blur'
          }],
          checkMan: [{
            required: true,
            message: '请选择审核人员',
            trigger: 'blur'
          }],
        },
      }
    },
    created() {
      this.getListTwo();
      //审核类型
      this.getDicts("check_type").then((response) => {
        this.checkTypeData = response.data;
      });
    },
    methods: {
      /** 查询月湖区签章信息 */
      getListTwo() {
        electronicApi.electronSign(5).then(
          (response) => {
            this.eleSignature = response.data.eleSignature;
            this.src = `data:image/png;base64,${this.eleSignature.signStyle}`;
            this.form.checkType = this.eleSignature.checkType ? `${this.eleSignature.checkType}` : '1'
            this.form.checkMan = this.eleSignature.chechMans || []
            this.userList = response.data.userList || []
          }
        );
      },
      //保存内容
      onSubmit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let param
            if (this.form.checkType == 1) {
              param = {
                id: this.eleSignature.id,
                checkType: this.form.checkType,
                checkMan: this.form.checkMan.join(",")
              };
            } else if (this.form.checkType == 2) {
              this.form.checkMan = []
              param = {
                id: this.eleSignature.id,
                checkType: this.form.checkType,
              };
            }
            electronicApi.editElectron(param).then(
              (response) => {
                if (response.code == 200) {
                  this.$message.success('保存成功')
                }
              }
            );
          }
        })
      }
    }
  }

</script>

<style scoped lang="scss">
  .app-container {
    .demo-image {
      margin-top: 20px;
      margin-left: 8%;
      width: 250px;
    }

    .tree-box {
      max-width: 300px;
      border: 1px solid #e6ebf5;
      padding: 10px;
    }
  }

</style>

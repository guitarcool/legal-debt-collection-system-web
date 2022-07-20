<template>
  <Dialog
    :title="title"
    :height="500"
    :show.sync="dialogVisible"
    width="50%"
    @openDialog="openDialog"
  >
    <template v-slot:default>
      <!-- 分配权限内容 -->
      <div class="import-content">
        <div class="import-div">
          <span style="font-size: 16px"
            >当前状态:&nbsp;&nbsp;{{ headline }}</span
          >
        </div>

        <p>
          为减少上传错误，请下载案件导入模版后按照模版格式要求进行数据填写后再上传!
        </p>
        <el-link
          type="info"
          style="font-size: 16px; margin: 10px 0; color: #1890ff"
          @click="importTemplate"
          ><i class="el-icon-download"></i>点击下载导入模版</el-link
        >
        <el-upload
          ref="upload"
          :limit="1"
          class="covered-with"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :disabled="upload.isUploading"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip"></div>
          <div class="el-upload__tip" style="color: red" slot="tip">
            提示：仅允许导入“xls”或“xlsx”格式文件！
          </div>
        </el-upload>
      </div>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "@/components/Dialog/index";
import { getToken } from "@/utils/auth";
import civilActionApi from "@/api/case/civilAction/index";
export default {
  name: "importDialog",
  components: { Dialog },
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
    headline: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: -999,
    },
    importData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      // 用户导入参数
      upload: {
        batchNo: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: "",
      },
      file:null,
    };
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
  methods: {
    openDialog() {
      if (this.id === 7) {
        this.upload.url =
          process.env.VUE_APP_BASE_API + "/case/postAdjudged/batchFiledCase";
      } else if (this.id === 8) {
        this.upload.url =
          process.env.VUE_APP_BASE_API + "/case/postAdjudged/batchJudgedCase";
      } else if (this.id === 10) {
        this.upload.url =
          process.env.VUE_APP_BASE_API + "/case/postAdjudged/batchExecuted";
      } else if (this.id === 11) {
        this.upload.url =
          process.env.VUE_APP_BASE_API + "/case/postAdjudged/batchEnforced";
      }
    },
    // 提交上传文件
    submit() {
      this.$refs.upload.submit();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      //console.log(file)
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.file = file;
      this.dialogVisible = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.$emit("refresh");
    },
    /** 下载模版操作 */
    importTemplate() {
      if (this.id === 7) {
        civilActionApi.importFiledCaseTemplate(this.importData).then((response) => {
          this.download(response.msg);
        });
      } else if (this.id === 8) {
        civilActionApi.importJudgedTemplate(this.importData).then((response) => {
          this.download(response.msg);
        });
      } else if (this.id === 10) {
        civilActionApi.importExecutedTemplate(this.importData).then((response) => {
          this.download(response.msg);
        });
      } else if (this.id === 11) {
        civilActionApi.importEnforcedTemplate(this.importData).then((response) => {
          this.download(response.msg);
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-dialog__body {
  height: 20px;
}
.import-content {
  > p {
    margin: 5px 0;
    position: relative;
    padding-left: 20px;
    line-height: 20px;
  }
  > p::before {
    position: absolute;
    top: 6px;
    left: 0;
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: red;
  }
  .import-div {
    display: flex;
    align-items: center;
  }
}
</style>

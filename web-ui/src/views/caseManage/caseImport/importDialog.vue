<template>
    <Dialog :title="title" :height="500" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 分配权限内容 -->
            <div class="import-content" v-loading="loading">
                <!-- <div class="import-div">
          <div>
            <span style="color: red; font-size: 20px">*</span>
            <span style="color: black">案件批次号:</span>
          </div>
          <el-input
            type="text"
            placeholder="请输入案件批次号"
            v-model="upload.batchNo"
            style="width: 300px; margin-left: 10px"
            maxlength="10"
            show-word-limit
          >
          </el-input>
        </div> -->

                <p>
                    为减少上传错误，请下载案件导入模版后按照模版格式要求进行数据填写后再上传!
                </p>
                <p>
                    若对已有案件进行数据更新，请填写内部订单号及需更新的字段项，无需更改的字段项请勿填写，否则数据将被覆盖！
                </p>
                <el-link type="info" style="font-size: 16px; margin: 10px 0; color: #1890ff" @click="importTemplate"><i
                        class="el-icon-download"></i>点击下载导入模版</el-link>
                <el-upload ref="upload" :limit="1" class="covered-with" accept=".xlsx, .xls" :headers="upload.headers"
                    :action="upload.url" :on-change='handleFileUploadChange' :on-remove="removeFile"
                    :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
                    :disabled="upload.isUploading" :auto-upload="false" drag>
                    <!-- :action="upload.url + '?batchNo=' + upload.batchNo" -->
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
            <el-button type="primary" v-debounce @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import {
        getToken
    } from "@/utils/auth";
    import importApi from "@/api/case/import/index";
    export default {
        name: "importDialog",
        components: {
            Dialog
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
        },
        watch: {
            show(val) {
                if (val === false) {
                    // this.upload.batchNo = "";
                }
            },
        },
        data() {
            return {
                // 用户导入参数
                upload: {
                    // batchNo: "",
                    // 是否禁用上传
                    isUploading: false,
                    // 是否更新已经存在的用户数据
                    updateSupport: 0,
                    // 设置上传的请求头部
                    headers: {
                        Authorization: "Bearer " + getToken()
                    },
                    // 上传的地址
                    url: process.env.VUE_APP_BASE_API + "/case/caseInfo/importData",
                },
                loading: false,
                file: '',
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
                this.removeFile();
                this.loading = false;
            },
            // // 提交上传文件
            // submit() {
            //   if (this.upload.batchNo != "") {
            //     this.loading = true;
            //     this.$refs.upload.submit();
            //   } else {
            //     this.$message({
            //       message: "请输入案件批次号！",
            //       type: "warning",
            //     });
            //   }
            // },
            removeFile(file) {
                this.file = ''
            },
            // 提交上传文件
            submit() {
                if (this.file) {
                    this.loading = true;
                    this.$refs.upload.submit();
                } else {
                    this.msgError('请确认是否上传了正确的文件在提交！');
                }
            },
            handleFileUploadChange(file, fileList) {
                // 以检查文件是否为.xls .xlsx;
                const fileName = file.name;
                const fileType = fileName.substring(fileName.lastIndexOf('.'));
                if (fileType === '.xls' || fileType === '.xlsx') {
                    this.file = file;
                } else {
                    this.file = '';
                    this.msgError('仅允许导入"xls"或"xlsx"格式文件！');
                }
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                this.upload.isUploading = true;
            },
            // 文件上传成功处理
            handleFileSuccess(response, file, fileList) {
                //console.log(file)
                this.dialogVisible = false;
                this.upload.isUploading = false;
                this.$refs.upload.clearFiles();
                this.$alert(response.msg, "导入结果", {
                    dangerouslyUseHTMLString: true
                });
                this.loading = false;
                this.$emit("refresh");
            },
            /** 下载模版操作 */
            importTemplate() {
                importApi.importTemplate().then((response) => {
                    this.download(response.msg);
                });
            },
        },
    };

</script>

<style scoped lang="scss">
    .el-dialog__body {
        height: 20px;
    }

    .import-content {
        >p {
            margin: 5px 0;
            position: relative;
            padding-left: 20px;
            line-height: 20px;
        }

        >p::before {
            position: absolute;
            top: 6px;
            left: 0;
            content: "";
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
        }

        .el-upload__tip {}

        .import-div {
            display: flex;
            align-items: center;
        }
    }

</style>

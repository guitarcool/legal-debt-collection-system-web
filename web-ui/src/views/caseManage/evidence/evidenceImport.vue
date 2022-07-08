<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <div class="custom-evidence" v-loading="loading">
                <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                    <el-form-item label="分案名：" prop="divisionName">
                        <el-input v-model="form.divisionName"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="案件发布公司：" prop="publishCompany">
                        <el-select v-model="form.publishCompany" filterable clearable placeholder="请选择">
                            <el-option v-for="item in companies" :key="item.dictValue" :label="item.dictLabel"
                                :value="item.dictLabel">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="案件类型：" prop="caseType">
                        <el-select v-model="form.caseType" filterable placeholder="请选择">
                            <el-option v-for="item in typeOptions" :key="item.dictValue" :label="item.dictLabel"
                                :value="item.dictValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-form>
                <div style="display:flex;flex-direction: column;align-items: baseline;">
                    <el-link type="info" style="font-size: 16px; margin: 10px 0; color: #1890ff"
                        @click="importTemplate"><i class="el-icon-download"></i>点击下载还款详情导入模版</el-link>
                    <el-link type="info" style="font-size: 16px; margin: 10px 0;" @click="downFile"><i
                            class="el-icon-download"></i>点击下载导入说明</el-link>
                </div>

                <div class="evidence-import">
                    <!--<p>若对已有案件进行数据更新，请填写内部订单号及需更新的字段项，无需更改的字段项请勿填写，否则数据将被覆盖！</p>-->
                    <el-upload class="upload-demo covered-with" action="string" :limit="1" :http-request="handleUplod"
                        :disabled="isUploading" accept=".zip" :on-change="fileOnChange" :on-remove="removeFile"
                        :before-upload="beforeAvatarUpload" drag :file-list="fileList">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">

                        </div>
                        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入zip格式文件！</div>
                    </el-upload>
                </div>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import {
        getToken
    } from "@/utils/auth";
    import axios from 'axios'
    import {
        initObj
    } from '@/utils/common'
    import importApi from "@/api/case/import/index";

    export default {
        //已判决
        name: "evidenceImport",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    caseType: '',
                    remark: '',
                    divisionName: '',
                    // publishCompany: '',
                    remittanceTime: ''
                },
                upload_url: process.env.VUE_APP_BASE_API + '/evidence/package/importData', //上传URL
                files: '',
                // 是否禁用上传
                isUploading: false,
                rules: {
                    divisionName: [{
                        required: true,
                        message: '请输入分案名',
                        trigger: 'blur'
                    }],
                    // publishCompany: [{
                    //     required: true,
                    //     message: '请选择案件发布公司',
                    //     trigger: 'change'
                    // }],
                    caseType: [{
                        required: true,
                        message: '请选择消费类型',
                        trigger: 'change'
                    }]
                },
                typeOptions: [],
                fileList: [],
                companies: [],
                loading: false
            }
        },
        props: {
            // 传参控制弹窗显示隐藏
            show: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            id: {
                type: Number,
                default: 0
            },
            type: {
                type: Number,
                default: 0
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.show
                },
                set(val) {
                    this.$emit('update:show', val)
                }
            }
        },
        created() {
            //案件类型
            this.getDicts("case_type").then((response) => {
                this.typeOptions = response.data;
            });
            //案件发布公司
            this.getDicts("compony").then((response) => {
                this.companies = response.data;
            });
        },
        methods: {
            openDialog() {
                initObj(this.form)
                this.resetAddForm();
                this.form.id = this.id
                this.removeFile()
                this.fileList = [];
                this.loading = false
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            /** 下载模版操作 */
            importTemplate() {
                importApi.evidenceTemplate().then((response) => {
                    this.download(response.msg);
                });
            },
            /** 下载模版操作 */
            downFile() {
                window.open(process.env.BASE_URL + '证据包格式说明.pdf')
                //  window.location.href = process.env.BASE_URL + 'favicon.ico'
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid && this.files) {
                        this.loading = true;
                        let formData = new FormData();
                        formData.append("file", this.files);
                        formData.append("divisionName", this.form.divisionName);
                        // formData.append("publishCompany", this.form.publishCompany);
                        formData.append("caseType", this.form.caseType);
                        formData.append("remark", this.form.remark);
                        const instance = axios.create({
                            withCredentials: true
                        });
                        instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
                        var that = this
                        instance({
                            method: 'post',
                            url: process.env.VUE_APP_BASE_API + '/evidence/package/importData',
                            data: formData,
                            timeout: 600000,
                            processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                            contentType: false, // 告诉axios不要去设置Content-Type请求头
                            // config: {
                            //     headers: {'Content-Type': 'multipart/form-data'}
                            // }
                        }).then((res) => {
                            that.$alert(res.data.msg, "导入结果", {
                                dangerouslyUseHTMLString: true
                            });
                            that.dialogVisible = false;
                            that.loading = false;
                            that.$emit('refresh');
                        }).catch(error => {
                            that.msgError(error);
                            that.loading = false;
                        })
                    } else {
                        this.msgError('请确认是否上传了正确的文件在提交！');
                    }
                });
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                //console.log(file)
                this.isUploading = true;
            },
            fileOnChange(file) {
                this.isUploading = false;
                // 以检查文件是否为.zip;
                const fileName = file.name;
                const fileType = fileName.substring(fileName.lastIndexOf('.'));
                if (fileType === '.zip') {
                    this.files = file.raw;
                } else {
                    this.files = '';
                    this.msgError('仅允许导入zip格式文件！');
                }
                //this.uploadSectionFile()
            },
            removeFile(file) {
                this.files = ''
            },
            handleUplod() {

            },
            beforeAvatarUpload(file) {
                //const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 500;
                if (!isLt2M) {
                    this.$message.error('上传文件大小不能超过500MB!');
                }
                return isLt2M;
            }
        }
    }

</script>

<style scoped lang="scss">
    .el-dialog__body {
        height: 20px;
    }

    .el-upload__tip {
        line-height: 10px;
    }

</style>
<style lang="scss">
    .custom-evidence {
        .el-form-item__label {
            text-align: left;
        }
    }

    .evidence-import {

        /*padding-left: 20px;*/
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
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
        }
    }

</style>

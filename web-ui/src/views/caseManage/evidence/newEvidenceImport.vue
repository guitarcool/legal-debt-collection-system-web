<template>
    <Dialog :title="title" :height="400" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <div class="custom-evidence" v-loading="loading">
                <div class="evidence-import">
                    <!--<p>若对已有案件进行数据更新，请填写内部订单号及需更新的字段项，无需更改的字段项请勿填写，否则数据将被覆盖！</p>-->
                    <el-upload class="upload-demo covered-with" action="string" :limit="1" :http-request="handleUplod"
                        :accept="accept" :disabled="isUploading" :on-change="fileOnChange" :on-remove="removeFile"
                        :before-upload="beforeAvatarUpload" drag :file-list="fileList">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">

                        </div>
                        <div class="el-upload__tip" style="color:red" slot="tip" v-if="title == '证据包导入'">
                            提示：仅允许导入zip格式文件！</div>
                        <div class="el-upload__tip" style="color:red" slot="tip" v-if="title == '新增文件'">
                            提示：仅允许导入.png .jpg .pdf .excel格式文件！</div>
                    </el-upload>
                </div>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" v-debounce="submit">确 定</el-button>
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

    export default {
        //已判决
        name: "newEvidence",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    id: '',
                },
                upload_url: process.env.VUE_APP_BASE_API + '/evidence/package/importData', //上传URL
                files: '',
                // 是否禁用上传
                isUploading: false,
                fileList: [],
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
            accept: {
                type: String,
                default: ''
            },
            id: {
                type: Number || String,
                default: 0
            },
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
        created() {},
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
            submit() {
                if (this.files) {
                    this.loading = true;
                    let formData = new FormData();
                    formData.append("file", this.files);
                    formData.append("id", this.id);
                    const instance = axios.create({
                        withCredentials: true
                    });
                    instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
                    if (this.title == "证据包导入") {
                        var that = this
                        instance({
                            method: 'post',
                            url: process.env.VUE_APP_BASE_API + '/evidence/package/batchImportData',
                            data: formData,
                            timeout: 600000,
                            processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                            contentType: false, // 告诉axios不要去设置Content-Type请求头
                        }).then(function (response) {
                            console.log(response)
                            that.$alert(response.data.msg, "导入结果", {
                                dangerouslyUseHTMLString: true
                            });
                            that.dialogVisible = false;
                            that.loading = false;
                            that.$emit('refresh');
                        }).catch(error => {
                            that.msgError(error);
                            that.loading = false;
                        })
                    } else if (this.title == "新增文件") {
                        var that = this
                        instance({
                            method: 'post',
                            url: process.env.VUE_APP_BASE_API +
                                '/evidence/package/addEvidenceMaterial',
                            data: formData,
                            processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                            contentType: false, // 告诉axios不要去设置Content-Type请求头
                        }).then(function (response) {
                            console.log(response)
                            that.$alert(response.data.msg, "导入结果", {
                                dangerouslyUseHTMLString: true
                            });
                            that.dialogVisible = false;
                            that.loading = false;
                            that.$emit('refresh');
                        }).catch(error => {
                            that.msgError(error);
                            that.loading = false;
                        })
                    }
                } else {
                    this.msgError('请确认是否上传了正确的文件在提交！');
                }

            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                //console.log(file)
                this.isUploading = true;
            },
            fileOnChange(file) {
                this.isUploading = false;
                if(this.title == '新增文件'){
                    // 以检查文件是否为.png .jpg .pdf .excel;
                    const fileName = file.name;
                    const fileType = fileName.substring(fileName.lastIndexOf('.'));
                    if (fileType === '.png'||fileType === '.jpg'||fileType === '.pdf'||fileType === '.excel') {
                        this.files = file.raw;
                    } else {
                        this.files = '';
                        this.msgError('仅允许导入.png .jpg .pdf .excel格式文件！');
                    } 
                }else if(this.title == '证据包导入'){
                    // 以检查文件是否为.zip;
                    const fileName = file.name;
                    const fileType = fileName.substring(fileName.lastIndexOf('.'));
                    if (fileType === '.zip') {
                        this.files = file.raw;
                    } else {
                        this.files = '';
                        this.msgError('仅允许导入zip格式文件！');
                    }                    
                }

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

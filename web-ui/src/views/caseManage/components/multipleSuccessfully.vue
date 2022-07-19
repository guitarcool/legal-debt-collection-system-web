<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-form-item label="用户接入：">
                    <el-radio-group v-model="form.userAccess">
                        <el-radio label="是">是</el-radio>
                        <el-radio label="否">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="协议名称：">
                    <el-input v-model="form.agreementName"></el-input>
                </el-form-item>
                <el-form-item label="附件：">
                    <el-upload
                            class="upload-demo"
                            action="string"
                            :http-request="handleUplod"
                            :limit="1"
                            :disabled="isUploading"
                            :on-change="fileOnChange"
                            :on-remove="removeFile">
                        <el-button size="mini" type="primary">上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" v-debounce @click="submit" :loading="buttonLoading">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import { getToken } from "@/utils/auth";
    import { initObj } from '@/utils/common'
    import axios from 'axios'
    export default {
        //多元调解成功
        name: "multipleSuccessfully",
        components: { Dialog },
        data(){
            return{
                form:{
                    agreementName:'',
                    userAccess:'',
                    id:''
                },
                upload_url: '',//上传URL
                files: '',
                // 是否禁用上传
                isUploading: false,
                rules: {
                },
                buttonLoading:false
            }
        },
        props: {
            // 传参控制弹窗显示隐藏
            show: {
                type: Boolean,
                default: false
            },
            confirmTip: {
                type: String,
                default: ''
            },
            requestApi: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            id:{
                type: String,
            }
        },
        computed: {
            dialogVisible: {
                get () {
                    return this.show
                },
                set (val) {
                    this.$emit('update:show', val)
                }
            }
        },
        created(){

        },
        methods: {
            openDialog(){
                initObj(this.form);
                this.resetAddForm();
                this.removeFile();
                this.form.id = this.id;
                this.buttonLoading = false;
                this.upload_url = process.env.VUE_APP_BASE_API + this.requestApi
            },
            //重置表单清除验证
            resetAddForm(){
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            submit () {
                // this.$refs["form"].validate((valid) => {
                //     if (valid) {
                //
                //     }
                // });
                let formData = new FormData();
                formData.append("caseId", this.id);
                if(this.files != null){
                    formData.append("file", this.files);
                }
                formData.append("agreementName", this.form.agreementName);
                formData.append("userAccess", this.form.userAccess);
                //console.log(formData.get('file'));
                const instance = axios.create({
                    withCredentials: true
                });
                instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
                var that = this
                that.buttonLoading = true;
                instance({
                    method: 'post',
                    url: process.env.VUE_APP_BASE_API + that.requestApi,
                    data: formData,
                    timeout:600000,
                    processData: false,// 告诉axios不要去处理发送的数据(重要参数)
                    contentType: false,   // 告诉axios不要去设置Content-Type请求头
                    // config: {
                    //     headers: {'Content-Type': 'multipart/form-data'}
                    // }
                }).then(function (response) {
                    //console.log(response)
                    if (response.data.code == 200) {
                        that.msgSuccess(response.data.msg);
                        that.dialogVisible = false;
                        that.buttonLoading = false;
                        that.$emit('refresh');
                    }else{
                        that.buttonLoading = false;
                        that.msgError(response.data.msg);
                    }
                }).catch(error => {
                    that.buttonLoading = false;
                    that.msgError(error);
                })
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                //console.log(file)
                this.isUploading = true;
            },
            fileOnChange(file) {
                this.isUploading = false;
                this.files = file.raw;
                //this.uploadSectionFile()
            },
            removeFile(file){
                this.files = null
            },
            handleUplod(){

            }
        }
    }
</script>

<style scoped>
    .el-dialog__body{
        height: 20px;
    }
</style>

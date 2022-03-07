<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="记录内容：" >
                    <el-input 
                    type='textarea'
                    :rows="4"
                    placeholder="请输入内容"  
                    v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="附件：">
                    <el-upload
                            class="upload-demo"
                            action="string"
                            :limit="1"
                            :http-request="handleUplod"
                            :disabled="isUploading"
                            :on-change="fileOnChange"
                            :on-remove="removeFile"
                            :file-list="fileList">
                        <el-button size="mini" type="primary">上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import { getToken } from "@/utils/auth";
    import { initObj } from '@/utils/common'
    import axios from 'axios'
    import { fileUpload } from "../../../utils/requestFile";

    export default {
        //已立案
        name: "statusAlteration",
        components: { Dialog },
        data(){
            return{
                form:{
                    id:null,
                    content:''
                },
                upload_url: '',//上传URL
                files: '',
                // 是否禁用上传
                isUploading: false,
                fileList:[],
            }
        },
        props: {
            // 传参控制弹窗显示隐藏
            show: {
                type: Boolean,
                default: false
            },
            requestApi: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            content: {
                type: String,
                default: ''
            },           
            id:{ 
                type: Number,
                default: 3
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
                this.fileList = [];
                this.form.id = this.id;
                this.form.content = this.content;
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
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.append("id", this.form.id);
                        if(this.files != null ){
                            formData.append("file", this.files);
                        }
                        if(this.form.content){
                            formData.append("content", this.form.content);
                        }
                        fileUpload(this.requestApi,formData).then(res => {
                            //console.log(res)
                            if (res.data.code == 200) {
                                this.msgSuccess(res.data.msg);
                                this.dialogVisible = false;
                                this.$emit('refresh');
                            }else{
                                this.msgError(res.data.msg);
                            }
                        }).catch(error => {
                            this.msgError(error);
                        })
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

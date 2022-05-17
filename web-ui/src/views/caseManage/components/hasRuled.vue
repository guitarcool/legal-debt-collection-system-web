<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="庭审时间：" prop="trialDate">
                    <el-input v-model="form.trialDate"></el-input>
                </el-form-item>
                <el-form-item label="判决审判员：" prop="judgmentJudge">
                    <el-input v-model="form.judgmentJudge"></el-input>
                </el-form-item>
                <el-form-item label="判决书记员：" prop="judgmentClerk">
                    <el-input v-model="form.judgmentClerk"></el-input>
                </el-form-item>
                <el-form-item label="判决审判日期：" prop="judgmentDate">
                    <el-date-picker
                            v-model="form.judgmentDate"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="附件：">
                    <el-upload
                            class="upload-demo"
                            :limit="1"
                            action="string"
                            :http-request="handleUplod"
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
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import Dialog from '@/components/Dialog/index'
    import { getToken } from "@/utils/auth";
    import { initObj } from '@/utils/common'
    import axios from 'axios'
    export default {
        //已判决
        name: "hasRuled",
        components: { Dialog },
        data(){
            return{
                form:{
                    trialDate:'',
                    id:'',
                    judgmentJudge:'',
                    judgmentClerk:'',
                    judgmentDate:''
                },
                upload_url: '',//上传URL
                files: '',
                // 是否禁用上传
                isUploading: false,
                rules: {
                    trialDate: [
                        { required: true, message: '请填写庭审时间', trigger: 'blur' }
                    ]
                }
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
            },
           statusId:{
                type: String|Number,
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
                initObj(this.form)
                this.resetAddForm();
                this.removeFile();
                this.form.id = this.id;
                this.upload_url = process.env.VUE_APP_BASE_API + this.requestApi;
                if(this.statusId !=0 && this.statusId ){
                    this.getInfo()
                }
            },
            getInfo() {
                cuttingAfterApi.getCaseInfo(this.id).then((response) => {
                    this.form.judgmentDate = response.data.judgmentDate;
                    this.form.trialDate = response.data.judgmentName;
                    this.form.judgmentJudge = response.data.judgmentJudge;            
                    this.form.judgmentClerk = response.data.judgmentClerk;                      
                });
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
                        formData.append("id", this.id);
                        if(this.files != null ){
                            formData.append("file", this.files);
                        }
                        if(this.statusId !=0 && this.statusId ){
                            formData.append("statusId", this.statusId);
                        }
                        formData.append("trialDate", this.form.trialDate);
                        formData.append("judgmentJudge", this.form.judgmentJudge);
                        formData.append("judgmentClerk", this.form.judgmentClerk);
                        formData.append("judgmentDate", this.form.judgmentDate);

                        const instance = axios.create({
                            withCredentials: true
                        });
                        instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
                        var that = this
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
                                that.$emit('refresh');
                            }else{
                                that.msgError(response.data.msg);
                            }
                        }).catch(error => {
                            that.msgError(error);
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

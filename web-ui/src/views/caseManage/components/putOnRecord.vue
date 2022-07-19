<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="登记案号：" prop="caseNo">
                    <el-input v-model="form.caseNo"></el-input>
                </el-form-item>
                <el-form-item label="立案时间：" prop="dateTime">
                    <el-date-picker
                            v-model="form.dateTime"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd hh:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开庭时间：" prop="hearingDate">
                    <!-- <el-date-picker
                            v-model="form.hearingDate"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-M-d HH:mm"
                            value-format="yyyy年M月d日H时m分"
                    >
                    </el-date-picker> -->
                    <el-input v-model="form.hearingDate"></el-input>
                </el-form-item>
                <el-form-item label="审判员：" prop="judge">
                    <el-input v-model="form.judge"></el-input>
                </el-form-item>   
                <el-form-item label="书记员：" prop="clerk">
                    <el-input v-model="form.clerk"></el-input>
                </el-form-item>                             
                <el-form-item label="案件标的：" prop="subject">
                    <el-input v-model="form.subject"></el-input>
                </el-form-item>
                <el-form-item label="立案法院：" prop="court">
                    <el-input v-model="form.court"></el-input>
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
            <el-button type="primary" v-debounce @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import Dialog from '@/components/Dialog/index'
    import { getToken } from "@/utils/auth";
    import { initObj } from '@/utils/common'
    import axios from 'axios'
    import { fileUpload } from "../../../utils/requestFile";

    export default {
        //已立案
        name: "putOnRecord",
        components: { Dialog },
        data(){
            return{
                form:{
                    caseNo:'',
                    court:'',
                    judge:'',
                    clerk:'',
                    dateTime:'',
                    subject:'',
                    id:'',
                    hearingDate:''
                },
                upload_url: '',//上传URL
                files: '',
                // 是否禁用上传
                isUploading: false,
                rules: {
                    court: [
                        { required: true, message: '请填写立案法院', trigger: 'blur' }
                    ]
                },
                fileList:[],
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
                initObj(this.form);
                this.resetAddForm();
                this.removeFile();
                this.fileList = [];
                this.form.id = this.id;
                this.upload_url = process.env.VUE_APP_BASE_API + this.requestApi;
                if(this.statusId !=0 && this.statusId ){
                    this.getInfo()
                }
            },
            getInfo() {
                cuttingAfterApi.getCaseInfo(this.id).then((response) => {
                    this.form.caseNo = response.data.caseNo;
                    this.form.court = response.data.court;
                    this.form.judge = response.data.judge;
                    this.form.clerk = response.data.clerk;
                    this.form.dateTime = response.data.dateTime;
                    this.form.subject = response.data.subject;
                    this.form.hearingDate = response.data.hearingDate;                
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
                        if(this.statusId !=0 && this.statusId ){
                            formData.append("statusId", this.statusId);
                        }
                        if(this.files != null ){
                            formData.append("file", this.files);
                        }
                        formData.append("caseNo", this.form.caseNo);
                        formData.append("judge", this.form.judge);
                        formData.append("clerk", this.form.clerk);
                        if(this.form.dateTime){
                            formData.append("dateTime", this.form.dateTime);
                        }
                        formData.append("subject", this.form.subject);
                        formData.append("court", this.form.court);
                        if(this.form.hearingDate){
                            formData.append("hearingDate", this.form.hearingDate);
                        }
                        //console.log(formData.get('file'));
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
                        // const instance = axios.create({
                        //     withCredentials: true
                        // });
                        // instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
                        // var that = this
                        // instance({
                        //     method: 'post',
                        //     url: process.env.VUE_APP_BASE_API + that.requestApi,
                        //     data: formData,
                        //     processData: false,// 告诉axios不要去处理发送的数据(重要参数)
                        //     contentType: false,   // 告诉axios不要去设置Content-Type请求头
                        //     // config: {
                        //     //     headers: {'Content-Type': 'multipart/form-data'}
                        //     // }
                        // }).then(function (response) {
                        //     //console.log(response)
                        //     if (response.data.code == 200) {
                        //         that.msgSuccess(response.data.msg);
                        //         that.dialogVisible = false;
                        //         that.$emit('refresh');
                        //     }else{
                        //         that.msgError(response.data.msg);
                        //     }
                        // }).catch(error => {
                        //     that.msgError(error);
                        // })


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

<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="执行法院：" prop="court">
                    <el-input v-model="form.court"></el-input>
                </el-form-item>

                <el-form-item label="执行时间：" prop="time">
                    <el-date-picker
                            v-model="form.time"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>            
                <el-form-item label="执行案号：" prop="caseNo">
                    <el-input v-model="form.caseNo"></el-input>
                </el-form-item>
                <el-form-item label="执行标的(元)：" prop="executeSubject">
                    <el-input type='number' v-model="form.executeSubject" @blur="getNum(form.executeSubject)"></el-input>
                </el-form-item>                   
                <el-form-item label="执行审判员：" prop="executeJudge">
                    <el-input v-model="form.executeJudge"></el-input>
                </el-form-item>
                <el-form-item label="执行书记员：" prop="executeClerk">
                    <el-input v-model="form.executeClerk"></el-input>
                </el-form-item>
                <el-form-item label="执行审判日期：" prop="executeDate">
                    <el-date-picker
                            v-model="form.executeDate"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
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
    import cuttingBeforeApi from "@/api/case/cuttingBefore/index";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import { initObj } from '@/utils/common'
    export default {
        //已执行立案
        name: "executedFiling",
        components: { Dialog },
        data(){
            return{
                form:{
                    court:'',
                    time:'',
                    caseNo:'',
                    executeSubject:'',
                    executeJudge:'',
                    executeClerk:'',
                    executeDate:''
                },
                rules: {
                    court: [
                        { required: true, message: '请输入执行法院', trigger: 'blur' }
                    ],
                    time: [
                        { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    caseNo:[
                        { required: true, message: '请输入执行案号', trigger: 'blur' }
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
            //保留两位小数
            getNum(val){
                if(val.indexOf('.') != -1){
                    let num = parseFloat(val).toFixed(2); 
                    this.form.executeSubject = num;
                }
                
            },          
            openDialog(){
                initObj(this.form)
                this.resetAddForm();
                this.form.id = this.id
                if(this.statusId !=0 && this.statusId ){
                    this.getInfo()
                }
            },
            getInfo() {
                cuttingAfterApi.info(this.id).then((response) => {
                    this.form.court = response.data.enforceCourt;
                    this.form.caseNo = response.data.executeCaseNo;
                    this.form.time = response.data.executeTime;            
                    this.form.executeSubject = response.data.executeSubject;            
                    this.form.executeJudge = response.data.executeJudge;            
                    this.form.executeClerk = response.data.executeClerk;            
                    this.form.executeDate = response.data.executeDate;            
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
                        if(this.statusId !=0 && this.statusId ){
                            this.form.statusId = this.statusId;
                        }
                        cuttingBeforeApi.common(this.requestApi,this.form).then(res => {
                            if (res.code === 200) {
                                this.msgSuccess("操作成功");
                                this.dialogVisible = false;
                                this.$emit('refresh');
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .el-dialog__body{
        height: 20px;
    }
</style>

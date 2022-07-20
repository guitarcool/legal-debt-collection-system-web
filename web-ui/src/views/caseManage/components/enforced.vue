<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-form-item label="执行款流水：" prop="serial">
                    <el-input v-model="form.serial"></el-input>
                </el-form-item>
                <el-form-item label="登记执行时间：" prop="time">
                    <el-date-picker
                            v-model="form.time"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="执行流水号：" prop="serialNo">
                    <el-input v-model="form.serialNo"></el-input>
                </el-form-item>
                <el-form-item label="执行金额：" prop="amount">
                    <el-input v-model="form.amount"></el-input>
                </el-form-item>
                <el-form-item label="到账账户：" prop="account">
                    <el-input v-model="form.account"></el-input>
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
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import Dialog from '@/components/Dialog/index'
    import { getToken } from "@/utils/auth";
    import pretrialMediationApi from "@/api/case/pretrialMediation/index";
    import { initObj } from '@/utils/common'
    export default {
        //已强制执行
        name: "enforced",
        components: { Dialog },
        data(){
            return{
                form:{
                    id:'',
                    serial:'',
                    time:'',
                    serialNo:'',
                    amount:'',
                    account:''
                },
                rules: {
                    serial: [
                        { required: true, message: '请输入执行款流水', trigger: 'blur' }
                    ],
                    time: [
                        { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    serialNo:[
                        { required: true, message: '请输入执行流水号', trigger: 'blur' }
                    ],
                    amount:[
                        { required: true, message: '请输入执行金额', trigger: 'blur' }
                    ],
                    account:[
                        { required: true, message: '请输入到账账户', trigger: 'blur' }
                    ]
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
                this.form.id = this.id;
                this.buttonLoading = false;
                if(this.statusId !=0 && this.statusId ){
                    this.getInfo()
                }
            },
            getInfo() {
                cuttingAfterApi.getCaseInfo(this.id).then((response) => {
                    this.form.serial = response.data.enforceSerial;
                    this.form.serialNo = response.data.enforceSerialNo;
                    this.form.time = response.data.enforceTime;            
                    this.form.amount = response.data.enforceAmount;            
                    this.form.account = response.data.enforceAccount;            
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
                        this.buttonLoading = true;
                        if(this.statusId !=0 && this.statusId ){
                            this.form.statusId = this.statusId;
                        }             
                        pretrialMediationApi.common(this.requestApi,this.form).then(res => {
                            if (res.code === 200) {
                                this.msgSuccess("操作成功");
                                this.dialogVisible = false;
                                this.buttonLoading = false;
                                this.$emit('refresh');
                            }
                        }).catch(() => {
                            this.buttonLoading = false;
                        });
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

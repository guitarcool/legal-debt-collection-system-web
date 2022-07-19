<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item :label="confirmTip+'原因：'" prop="content">
                    <el-input v-model="form.content" :rows="8" type="textarea" :placeholder="'请输入'+confirmTip"></el-input>
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
    import Dialog from '@/components/Dialog/index'
    import cuttingBeforeApi from "@/api/case/cuttingBefore/index";
    import { initObj } from '@/utils/common'
    export default {
        name: "normalDialog",
        components: { Dialog },
        data(){
            return{
                form:{
                    content:'',
                    caseId:''
                },
                rules:{
                    content: [
                        { required: true, message: '请输入原因', trigger: 'blur' }
                    ],
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
                default:''
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
                this.form.caseId = this.id
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

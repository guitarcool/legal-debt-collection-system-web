<template>
    <Dialog :title="title" :height="350" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="新增手机号：" prop="relatedContact">
                    <el-input v-model="form.relatedContact"></el-input>
                </el-form-item>
                <el-form-item label="关系：" prop="relatedRelation">
                    <el-select style="width: 100%" @change="handleChange" v-model="form.relatedRelation" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人姓名：" prop="relatedName">
                    <el-input :disabled="form.relatedRelation=='本人'" v-model="form.relatedName"></el-input>
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
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import { initObj } from '@/utils/common'
    export default {
        //已强制执行
        name: "addPhone",
        components: { Dialog },
        data(){
            return{
                form:{
                    relatedContact:'',
                    relatedRelation:'',
                    relatedName:'',
                    caseId:''
                },
                rules: {
                    relatedContact: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        {
                            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                            message: "请输入正确的手机号码",
                            trigger: "blur",
                        },
                    ],
                    relatedRelation:[
                        { required: true, message: '请选择关系', trigger: 'change' }
                    ],
                    relatedName:[
                        { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                    ]
                },
                options:[
                    {
                        label:'本人',
                        value:'本人'
                    },
                    {
                        label:'父母',
                        value:'父母'
                    },
                    {
                        label:'夫妻',
                        value:'夫妻'
                    },
                    {
                        label:'子女',
                        value:'子女'
                    },
                    {
                        label:'兄弟',
                        value:'兄弟'
                    },
                    {
                        label:'姐妹',
                        value:'姐妹'
                    },
                    {
                        label:'亲戚',
                        value:'亲戚'
                    },
                    {
                        label:'朋友',
                        value:'朋友'
                    },
                    {
                        label:'同事',
                        value:'同事'
                    },
                    {
                        label:'同学',
                        value:'同学'
                    },
                    {
                        label:'其它',
                        value:'其它'
                    }
                ]
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
            id:{
                type: String,
                default:''
            },
            name:{
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
            //重置表单清除验证
            resetAddForm(){
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            openDialog(){
                initObj(this.form)
                this.resetAddForm();
                this.form.caseId = this.id
            },
            submit () {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        cuttingAfterApi.addPhone(this.form).then(res => {
                            if (res.code === 200) {
                                this.msgSuccess("新增成功");
                                this.dialogVisible = false;
                                this.$emit('refresh');
                            }
                        })
                    }
                });
            },
            handleChange(value){
                if(value == '本人'){
                    this.form.relatedName = this.name
                }else{
                    this.form.relatedName = ''
                }
            }
        }
    }
</script>

<style scoped>
    .el-dialog__body{
        height: 20px;
    }
</style>

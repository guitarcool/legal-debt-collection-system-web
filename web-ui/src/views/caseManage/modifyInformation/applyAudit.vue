<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <div v-if="title == '全选审核信修申请'" style="padding:10px 0;color:red;font-size:16px;line-height:24px" >注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-form-item label="审批结果：" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="0">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审批意见：" :required="form.type==0">
                    <el-input v-model="form.reason" :rows="8" type="textarea" placeholder="请输入理由"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{loading?'审核中':'确定'}}</el-button>

        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import {
        getToken
    } from "@/utils/auth";
    import {
        initObj
    } from '@/utils/common'
    import modifyApi from "@/api/case/modify/index";
    export default {
        //多元调解成功
        name: "applyAudit",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    type: '',
                    id: '',
                    reason: ''
                },
                rules: {
                    type: [{
                        required: true,
                        message: '请选择审核结果',
                        trigger: 'change'
                    }],
                },
                loading: false
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
            id: {
                type: String,
            },
            total:{
                type: String | Number,
                default: '--'           
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

        },
        methods: {
            openDialog() {
                initObj(this.form);
                this.form.type = 1
                this.resetAddForm();
                this.form.id = this.id;
                this.loading = false;
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        if (this.form.type == 0 && this.form.reason == '') {
                            this.msgError("请填写拒绝理由");
                            return
                        }
                        let param = {
                            ids: this.id,
                            type: this.form.type,
                            reason: this.form.reason
                        }
                        if (this.title == '全选审核信修申请') {
                            modifyApi.applyModifyAll(param).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.$emit('refresh')
                                    this.loading = false;
                                    this.dialogVisible = false;
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        } else {
                            modifyApi.applyModify(param).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.$emit('refresh')
                                    this.loading = false;
                                    this.dialogVisible = false;
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        }
                    }
                });
            }
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>

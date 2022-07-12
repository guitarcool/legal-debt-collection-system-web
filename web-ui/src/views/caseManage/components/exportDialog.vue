<template>
    <Dialog :title="title" :height="300" :show.sync="dialogVisible" width="30%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules">
                <div v-if="title == '全选案件导出'||title == '全选导出'" style="padding:10px 0;color:red;font-size:16px;line-height:24px" >注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
                <el-form-item label="是否脱敏：" prop="desensitization">
                    <el-radio-group v-model="form.desensitization">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{loading?'下载中':'确定'}}</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import importApi from "@/api/case/import/index";
    import {
        initObj
    } from '@/utils/common'
    export default {
        name: "exportDialog",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    desensitization: '1',
                    ids: '',
                    url: ''
                },
                loading: false,
                rules: {
                    desensitization: [{
                        required: true,
                        message: '请选择是否脱敏',
                        trigger: 'change'
                    }]
                }
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
            ids: {
                type: String,
                default: ''
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
                initObj(this.form)
                this.resetAddForm();
                this.form.ids = this.ids;
                this.loading = false;
                this.form.url = this.requestApi;
                this.form.desensitization = 1;
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            submit() {
                if(this.total > 50000){
                        this.msgError('筛选出的数据量超出系统导出条数50000上限，请重新筛选后再进行全选导出');
                        return;
                }
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        importApi.common(this.form).then(res => {
                            if (res.code === 200) {
                                this.loading = false;
                                this.msgSuccess("导出成功");
                                this.dialogVisible = false;
                                this.download(res.msg);
                                this.$emit("refresh");
                            }
                        }).catch(() => {
                            this.loading = false;
                        });
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

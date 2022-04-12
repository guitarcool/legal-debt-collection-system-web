<template>
    <Dialog :title="title" :height="300" :show.sync="dialogVisible" width="30%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules">
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

<template>
    <Dialog :title="title" :height="350" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form style="margin: 0 auto;" ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item v-if="title=='批量导出调解记录'||title=='全选批量导出调解记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次调解记录</el-checkbox>
                        <el-checkbox :label="2">全部调解记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="title=='批量导出调解记录'||title=='全选批量导出调解记录'" label="是否脱敏：" prop="isDesensitization">
                    <el-radio-group v-model="form.isDesensitization">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="title=='批量导出网调记录'||title=='全选批量导出网调记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次网调记录</el-checkbox>
                        <el-checkbox :label="2">全部网调记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="title=='批量转电话调解失败'||title=='全选批量转电话调解失败'" label="失败原因：" prop="content">
                    <el-input v-model="form.content" :rows="6" type="textarea" placeholder="请输入电话调解失败原因"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{loading?'导出中':'确定'}}</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import cuttingBeforeApi from "@/api/case/cuttingBefore/index";
    import {
        initObj
    } from '@/utils/common'
    export default {
        //已强制执行
        name: "addPhone",
        components: {
            Dialog
        },
        data() {
            return {
                rules: {
                    exportRange: [{
                        required: true,
                        message: '请选择导出范围',
                        trigger: 'change'
                    }],
                    isDesensitization: [{
                        required: true,
                        message: '请选择是否脱敏',
                        trigger: 'change'
                    }],
                    content: [{
                        required: true,
                        message: '请输入原因',
                        trigger: 'blur'
                    }],
                },
                form: {
                    exportRange: [],
                    isDesensitization: '1',
                },
                loading:false,
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
            params: {
                type: String,
                default: ''
            },
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
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            openDialog() {
                initObj(this.form)
                this.resetAddForm();
                this.form.exportRange = [];
                this.form.isDesensitization = 1;
                this.loading = false;
            },
            submit() {
                if (this.title == '批量导出调解记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.loading = true;
                            let queryParams = {
                                caseIds: this.params,
                                exportRange: this.form.exportRange.toString(),
                                isDesensitization: this.form.isDesensitization,
                            };
                            cuttingBeforeApi.batchExportMediationRecord(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.loading = false;
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                    this.download(res.msg);
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        }
                    });
                } else if (this.title == '批量导出网调记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.loading = true;
                            let queryParams = {
                                caseIds: this.params,
                                exportRange: this.form.exportRange.toString(),
                            };
                            cuttingBeforeApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.loading = false;
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                    this.download(res.msg);
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        }
                    });
                } else if (this.title == '批量转电话调解失败') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.loading = true;
                            let queryParams = {
                                caseId: this.params,
                                content: this.form.content,
                            };
                            cuttingBeforeApi.batchMediationFailed(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.loading = false;
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        }
                    });
                } else if (this.title == '全选批量导出网调记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.loading = true;
                            let queryParams = {
                                caseIds: this.params,
                                exportRange: this.form.exportRange.toString(),
                            };
                            cuttingBeforeApi.batchExportNetworkAdjustRecordAll(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.loading = false;
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                    this.download(res.msg);
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        }
                    });
                } else if (this.title == '全选批量导出调解记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.loading = true;
                            let queryParams = {
                                caseIds: this.params,
                                exportRange: this.form.exportRange.toString(),
                                isDesensitization: this.form.isDesensitization,
                            };
                            cuttingBeforeApi.batchExportMediationRecordAll(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.loading = false;
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                    this.download(res.msg);
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        }
                    });
                } else if (this.title == '全选批量转电话调解失败') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.loading = true;
                            let queryParams = {
                                caseId: this.params,
                                content: this.form.content,
                            };
                            cuttingBeforeApi.batchMediationFailedAll(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.loading = false;
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                }
                            }).catch(() => {
                                this.loading = false;
                            });
                        }
                    });
                }
            },
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>

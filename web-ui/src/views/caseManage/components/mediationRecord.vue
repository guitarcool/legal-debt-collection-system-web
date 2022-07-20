<template>
    <Dialog :title="title" :height="350" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <div v-if="title=='全选导出网调记录'||title=='全选导出调解记录'"
                    style="padding:10px 0;color:red;font-size:16px;line-height:24px">注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!
                </div>
                <el-form-item v-if="title=='导出调解记录'||title=='全选导出调解记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次调解记录</el-checkbox>
                        <el-checkbox :label="2">全部调解记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="title=='导出网调记录'||title=='全选导出网调记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次网调记录</el-checkbox>
                        <el-checkbox :label="2">全部网调记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="title=='导出调解记录'||title=='全选导出调解记录'" label="是否脱敏：" prop="isDesensitization">
                    <el-radio-group v-model="form.isDesensitization">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" v-debounce @click="phoneSubmit" :loading="buttonLoading">
                {{buttonLoading?'导出中':'确定'}}</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import withDrawalApi from "@/api/case/withDrawal/index";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import cuttingBeforeApi from "@/api/case/cuttingBefore/index";
    import {
        initObj
    } from '@/utils/common'
    export default {
        name: "mediationRecord",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    exportRange: [],
                    isDesensitization: '1',
                },
                buttonLoading: false,
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
            ids: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            total: {
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
                this.buttonLoading = false;
                this.form.exportRange = [];
                this.form.isDesensitization = 1;
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            //（裁前，裁后，退案，分案）批量，全选调解网调弹窗确认按钮
            phoneSubmit() {
                switch (true) {
                        //分案调解，网调
                    case this.type == 1:
                        if (this.title == '导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    cuttingAfterApi.postAdjudgedBatchExport(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.download(res.msg);
                                            this.$emit('refresh');
                                        }
                                    }).catch(error => {
                                        this.buttonLoading = false;
                                    })
                                }
                            });
                        } else if (this.title == '导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    cuttingAfterApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.download(res.msg);
                                            this.$emit('refresh');
                                        }
                                    }).catch(error => {
                                        this.buttonLoading = false;
                                    })
                                }
                            });
                        } else if (this.title == '全选导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    cuttingAfterApi.assignmentMediationRecordAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.download(res.msg);
                                            this.$emit('refresh');
                                        }
                                    }).catch(error => {
                                        this.buttonLoading = false;
                                    })
                                }
                            });
                        } else if (this.title == '全选导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    cuttingAfterApi.assignmentNetworkAdjustRecordAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.download(res.msg);
                                            this.$emit('refresh');
                                        }
                                    }).catch(error => {
                                        this.buttonLoading = false;
                                    })
                                }
                            });
                        }
                        break;
                        //裁后调解，网调
                    case this.type == 2:
                        if (this.title == '导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    cuttingAfterApi.postAdjudgedBatchExport(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.dialogVisible = false;
                                            this.buttonLoading = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    cuttingAfterApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.dialogVisible = false;
                                            this.buttonLoading = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '全选导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    cuttingAfterApi.batchExportMediationRecordAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '全选导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    cuttingAfterApi.batchExportNetworkAdjustRecordAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        }
                        break;
                        //退案调解，网调
                    case this.type == 3:
                        if (this.title == '导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    withDrawalApi.batchExportMediationRecord(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    withDrawalApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '全选导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    withDrawalApi.batchExportMediationRecordAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '全选导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    withDrawalApi.batchExportNetworkAdjustRecordAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        }
                        break;
                        //裁前调解，网调
                    case this.type == 4:
                        if (this.title == '导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    cuttingBeforeApi.batchExportMediationRecord(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    cuttingBeforeApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '批量转电话调解失败') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseId: this.ids,
                                        content: this.form.content,
                                    };
                                    cuttingBeforeApi.batchMediationFailed(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '全选导出网调记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                    };
                                    cuttingBeforeApi.batchExportNetworkAdjustRecordAll(queryParams).then(
                                        res => {
                                            if (res.code === 200) {
                                                this.msgSuccess("操作成功");
                                                this.buttonLoading = false;
                                                this.dialogVisible = false;
                                                this.$emit('refresh');
                                                this.download(res.msg);
                                            }
                                        }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '全选导出调解记录') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: this.ids,
                                        exportRange: this.form.exportRange.toString(),
                                        isDesensitization: this.form.isDesensitization,
                                    };
                                    cuttingBeforeApi.batchExportMediationRecordAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                            this.download(res.msg);
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        } else if (this.title == '全选转电话调解失败') {
                            this.$refs["form"].validate((valid) => {
                                if (valid) {
                                    this.buttonLoading = true;
                                    let queryParams = {
                                        caseIds: [],
                                        content: this.form.content,
                                    };
                                    cuttingBeforeApi.batchMediationFailedAll(queryParams).then(res => {
                                        if (res.code === 200) {
                                            this.msgSuccess("操作成功");
                                            this.buttonLoading = false;
                                            this.dialogVisible = false;
                                            this.$emit('refresh');
                                        }
                                    }).catch(() => {
                                        this.buttonLoading = false;
                                    });
                                }
                            });
                        }
                        break;
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

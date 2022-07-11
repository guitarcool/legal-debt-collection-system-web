<template>
    <Dialog :title="title" :height="400" :show.sync="dialogVisible" width="40%" @openDialog="openDialog">
        <template v-slot:default>
            <div v-if="title == '全选文书签章审核'" style="padding:10px 0;color:red;font-size:16px;line-height:24px">
                注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
            <el-form class="formcustom-display" ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="审批结果：" prop="choice">
                    <el-radio-group v-model="project_operate">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="0">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审批意见：" v-if="project_operate == 0" prop="options">
                    <el-input v-model="form.options" :rows="8" type="textarea" placeholder="请输入审批意见"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="sumbmitLoading">提交</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import {
        initObj
    } from "@/utils/common";
    import electronicApi from "@/api/case/electronic/index";
    export default {
        //多元调解成功
        name: "applyAudit",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    id: "",
                    choice: "",
                    propertyProNo: "",
                    frozenStartTime: "",
                    frozenAmount: "",
                    respondentName: "",
                    options: "",
                    house: '',
                    vehicle: null,
                },
                // formvehicle:'0',
                formhouse: '',
                project_operate: "",
                house: [],
                rules: {
                    choice: [{
                        required: true,
                        message: "请选择审批结果",
                        trigger: "change"
                    }, ],
                    options: [{
                        required: true,
                        message: "请输入审批意见",
                        trigger: "blur"
                    }, ],
                },
                sumbmitLoading: false,
            };
        },
        props: {
            // 传参控制弹窗显示隐藏
            show: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: "",
            },
            id: {
                type: Number,
                default: -1,
            },
            type: {
                type: Number,
                default: -1,
            },
            ids: {
                type: Array,
                default: [],
            },
            total: {
                type: String | Number,
                default: '--'
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.show;
                },
                set(val) {
                    this.$emit("update:show", val);
                },
            },
        },
        watch: {
            project_operate(val) {
                this.form.choice = val;
            },
        },
        created() {},
        methods: {
            openDialog() {
                initObj(this.form);
                this.resetAddForm();
                this.form.id = this.id;
                this.project_operate = 1;
                this.sumbmitLoading = false;
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs["form"].resetFields();
                } catch (e) {}
            },
            submit() {
                this.form.choice = this.project_operate;
                if (this.form.choice == 0) {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.sumbmitLoading = true;
                            let param
                            if (this.type == 1) {
                                param = {
                                    rejectReason: this.form.options,
                                    type: this.form.choice,
                                    ids: [this.id],
                                };
                            } else if (this.type == 2) {
                                param = {
                                    rejectReason: this.form.options,
                                    type: this.form.choice,
                                    ids: this.ids,
                                };
                            }
                            if (this.title == '全选文书签章审核') {
                                param.ids = [];
                                electronicApi.applyCheckAll(param).then((res) => {
                                    if (res.code === 200) {
                                        this.sumbmitLoading = false;
                                        this.msgSuccess("操作成功");
                                        this.$emit("refresh");
                                        this.dialogVisible = false;
                                    }
                                }).catch(error => {
                                    this.sumbmitLoading = false;
                                })
                            } else {
                                electronicApi.applyCheck(param).then((res) => {
                                    if (res.code === 200) {
                                        this.sumbmitLoading = false;
                                        this.msgSuccess("操作成功");
                                        this.$emit("refresh");
                                        this.dialogVisible = false;
                                    }
                                }).catch(error => {
                                    this.sumbmitLoading = false;
                                })
                            }
                        }
                    });
                }
                if (this.form.choice == 1) {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            this.sumbmitLoading = true;
                            let param
                            if (this.type == 1) {
                                param = {
                                    type: this.form.choice,
                                    ids: [this.id],
                                };
                            } else if (this.type == 2) {
                                param = {
                                    type: this.form.choice,
                                    ids: this.ids,
                                };
                            }
                            if (this.title == '全选文书签章审核') {
                                param.ids = [];
                                electronicApi.applyCheckAll(param).then((res) => {
                                    if (res.code === 200) {
                                        this.sumbmitLoading = false;
                                        this.msgSuccess("操作成功");
                                        this.$emit("refresh");
                                        this.dialogVisible = false;
                                    }
                                }).catch(error => {
                                    this.sumbmitLoading = false;
                                })
                            } else {
                                electronicApi.applyCheck(param).then((res) => {
                                    if (res.code === 200) {
                                        this.sumbmitLoading = false;
                                        this.msgSuccess("操作成功");
                                        this.$emit("refresh");
                                        this.dialogVisible = false;
                                    }
                                }).catch(error => {
                                    this.sumbmitLoading = false;
                                })
                            }
                        }
                    });
                }
            },
        },
    };

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>
<style lang="scss">
    // .formcustom-display {
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;

    //     .el-form-item {
    //         width: 60%;
    //     }
    // }

</style>

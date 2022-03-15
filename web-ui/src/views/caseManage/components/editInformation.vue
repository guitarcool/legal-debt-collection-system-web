<template>
    <Dialog :title="title" :height="550" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form style="width:80%;margin:0 auto;text-align:left;" ref="form" :model="form" label-width="120px">
                <el-form-item label="首次还款日期：" prop="firstRepayDate">
                    <el-date-picker
                        clearable
                        v-model="form.firstRepayDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="末次还款日期：" prop="lastRepayDate">
                    <el-date-picker
                        clearable
                        v-model="form.lastRepayDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="起始已还本金：" prop="repaidCapital">
                    <el-input clearable v-model="form.repaidCapital"></el-input>
                </el-form-item>
                <el-form-item label="已还期数：" prop="repaidTerms">
                    <el-input clearable v-model="form.repaidTerms"></el-input>
                </el-form-item>
                <el-form-item label="借款用途：" prop="purpose">
                    <el-input clearable v-model="form.purpose"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="respondentSex">
                    <el-select clearable filterable style="width: 100%" v-model="form.respondentSex" placeholder="请选择">
                        <el-option v-for="item in respondentSexOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期：" prop="respondentBirthday">
                    <el-input clearable v-model="form.respondentBirthday"></el-input>
                </el-form-item>
                <el-form-item label="户籍地址：" prop="respondentAddress">
                    <el-input clearable v-model="form.respondentAddress"></el-input>
                </el-form-item>
                <el-form-item label="工作单位名称：" prop="workUnitName">
                    <el-input clearable v-model="form.workUnitName"></el-input>
                </el-form-item>
                <el-form-item label="单位电话：" prop="workUnitPhone">
                    <el-input clearable v-model="form.workUnitPhone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="respondentEmail">
                    <el-input clearable v-model="form.respondentEmail"></el-input>
                </el-form-item>
                <el-form-item label="QQ：" prop="respondentQq">
                    <el-input clearable v-model="form.respondentQq"></el-input>
                </el-form-item>
                <el-form-item label="微信：" prop="respondentChat">
                    <el-input clearable v-model="form.respondentChat"></el-input>
                </el-form-item>
                <el-form-item label="学历：" prop="respondentEducation">
                    <el-input clearable v-model="form.respondentEducation"></el-input>
                </el-form-item>
                <el-form-item label="职业：" prop="respondentOccupation">
                    <el-input clearable v-model="form.respondentOccupation"></el-input>
                </el-form-item>
                <el-form-item label="婚姻状况：" prop="maritalStatus">
                    <el-select clearable filterable style="width: 100%" v-model="form.maritalStatus" placeholder="请选择">
                        <el-option v-for="item in maritalStatusOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注2：" prop="remark2">
                    <el-input clearable v-model="form.remark2"></el-input>
                </el-form-item>
                <el-form-item label="备注3：" prop="remark3">
                    <el-input clearable v-model="form.remark3"></el-input>
                </el-form-item>
                <el-form-item label="备注4：" prop="remark4">
                    <el-input clearable v-model="form.remark4"></el-input>
                </el-form-item>
                <el-form-item label="备注5：" prop="remark5">
                    <el-input clearable v-model="form.remark5"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button v-if="type == 'after'" v-hasPermi="['case:postAdjudged:updateCaseEditData']" type="primary"
                @click="submit">确 定</el-button>
            <el-button v-if="type == 'before'" v-hasPermi="['case:pretrial:updateCaseEditData']" type="primary"
                @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
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
                form: {
                    caseId: ''
                },
                maritalStatusOptions: [{
                        label: "已婚",
                        value: "已婚"
                    },
                    {
                        label: "未婚",
                        value: "未婚"
                    },
                    {
                        label: "离异",
                        value: "离异"
                    },
                ],
                respondentSexOptions: [{
                        label: "男",
                        value: "男"
                    },
                    {
                        label: "女",
                        value: "女"
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
            id: {
                type: String,
                default: ''
            },
            type: {
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
                this.form.caseId = this.id;
                if (this.type == 'after') {
                    cuttingAfterApi.getCaseEditData(this.id).then(res => {
                        if (res.code === 200) {
                            this.form = res.data;
                        }
                    })
                } else if (this.type == 'before') {
                    cuttingBeforeApi.getCaseEditData(this.id).then(res => {
                        if (res.code === 200) {
                            this.form = res.data;
                        }
                    })
                }
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        if (this.type == 'after') {
                            cuttingAfterApi.updateCaseEditData(this.form).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("编辑成功");
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                }
                            })
                        } else if (this.type == 'before') {
                            cuttingBeforeApi.updateCaseEditData(this.form).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("编辑成功");
                                    this.dialogVisible = false;
                                    this.$emit('refresh');
                                }
                            })
                        }
                    }
                });
            },
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>

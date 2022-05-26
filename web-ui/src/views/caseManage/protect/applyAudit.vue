<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="35%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="姓名：">
                    <el-input disabled style="width: 100%" v-model="form.respondentName" placeholder="请输入姓名">
                    </el-input>
                </el-form-item>
                <el-form-item label="审批结果：" prop="choice" v-if="title == '财保申请审核'">
                    <el-radio-group v-model="project_operate">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="0">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审批意见：" v-if="project_operate == 0" prop="options">
                    <el-input v-model="form.options" :rows="8" type="textarea" placeholder="请输入审批意见"></el-input>
                </el-form-item>
                <el-form-item label="财保批次号：" v-if="project_operate == 1" prop="proBatchNo">
                    <el-input v-model="form.proBatchNo" placeholder="请输入财保批次号"></el-input>
                </el-form-item>
                <el-form-item label="财保案号：" v-if="project_operate == 1" prop="propertyProNo">
                    <el-input style="width: 100%" v-model="form.propertyProNo" placeholder="请输入财保案号"></el-input>
                </el-form-item>
                <el-form-item label="财保类型：" v-if="project_operate == 1" prop="proType">
                    <el-select clearable style="width: 100%" v-model="form.proType" filterable placeholder="请选择">
                        <el-option v-for="item in proType" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="121px" label="冻结开始时间：" v-if="project_operate == 1" prop="frozenStartTime">
                    <el-date-picker style="width: 100%" v-model="form.frozenStartTime" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="121px" label="首次冻结金额：" v-if="project_operate== 1" prop="frozenAmount">
                    <el-input style="width: 100%" v-model="form.frozenAmount" type="number" placeholder="请输入首次冻结金额">
                    </el-input>
                </el-form-item>
                <el-form-item label="车辆情况：" v-if="project_operate == 1">
                    <el-input style="width: 100%" v-model="form.vehicle" placeholder="请输入车辆情况"></el-input>
                </el-form-item>
                <el-form-item label="房屋情况：" v-if="project_operate == 1">
                    <el-select style="width: 100%" v-model="formhouse" filterable placeholder="请选择">
                        <el-option v-for="item in house" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="财保保险单号：" v-if="project_operate == 1">
                    <el-input style="width: 100%" type="textarea" :rows="2" v-model="form.proInsureNo"
                        placeholder="请输入财保保险单号"></el-input>
                </el-form-item>
                <el-form-item label="保险公司名称：" v-if="project_operate == 1">
                    <el-input style="width: 100%" type="textarea" :rows="2" v-model="form.proInsureCo"
                        placeholder="请输入财保保险公司名称"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import {
        initObj
    } from "@/utils/common";
    import protectApi from "@/api/case/protect/index";
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
                proType: [],
                rules: {
                    choice: [{
                        required: true,
                        message: "请选择审批结果",
                        trigger: "change"
                    }, ],
                    proBatchNo: [{
                        required: true,
                        message: "请输入财保批次号",
                        trigger: "blur"
                    }, ],
                    propertyProNo: [{
                        required: true,
                        message: "请输入财保案号",
                        trigger: "blur"
                    }, ],
                    frozenStartTime: [{
                        required: true,
                        message: "请选择财保案号冻结开始时间",
                        trigger: "change",
                    }, ],
                    frozenAmount: [{
                        required: true,
                        message: "请输入首次冻结金额",
                        trigger: "blur"
                    }, ],
                    options: [{
                        required: true,
                        message: "请输入审批意见",
                        trigger: "blur"
                    }, ],
                    proType: [{
                        required: true,
                        message: "请选择财保类型",
                        trigger: "change"
                    }, ],
                },
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
                default: -999,
            },
            cid: {
                type: String,
                default: '',
            },
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
        created() {
            //房类型
            this.getDicts("yes_no").then((response) => {
                this.house = response.data;
            });
            //财保类型
            this.getDicts("pro_type").then((response) => {
                this.proType = response.data;
            });
        },
        methods: {
            openDialog() {
                initObj(this.form);
                this.resetAddForm();
                this.getInfo();
                this.form.id = this.id;
                this.formhouse = '0';
                this.project_operate = 1;
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs["form"].resetFields();
                } catch (e) {}
            },
            getInfo() {
                protectApi.propertyInfo(this.id).then((res) => {
                    this.form = res.data;
                });
            },
            submit() {
                if (this.title == '财保申请审核') {
                    this.form.choice = this.project_operate;
                    if (this.form.choice == 0) {
                        this.$refs["form"].validate((valid) => {
                            if (valid) {
                                let param = {
                                    options: this.form.options,
                                    choice: this.form.choice,
                                    cid: this.cid,
                                    id: this.id,
                                };
                                protectApi.reviewProperty(param).then((res) => {
                                    if (res.code === 200) {
                                        this.msgSuccess("操作成功");
                                        this.$emit("refresh");
                                        this.dialogVisible = false;
                                    }
                                });
                            }
                        });
                    }
                    if (this.form.choice == 1) {
                        this.form.house = this.formhouse;
                        this.$refs["form"].validate((valid) => {
                            if (valid) {
                                let param = {
                                    cid: this.cid,
                                    id: this.id,
                                    choice: this.form.choice,
                                    proBatchNo: this.form.proBatchNo,
                                    proType: this.form.proType,
                                    proInsureNo: this.form.proInsureNo,
                                    proInsureCo: this.form.proInsureCo,
                                    propertyProNo: this.form.propertyProNo,
                                    frozenStartTime: this.form.frozenStartTime,
                                    frozenAmount: this.form.frozenAmount,
                                    respondentName: this.form.respondentName,
                                    house: this.form.house,
                                    vehicle: this.form.vehicle,
                                };
                                protectApi.reviewProperty(param).then((res) => {
                                    if (res.code === 200) {
                                        this.msgSuccess("操作成功");
                                        this.$emit("refresh");
                                        this.dialogVisible = false;
                                    }
                                });
                            }
                        });
                    }
                } else {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            let param = {
                                cid: this.cid,
                                id: this.id,
                                proBatchNo: this.form.proBatchNo,
                                proType: this.form.proType,
                                proInsureNo: this.form.proInsureNo,
                                proInsureCo: this.form.proInsureCo,
                                propertyProNo: this.form.propertyProNo,
                                frozenStartTime: this.form.frozenStartTime,
                                frozenAmount: this.form.frozenAmount,
                                respondentName: this.form.respondentName,
                                house: this.form.house,
                                vehicle: this.form.vehicle,
                            };
                            protectApi.updateReviewInfo(param).then((res) => {
                                if (res.code === 200) {
                                    this.msgSuccess("修改成功");
                                    this.$emit("refresh");
                                    this.dialogVisible = false;
                                }
                            });
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

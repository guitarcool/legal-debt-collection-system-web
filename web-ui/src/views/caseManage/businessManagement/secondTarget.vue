<template>
    <Dialog :title="title" :height="550" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <el-form-item label="统计团队：" prop="teamId">
                    <el-select :disabled="teamIdDisabled" filterable size="small" v-model="form.teamId" placeholder="请选择" @change="queryUserDepts">
                        <el-option v-for="item in userDepts" :key="item.deptId" :label="item.deptName"
                            :value="item.deptId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计月份：" prop="targetMonth">
                    <el-date-picker :disabled="targetMonthDisabled" v-model="form.targetMonth" type="month" size="small"
                        value-format="yyyy-MM" style="width: 200px" @keyup.enter.native="handleQuery"
                        placeholder="选择月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="团队成员回款目标："></el-form-item>
                <div style="width: 85%;margin:0 auto;">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails">添加</el-button>
                    <el-button type="success" icon="el-icon-delete" size="mini" @click="handleDeleteDetails">删除
                    </el-button>
                </div>
                <el-table :data="list" show-summary
                    style="margin:0 auto;width: 85%;margin-bottom: 20px;margin-top: 20px">
                    <el-table-column prop="batchNo" label="产品批次号">
                        <template slot-scope="scope">
                            <el-select size="small" filterable v-model="scope.row.batchNo" placeholder="请选择">
                                <el-option v-for="item in batchNoList" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="targetAmount" label="回款金额（元）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.targetAmount"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
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
    import {
        initObj
    } from '@/utils/common'
    import businessApi from "@/api/case/business/index";

    export default {
        //已强制执行
        name: "addPhone",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    teamId: "",
                    targetMonth: "",
                },
                teamIdDisabled: false,
                targetMonthDisabled: false,
                repaymentList: [{
                        repaymentChannel: "调解回款",
                        repayment: "",
                    },
                    {
                        repaymentChannel: "立案回款",
                        repayment: "",
                    },
                    {
                        repaymentChannel: "财保回款",
                        repayment: "",
                    },
                    {
                        repaymentChannel: "仲裁回款",
                        repayment: "",
                    },

                ],
                list: [],
                rules: {
                    teamId: [{
                        required: true,
                        message: '请选择统计团队',
                        trigger: 'change'
                    }],
                    targetMonth: [{
                        required: true,
                        message: '请选择统计日期',
                        trigger: 'change'
                    }],
                },
                userDepts: [],
                batchNoList: [],
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
            teamId: {
                type: Number,
                default: 0,
            },
            date: {
                type: String,
                default: "",
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
        created() {},
        methods: {
            openDialog() {
                this.getUserDepts();
                if (this.title == "编辑产品目标") {
                    this.getDetail();
                    this.targetMonthDisabled = true;
                    this.teamIdDisabled = true;
                } else if (this.title == "新增产品目标") {
                    this.targetMonthDisabled = false;
                    this.teamIdDisabled = false;
                    initObj(this.form)
                    this.list = [];
                    this.resetAddForm();
                }
            },
            /** 询当前用户所在的所有部门 */
            getUserDepts() {
                businessApi.userDepts().then(
                    response => {
                        this.userDepts = response.data;
                    }
                );
            },
            //添加
            handleAddDetails() {
                if (this.list == undefined) {
                    this.list = new Array();
                }
                let obj = {};
                obj.batchNo = "";
                obj.targetAmount = "";
                this.list.push(obj);
            },
            handleDeleteDetails() {
                this.list.pop();
            },
            queryUserDepts(value) {
                this.getbatchNoList(value);
            },
            /** 查询当前用户 */
            getbatchNoList(deptId) {
                businessApi.batchNoList(deptId).then(
                    response => {
                        this.batchNoList = response.data;
                    }
                );
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            //查询成员回款详情列表
            getDetail() {
                let queryParams = {
                    date: this.date,
                    teamId: this.teamId
                }
                businessApi.targetDetail(queryParams).then((response) => {
                    this.form.targetMonth = response.data.targetMonth;
                    this.form.teamId = response.data.teamId;
                    this.list = response.data.list;
                });
            },
            submit() {
                if (this.title == "编辑产品目标") {
                    this.form.type = 2;
                } else if (this.title == "新增产品目标") {
                    this.form.type = 1;
                }
                this.form.list = this.list;
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        businessApi.productAddOrUpdate(this.form).then(res => {
                            if (res.code === 200) {
                                if (this.title == "编辑产品目标") {
                                    this.msgSuccess("编辑成功");
                                } else if (this.title == "新增产品目标") {
                                    this.msgSuccess("新增成功");
                                }
                                this.dialogVisible = false;
                                this.$emit('refresh');
                            }
                        })
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

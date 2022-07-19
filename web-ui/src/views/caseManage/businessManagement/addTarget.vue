<template>
    <Dialog :title="title" :height="550" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <el-form-item label="统计团队：" prop="teamId">
                    <el-select :disabled="teamIdDisabled" filterable size="small" v-model="form.teamId" placeholder="请选择"
                        @change="queryUserDepts">
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
                <el-table :data="userList" show-summary
                    style="margin:0 auto;width: 85%;margin-bottom: 20px;margin-top: 20px">
                    <el-table-column prop="userId" label="团队成员">
                        <template slot-scope="scope">
                            <el-select :disabled="disabled" filterable size="small" v-model="scope.row.userId" placeholder="请选择">
                                <el-option v-for="item in listByDept" :key="item.userId" :label="item.userName"
                                    :value="item.userId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userTarget" label="回款金额（元）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.userTarget"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item label="各渠道回款目标："></el-form-item>
                <el-form-item label="注：">
                    <span style="color:red">各渠道回款金额合计需与团队成员回款金额合计相一致</span>
                </el-form-item>
                <el-table :data="repaymentList" show-summary
                    style="margin:0 auto;width: 85%;margin-bottom: 20px;margin-top: 20px">
                    <el-table-column prop="repaymentChannel" label="回款渠道">
                        <template slot-scope="scope">
                            <el-input disabled v-model="scope.row.repaymentChannel"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sourceTarget" label="回款金额（元）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.sourceTarget"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" v-debounce @click="submit">确 定</el-button>
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
                    source: []
                },
                teamIdDisabled: false,
                targetMonthDisabled: false,
                repaymentList: [
                    {
                        repaymentChannel: "财保回款",
                        source: 0,
                        sourceTarget: "",
                    },
                    {
                        repaymentChannel: "调解回款",
                        source: 1,
                        sourceTarget: "",
                    },
                    {
                        repaymentChannel: "立案回款",
                        source: 2,
                        sourceTarget: "",
                    },
                    {
                        repaymentChannel: "仲裁回款",
                        source: 3,
                        sourceTarget: "",
                    },

                ],
                userList: [],
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
                listByDept: [],
                disabled: true,
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
                if (this.title == "编辑成员目标") {
                    this.getDetail();
                    this.targetMonthDisabled = true;
                    this.teamIdDisabled = true;
                    this.disabled = false;
                } else if (this.title == "新增成员目标") {
                    this.targetMonthDisabled = false;
                    this.teamIdDisabled = false;
                    this.disabled = true;
                    this.repaymentList[0].sourceTarget = "";
                    this.repaymentList[1].sourceTarget = "";
                    this.repaymentList[2].sourceTarget = "";
                    this.repaymentList[3].sourceTarget = "";
                    initObj(this.form)
                    this.userList = [];
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
            queryUserDepts(value) {
                this.getListByDept(value);
            },
            //添加
            handleAddDetails() {
                if (this.userList == undefined) {
                    this.userList = new Array();
                }
                let obj = {};
                obj.userId = "";
                obj.userTarget = "";
                this.userList.push(obj);
            },
            handleDeleteDetails() {
                this.userList.pop();
            },
            /** 查询当前用户 */
            getListByDept(deptId) {
                businessApi.listByDept(deptId).then(
                    response => {
                        this.listByDept = response.data;
                        this.disabled = false;
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
                businessApi.productDetail(queryParams).then((response) => {
                    this.form.targetMonth = response.data.targetMonth;
                    this.form.teamId = response.data.teamId;
                    this.getListByDept(this.form.teamId);
                    this.userList = response.data.userList;
                    let obj = this.repaymentList.map((item,index) => {
                        return {...item, ...response.data.source[index]};
                    });
                    this.repaymentList =  obj; 
                });
            },
            submit() {
                if (this.title == "编辑成员目标") {
                    this.form.type = 2;
                } else if (this.title == "新增成员目标") {
                    this.form.type = 1;
                }
                this.form.userList = this.userList;
                this.form.source = this.repaymentList;
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        businessApi.teamUserAddOrUpdate(this.form).then(res => {
                            if (res.code === 200) {
                                if (this.title == "编辑成员目标") {
                                    this.msgSuccess("编辑成功");
                                } else if (this.title == "新增成员目标") {
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
